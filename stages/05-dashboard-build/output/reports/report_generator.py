"""
Weekly report generator — Stage 05 output.
Reads from Supabase, renders Jinja2 HTML template, converts to PDF via pdfkit,
sends via Resend API.

Usage:
    python report_generator.py

Required env vars (copy .env.example and fill in):
    SUPABASE_URL
    SUPABASE_SERVICE_KEY
    CLIENT_ID
    RECIPIENT_EMAIL
    RESEND_API_KEY
"""
from __future__ import annotations

import os
import tempfile
from datetime import date, timedelta
from pathlib import Path

import pdfkit
import resend
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader
from supabase import create_client, Client

load_dotenv()

# ── Configuration ─────────────────────────────────────────────────────────────
SUPABASE_URL         = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
CLIENT_ID            = os.environ["CLIENT_ID"]
RECIPIENT_EMAIL      = os.environ["RECIPIENT_EMAIL"]
RESEND_API_KEY       = os.environ["RESEND_API_KEY"]
FROM_EMAIL           = os.environ.get("FROM_EMAIL", "reports@pixelpro.ca")

TEMPLATES_DIR = Path(__file__).parent / "templates"

# Lazily initialised so tests can import without valid env vars.
_supabase: Client | None = None


def _get_client() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    return _supabase


# ── Data fetching ──────────────────────────────────────────────────────────────

def fetch_report_data(
    client_id: str,
    week_start: date,
    week_end: date,
) -> dict:
    """
    Query daily_metrics and funnel data from Supabase for the given week range.

    Returns a context dict ready to be passed to render_html().
    """
    sb = _get_client()

    # Daily metrics for the current week
    metrics_resp = (
        sb.table("daily_metrics")
        .select("*")
        .eq("client_id", client_id)
        .gte("date", week_start.isoformat())
        .lte("date", week_end.isoformat())
        .execute()
    )
    daily_rows: list[dict] = metrics_resp.data or []

    # Derive aggregate KPIs
    def _sum(name: str) -> float:
        return sum(float(r.get("value", 0)) for r in daily_rows if r.get("metric_name") == name)

    page_views          = _sum("page_views")
    add_to_cart         = _sum("add_to_cart_count")
    checkout_initiated  = _sum("checkout_initiated")
    purchase_count      = _sum("purchase_count")
    revenue             = _sum("revenue")
    new_customers       = _sum("new_customers")
    returning_customers = _sum("returning_customers")
    total_customers     = _sum("total_customers")

    add_to_cart_rate          = (add_to_cart / page_views * 100)      if page_views > 0         else 0.0
    cart_to_checkout_rate     = (checkout_initiated / add_to_cart * 100) if add_to_cart > 0      else 0.0
    checkout_completion_rate  = (purchase_count / checkout_initiated * 100) if checkout_initiated > 0 else 0.0
    cart_abandonment_rate     = 100.0 - checkout_completion_rate
    aov                       = (revenue / purchase_count)             if purchase_count > 0     else 0.0
    returning_customer_rate   = (returning_customers / total_customers * 100) if total_customers > 0 else 0.0

    kpis = [
        {"name": "Add-to-Cart Rate",              "value": add_to_cart_rate,         "unit": "percent",  "change": None},
        {"name": "Cart-to-Checkout Rate",          "value": cart_to_checkout_rate,    "unit": "percent",  "change": None},
        {"name": "Checkout Completion Rate",       "value": checkout_completion_rate, "unit": "percent",  "change": None},
        {"name": "Cart Abandonment Rate",          "value": cart_abandonment_rate,    "unit": "percent",  "change": None},
        {"name": "Average Order Value",            "value": aov,                      "unit": "currency", "change": None},
        {"name": "Revenue by Category",            "value": revenue,                  "unit": "currency", "change": None},
        {"name": "New Customers",                  "value": new_customers,            "unit": "count",    "change": None},
        {"name": "30-Day Returning Customer Rate", "value": returning_customer_rate,  "unit": "percent",  "change": None},
    ]

    # Funnel steps — fetch from the funnels table (use first funnel for this client)
    funnel_resp = (
        sb.table("funnels")
        .select("id, name, steps(*)")
        .eq("client_id", client_id)
        .limit(1)
        .execute()
    )
    funnel_data  = (funnel_resp.data or [{}])[0]
    funnel_steps = sorted(
        funnel_data.get("steps", []),
        key=lambda s: s.get("step_number", 0),
    )

    # Top products — from a product_metrics or order_items view (best-effort)
    products_resp = (
        sb.table("product_metrics")
        .select("name, orders, revenue")
        .eq("client_id", client_id)
        .gte("date", week_start.isoformat())
        .lte("date", week_end.isoformat())
        .order("revenue", desc=True)
        .limit(5)
        .execute()
    )
    top_products: list[dict] = products_resp.data or []

    # Cohort snapshot — week_0 and week_1 retention for recent cohorts
    cohorts_resp = (
        sb.table("cohort_retention")
        .select("cohort_week, week_0, week_1")
        .eq("client_id", client_id)
        .order("cohort_week", desc=True)
        .limit(8)
        .execute()
    )
    cohort_summary: list[dict] = cohorts_resp.data or []

    return {
        "report_date":    date.today().strftime("%B %d, %Y"),
        "week_start":     week_start.strftime("%B %d, %Y"),
        "week_end":       week_end.strftime("%B %d, %Y"),
        "client_name":    "PixelPro Analytics",
        "kpis":           kpis,
        "funnel_steps":   funnel_steps,
        "top_products":   top_products,
        "cohort_summary": cohort_summary,
    }


# ── Rendering ─────────────────────────────────────────────────────────────────

def render_html(data: dict, template_path: str = "weekly_report.html") -> str:
    """
    Render the Jinja2 HTML template with the provided data dict.

    Args:
        data:          Context variables matching the Jinja2 template.
        template_path: Filename relative to the templates/ directory.

    Returns:
        Rendered HTML string.
    """
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=True,
    )
    template = env.get_template(template_path)
    return template.render(**data)


# ── PDF conversion ─────────────────────────────────────────────────────────────

def html_to_pdf(html: str, output_path: str) -> None:
    """
    Convert an HTML string to a PDF file at output_path using pdfkit (wkhtmltopdf).

    Args:
        html:        Full HTML content as a string.
        output_path: Absolute path where the PDF should be written.
    """
    options = {
        "quiet":               "",
        "page-size":           "A4",
        "margin-top":          "10mm",
        "margin-right":        "10mm",
        "margin-bottom":       "10mm",
        "margin-left":         "10mm",
        "encoding":            "UTF-8",
        "no-outline":          None,
        "enable-local-file-access": None,
    }
    pdfkit.from_string(html, output_path, options=options)


# ── Email delivery ─────────────────────────────────────────────────────────────

def send_report_email(
    pdf_path: str,
    recipient: str,
    week_start: date,
) -> None:
    """
    Send the generated PDF report via the Resend API.

    Args:
        pdf_path:   Path to the PDF file on disk.
        recipient:  Destination email address.
        week_start: Start of the report week (used in the subject line).
    """
    resend.api_key = RESEND_API_KEY

    week_label = week_start.strftime("%B %d, %Y")
    subject    = f"PixelPro Analytics — Weekly Report ({week_label})"

    with open(pdf_path, "rb") as fh:
        pdf_bytes = fh.read()

    filename = f"pixelpro-weekly-{week_start.isoformat()}.pdf"

    resend.Emails.send({
        "from":    FROM_EMAIL,
        "to":      [recipient],
        "subject": subject,
        "html": (
            "<p>Hi,</p>"
            f"<p>Your PixelPro Analytics weekly report for the week of {week_label} is attached.</p>"
            "<p>Log in to the dashboard for interactive charts and deeper insights.</p>"
            "<p style='color:#64748B; font-size:12px;'>PixelPro Analytics | muddinal@uoguelph.ca</p>"
        ),
        "attachments": [
            {
                "filename": filename,
                "content":  list(pdf_bytes),
            }
        ],
    })


# ── Main orchestrator ──────────────────────────────────────────────────────────

def generate_weekly_report() -> None:
    """
    Full pipeline:
      1. Determine the last complete Mon–Sun week.
      2. Fetch report data from Supabase.
      3. Render HTML template.
      4. Convert to PDF.
      5. Send email via Resend.
      6. Insert / update the reports table record with status='complete' and report_url.
    """
    # Determine last Monday–Sunday window
    today     = date.today()
    # Go back to last Monday
    days_since_monday = today.weekday()  # Monday = 0
    last_monday = today - timedelta(days=days_since_monday + 7)
    last_sunday = last_monday + timedelta(days=6)

    week_start = last_monday
    week_end   = last_sunday

    print(f"Generating weekly report for {week_start} – {week_end}…")

    # 1. Fetch data
    data = fetch_report_data(CLIENT_ID, week_start, week_end)

    # 2. Render HTML
    html = render_html(data)

    # 3. Convert to PDF (write to a temp file)
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        pdf_path = tmp.name

    html_to_pdf(html, pdf_path)
    print(f"PDF written to {pdf_path}")

    # 4. Insert a pending report record so we get an ID
    sb = _get_client()
    insert_resp = (
        sb.table("reports")
        .insert({
            "client_id":  CLIENT_ID,
            "status":     "generating",
            "created_at": date.today().isoformat(),
        })
        .execute()
    )
    report_id = insert_resp.data[0]["id"]

    # 5. Send email
    send_report_email(pdf_path, RECIPIENT_EMAIL, week_start)
    print(f"Report emailed to {RECIPIENT_EMAIL}")

    # 6. Mark report complete — in a real deployment the PDF would be uploaded
    #    to Supabase Storage and the public URL stored here.
    report_url = f"https://hsjwzdgagfbfmqkjsvkw.supabase.co/storage/v1/object/public/reports/{report_id}.pdf"

    sb.table("reports").update({
        "status":     "complete",
        "report_url": report_url,
    }).eq("id", report_id).execute()

    print(f"Report complete. ID: {report_id}")

    # Clean up temp file
    try:
        os.unlink(pdf_path)
    except OSError:
        pass


if __name__ == "__main__":
    generate_weekly_report()

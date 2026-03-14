"""
PixelPro Analytics — Weekly / Monthly Report Generator
Reads metrics from Supabase, renders a Jinja2 HTML template, converts to PDF,
stores the record in the reports table, and sends via Resend.
"""
from __future__ import annotations

import os
import json
import datetime
import base64
import tempfile
from pathlib import Path

import pdfkit
import resend
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL         = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
RESEND_API_KEY       = os.environ["RESEND_API_KEY"]
FROM_EMAIL           = os.environ.get("FROM_EMAIL", "reports@pixelpro.ca")
CLIENT_ID            = os.environ["CLIENT_ID"]
RECIPIENT_EMAIL      = os.environ["RECIPIENT_EMAIL"]

TEMPLATES_DIR = Path(__file__).parent / "templates"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def _fetch_metrics(client_id: str, from_date: str, to_date: str) -> list[dict]:
    resp = (
        supabase.table("daily_metrics")
        .select("*")
        .eq("client_id", client_id)
        .gte("date", from_date)
        .lte("date", to_date)
        .execute()
    )
    return resp.data or []


def _fetch_prior_metrics(client_id: str, from_date: str, to_date: str) -> list[dict]:
    from_dt  = datetime.date.fromisoformat(from_date)
    to_dt    = datetime.date.fromisoformat(to_date)
    delta    = (to_dt - from_dt) + datetime.timedelta(days=1)
    prior_to = (from_dt - datetime.timedelta(days=1)).isoformat()
    prior_from = (from_dt - delta).isoformat()
    return _fetch_metrics(client_id, prior_from, prior_to)


def _aggregate(rows: list[dict]) -> dict:
    revenue   = sum(float(r.get("value", 0)) for r in rows if r.get("metric_name") == "revenue")
    orders    = sum(int(r.get("value", 0))   for r in rows if r.get("metric_name") == "purchase_count")
    sessions  = sum(int(r.get("value", 0))   for r in rows if r.get("metric_name") == "sessions")
    aov       = revenue / orders if orders > 0 else 0.0
    return {"revenue": revenue, "orders": orders, "sessions": sessions, "aov": aov}


def _pct_change(current: float, prior: float) -> float:
    if prior == 0:
        return 0.0
    return round((current - prior) / prior * 100, 1)


def generate_weekly_report(client_id: str = CLIENT_ID) -> str:
    """Generate a weekly PDF report and return the report record ID."""
    today     = datetime.date.today()
    week_end  = today - datetime.timedelta(days=today.weekday() + 1)   # last Sunday
    week_start = week_end - datetime.timedelta(days=6)

    current_rows = _fetch_metrics(client_id, week_start.isoformat(), week_end.isoformat())
    prior_rows   = _fetch_prior_metrics(client_id, week_start.isoformat(), week_end.isoformat())

    current = _aggregate(current_rows)
    prior   = _aggregate(prior_rows)

    context = {
        "client_name":  "PixelPro Analytics",
        "period_start": week_start.strftime("%B %d, %Y"),
        "period_end":   week_end.strftime("%B %d, %Y"),
        "generated_on": today.strftime("%B %d, %Y"),
        "metrics":      current,
        "changes": {
            "revenue":  _pct_change(current["revenue"],  prior["revenue"]),
            "orders":   _pct_change(current["orders"],   prior["orders"]),
            "sessions": _pct_change(current["sessions"], prior["sessions"]),
            "aov":      _pct_change(current["aov"],      prior["aov"]),
        },
        "daily_rows": current_rows,
    }

    env      = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)), autoescape=True)
    template = env.get_template("weekly_report.html")
    html     = template.render(**context)

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        pdf_path = tmp.name

    pdfkit.from_string(html, pdf_path, options={"quiet": ""})

    # Insert report record
    record = (
        supabase.table("reports")
        .insert({
            "client_id":    client_id,
            "report_type":  "weekly",
            "period_start": week_start.isoformat(),
            "period_end":   week_end.isoformat(),
            "status":       "ready",
        })
        .execute()
    )
    report_id = record.data[0]["id"]

    send_report_email(pdf_path, context, report_id)

    os.unlink(pdf_path)
    return report_id


def send_report_email(pdf_path: str, context: dict, report_id: str) -> None:
    """Send the generated PDF via Resend."""
    resend.api_key = RESEND_API_KEY

    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    resend.Emails.send({
        "from":    FROM_EMAIL,
        "to":      [RECIPIENT_EMAIL],
        "subject": f"PixelPro Weekly Report — {context['period_start']} to {context['period_end']}",
        "html":    f"<p>Hi,</p><p>Your weekly analytics report (ID: {report_id}) is attached.</p>",
        "attachments": [{
            "filename": f"pixelpro-weekly-{context['period_end'].replace(' ', '-')}.pdf",
            "content":  list(pdf_bytes),
        }],
    })


if __name__ == "__main__":
    rid = generate_weekly_report()
    print(f"Report generated: {rid}")

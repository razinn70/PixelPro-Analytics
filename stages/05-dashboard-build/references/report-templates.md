# Report Templates

## Weekly Summary Report

Generated every Monday, covering the previous 7 days.

### Sections
1. **Executive Summary** — 3-5 bullet points: biggest wins, biggest drops, action item
2. **Traffic Overview** — Sessions, page views, bounce rate vs prior week
3. **Conversion Performance** — Conversion rate, top funnel, cart abandonment (if ecommerce)
4. **Revenue Snapshot** — Total revenue, AOV, order count (if ecommerce)
5. **Top Pages** — 5 most visited pages with session count
6. **Trend Chart** — 4-week daily sessions line chart (PNG embedded)
7. **Recommendations** — 2-3 data-driven suggestions

### Generation Script

File: `services/etl/pipelines/report_generator.py`

```python
from datetime import date, timedelta
from jinja2 import Environment, FileSystemLoader
import pdfkit

def generate_weekly_report(client_id: str, week_end: date = None):
    if week_end is None:
        week_end = date.today() - timedelta(days=1)
    week_start = week_end - timedelta(days=6)

    # Fetch metrics from DB
    metrics = fetch_metrics(client_id, week_start, week_end)
    prior_metrics = fetch_metrics(client_id, week_start - timedelta(days=7), week_end - timedelta(days=7))

    # Render HTML template
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('weekly_report.html')
    html = template.render(
        client=get_client(client_id),
        metrics=metrics,
        prior=prior_metrics,
        week_start=week_start,
        week_end=week_end,
    )

    # Convert to PDF
    pdf_path = f'output/{client_id}/reports/weekly_{week_end.isoformat()}.pdf'
    pdfkit.from_string(html, pdf_path)

    # Store record in DB
    store_report(client_id, 'weekly', week_start, week_end, {'pdf_path': pdf_path})

    return pdf_path
```

## Monthly Summary Report

Generated on the 1st of each month, covering the previous calendar month.

Includes all weekly sections plus:
- **Month-over-Month Comparison** — all KPIs vs previous month
- **Cohort Retention Table** (ecommerce/restaurant)
- **Goal Progress** — progress toward client's stated KPI targets
- **30-Day Trend Charts** for each primary KPI

## Email Delivery

Reports are emailed to the client contact on file:

```python
import resend  # or SendGrid

resend.Emails.send({
    "from": "reports@pixelpro.ca",
    "to": client.contact_email,
    "subject": f"Your Weekly Analytics Report — {client.name}",
    "html": render_email_body(metrics),
    "attachments": [{ "filename": "weekly-report.pdf", "content": pdf_bytes }]
})
```

"""
Weekly/Monthly Report Generator
Fetches metrics, renders Jinja2 HTML template, converts to PDF, emails to client.
"""
import os
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client
from jinja2 import Environment, FileSystemLoader
import pdfkit
import resend

load_dotenv()

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])
resend.api_key = os.environ.get('RESEND_API_KEY', '')
CLIENT_ID = os.environ.get('CLIENT_ID')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', '')

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), '..', 'templates')
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))


def fetch_metrics(client_id: str, from_date: date, to_date: date) -> dict:
    result = (
        supabase.table('daily_metrics')
        .select('*')
        .eq('client_id', client_id)
        .gte('date', from_date.isoformat())
        .lte('date', to_date.isoformat())
        .execute()
    )
    metrics: dict = {}
    for row in result.data:
        metrics[row['metric_name']] = metrics.get(row['metric_name'], 0) + row['metric_value']
    return metrics


def generate_weekly_report(client_id: str, week_end: date | None = None) -> str:
    """Generate weekly PDF report. Returns the PDF file path."""
    if week_end is None:
        week_end = date.today() - timedelta(days=1)
    week_start = week_end - timedelta(days=6)
    prior_end   = week_start - timedelta(days=1)
    prior_start = prior_end - timedelta(days=6)

    client = supabase.table('clients').select('*').eq('id', client_id).single().execute()
    metrics = fetch_metrics(client_id, week_start, week_end)
    prior   = fetch_metrics(client_id, prior_start, prior_end)

    template = env.get_template('weekly_report.html')
    html = template.render(
        client=client.data,
        metrics=metrics,
        prior=prior,
        week_start=week_start,
        week_end=week_end,
    )

    output_dir = f'/tmp/reports/{client_id}'
    os.makedirs(output_dir, exist_ok=True)
    pdf_path = f'{output_dir}/weekly_{week_end.isoformat()}.pdf'

    pdfkit.from_string(html, pdf_path, options={'quiet': ''})

    # Store record in DB
    supabase.table('reports').insert({
        'client_id':    client_id,
        'report_type':  'weekly',
        'period_start': week_start.isoformat(),
        'period_end':   week_end.isoformat(),
        'data':         {'pdf_path': pdf_path, 'status': 'generated'},
    }).execute()

    print(f"Report generated: {pdf_path}")
    return pdf_path


def send_report_email(client: dict, pdf_path: str) -> None:
    if not resend.api_key:
        print("RESEND_API_KEY not set — skipping email delivery")
        return

    recipient = RECIPIENT_EMAIL or client.get('contact_email', '')
    if not recipient:
        print("No recipient email configured â€” skipping email delivery")
        return

    with open(pdf_path, 'rb') as f:
        pdf_bytes = f.read()

    resend.Emails.send({
        'from':    'reports@pixelpro.ca',
        'to':      recipient,
        'subject': f"Your Weekly Analytics Report — {client['name']}",
        'html':    f"<p>Hi {client['name']},</p><p>Your weekly analytics report is attached.</p><p>— PixelPro Analytics</p>",
        'attachments': [{
            'filename': 'weekly-report.pdf',
            'content':  list(pdf_bytes),
        }],
    })


if __name__ == '__main__':
    query = supabase.table('clients').select('*').eq('active', True)
    if CLIENT_ID:
        query = query.eq('id', CLIENT_ID)

    clients = query.execute()
    for client in clients.data:
        pdf = generate_weekly_report(client['id'])
        send_report_email(client, pdf)

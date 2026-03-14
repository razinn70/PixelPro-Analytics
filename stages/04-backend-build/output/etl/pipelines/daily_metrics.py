"""
Daily Metrics ETL Pipeline
Aggregates raw events into daily_metrics table.
Idempotent: safe to run multiple times for the same date (uses UPSERT).
Schedule: daily at 6am UTC via GitHub Actions.
"""
import os
import sys
import requests
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL         = os.environ['SUPABASE_URL']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_KEY']
HEARTBEAT_URL        = os.environ.get('HEARTBEAT_URL')

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def run(target_date: date | None = None) -> int:
    """Aggregate events for target_date into daily_metrics. Returns row count."""
    if target_date is None:
        target_date = date.today() - timedelta(days=1)

    print(f"Running daily_metrics aggregation for {target_date}")

    result = supabase.rpc(
        'aggregate_daily_metrics',
        {'target_date': target_date.isoformat()}
    ).execute()

    row_count = len(result.data) if result.data else 0
    print(f"Aggregated {row_count} metric rows for {target_date}")

    # Also run ecommerce metrics if function exists
    try:
        supabase.rpc(
            'aggregate_ecommerce_metrics',
            {'target_date': target_date.isoformat()}
        ).execute()
        print("Ecommerce metrics aggregated")
    except Exception as e:
        print(f"Ecommerce metrics skipped (non-fatal): {e}")

    return row_count


def send_heartbeat() -> None:
    if HEARTBEAT_URL:
        try:
            requests.get(HEARTBEAT_URL, timeout=10)
        except Exception:
            pass  # heartbeat failure is non-fatal


if __name__ == '__main__':
    target = date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else None
    run(target)
    send_heartbeat()

"""
Cohort Analysis Pipeline
Builds weekly retention cohorts: % of users who returned each week after first purchase.
Writes 8x8 matrix into daily_metrics with dimension={cohort_week, retention_week}.
"""
import os
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])


def build_cohorts(client_id: str, num_weeks: int = 8) -> None:
    """Build cohort retention matrix for the past num_weeks."""
    today = date.today()

    for cohort_offset in range(num_weeks):
        # Cohort start = Monday of the cohort week
        cohort_start = today - timedelta(weeks=cohort_offset + 1)
        cohort_start = cohort_start - timedelta(days=cohort_start.weekday())  # align to Monday
        cohort_end   = cohort_start + timedelta(days=6)

        # Sessions that first purchased during cohort week
        first_purchasers = (
            supabase.table('events')
            .select('session_id')
            .eq('client_id', client_id)
            .eq('event_name', 'purchase')
            .gte('created_at', f'{cohort_start}T00:00:00Z')
            .lte('created_at', f'{cohort_end}T23:59:59Z')
            .execute()
        )
        cohort_sessions = {r['session_id'] for r in first_purchasers.data}
        cohort_size = len(cohort_sessions)

        if cohort_size == 0:
            continue

        # For each retention week, count how many cohort sessions returned
        for ret_week in range(num_weeks - cohort_offset):
            ret_start = cohort_start + timedelta(weeks=ret_week + 1)
            ret_end   = ret_start + timedelta(days=6)

            returning = (
                supabase.table('events')
                .select('session_id')
                .eq('client_id', client_id)
                .eq('event_name', 'purchase')
                .gte('created_at', f'{ret_start}T00:00:00Z')
                .lte('created_at', f'{ret_end}T23:59:59Z')
                .in_('session_id', list(cohort_sessions))
                .execute()
            )
            retained = len({r['session_id'] for r in returning.data})
            retention_pct = round(retained / cohort_size * 100, 1)

            dimension = {
                'cohort_week':    cohort_start.isoformat(),
                'retention_week': ret_week,
            }
            supabase.table('daily_metrics').upsert({
                'client_id':    client_id,
                'date':         cohort_start.isoformat(),
                'metric_name':  'cohort_retention',
                'metric_value': retention_pct,
                'dimension':    dimension,
            }, on_conflict='client_id,date,metric_name,dimension').execute()

    print(f"Cohorts built for client {client_id}")


if __name__ == '__main__':
    clients = supabase.table('clients').select('id').eq('active', True).execute()
    for client in clients.data:
        build_cohorts(client['id'])

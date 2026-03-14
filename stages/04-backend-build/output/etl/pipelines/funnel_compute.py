"""
Funnel Computation Pipeline
Calculates step-by-step conversion rates per funnel per day.
Writes results into daily_metrics with dimension={funnel_id, step_index}.
Idempotent via UPSERT.
"""
import os
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])


def compute_funnel(funnel_id: str, client_id: str, target_date: date) -> None:
    """Compute step conversion counts for a single funnel on target_date."""
    # Fetch funnel step definitions
    funnel = supabase.table('funnels').select('steps').eq('id', funnel_id).single().execute()
    steps = funnel.data['steps']

    for step in steps:
        idx = step['index']

        count_result = (
            supabase.table('funnel_events')
            .select('session_id', count='exact')
            .eq('funnel_id', funnel_id)
            .eq('step_index', idx)
            .gte('completed_at', f'{target_date}T00:00:00Z')
            .lt('completed_at', f'{target_date + timedelta(days=1)}T00:00:00Z')
            .execute()
        )

        count = count_result.count or 0
        dimension = {'funnel_id': funnel_id, 'step_index': idx, 'step_name': step['name']}

        supabase.table('daily_metrics').upsert({
            'client_id':    client_id,
            'date':         target_date.isoformat(),
            'metric_name':  'funnel_step_count',
            'metric_value': count,
            'dimension':    dimension,
        }, on_conflict='client_id,date,metric_name,dimension').execute()

    print(f"Funnel {funnel_id} computed for {target_date}: {len(steps)} steps")


def run_all(target_date: date | None = None) -> None:
    """Run funnel computation for all active clients' funnels."""
    if target_date is None:
        target_date = date.today() - timedelta(days=1)

    clients = supabase.table('clients').select('id').eq('active', True).execute()
    for client in clients.data:
        funnels = supabase.table('funnels').select('id').eq('client_id', client['id']).execute()
        for funnel in funnels.data:
            compute_funnel(funnel['id'], client['id'], target_date)


if __name__ == '__main__':
    import sys
    target = date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else None
    run_all(target)

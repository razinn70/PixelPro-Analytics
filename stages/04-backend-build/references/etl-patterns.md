# ETL Patterns

## Daily Metrics Pipeline

File: `services/etl/pipelines/daily_metrics.py`

```python
"""
Daily Metrics ETL
Aggregates raw events into daily_metrics table.
Idempotent: safe to run multiple times for same date (uses UPSERT).
"""
import os
from datetime import date, timedelta
from supabase import create_client

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])

def run(target_date: date = None):
    if target_date is None:
        target_date = date.today() - timedelta(days=1)

    # Aggregate page views per client
    result = supabase.rpc('aggregate_daily_metrics', {
        'target_date': target_date.isoformat()
    }).execute()

    print(f"Aggregated metrics for {target_date}: {len(result.data)} rows")

if __name__ == '__main__':
    run()
```

## SQL Aggregation Function

```sql
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE)
RETURNS void AS $$
BEGIN
  -- Page views
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'page_views', COUNT(*)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'page_view'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
  SET metric_value = EXCLUDED.metric_value;

  -- Sessions
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'sessions', COUNT(DISTINCT session_id)
  FROM events
  WHERE DATE(created_at) = target_date
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
  SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;
```

## Funnel Computation Pipeline

File: `services/etl/pipelines/funnel_compute.py`

```python
"""
Funnel Computation ETL
Calculates step-by-step conversion rates for each funnel.
"""

def compute_funnel(funnel_id: str, target_date: date):
    funnel = supabase.table('funnels').select('*').eq('id', funnel_id).single().execute()
    steps = funnel.data['steps']

    results = []
    for i, step in enumerate(steps):
        count = supabase.table('funnel_events')\
            .select('session_id', count='exact')\
            .eq('funnel_id', funnel_id)\
            .eq('step_index', i)\
            .gte('completed_at', f'{target_date}T00:00:00Z')\
            .lt('completed_at', f'{target_date + timedelta(days=1)}T00:00:00Z')\
            .execute()
        results.append({'step': i, 'name': step['name'], 'count': count.count})

    return results
```

## Scheduling

Use GitHub Actions for daily ETL:

```yaml
# .github/workflows/etl-daily.yml
name: Daily ETL
on:
  schedule:
    - cron: '0 6 * * *'  # 6am UTC = 2am EST
jobs:
  etl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r services/etl/requirements.txt
      - run: python services/etl/pipelines/daily_metrics.py
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

## Idempotency Rule

Every ETL job MUST use UPSERT (INSERT ... ON CONFLICT DO UPDATE), never plain INSERT. Running the same job twice for the same date must produce the same result.

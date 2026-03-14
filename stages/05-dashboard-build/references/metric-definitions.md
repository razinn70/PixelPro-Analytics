# Metric Definitions

## Core Metrics

### Sessions
Count of distinct `session_id` values in the `events` table for a given client and date range.
```sql
SELECT COUNT(DISTINCT session_id) AS sessions
FROM events
WHERE client_id = $1 AND created_at BETWEEN $2 AND $3;
```

### Page Views
Count of `page_view` events.
```sql
SELECT COUNT(*) AS page_views
FROM events
WHERE client_id = $1 AND event_name = 'page_view'
AND created_at BETWEEN $2 AND $3;
```

### Bounce Rate
Sessions with only 1 page view divided by total sessions.
```sql
WITH session_counts AS (
  SELECT session_id, COUNT(*) as pages
  FROM events
  WHERE client_id = $1 AND event_name = 'page_view'
  AND created_at BETWEEN $2 AND $3
  GROUP BY session_id
)
SELECT ROUND(
  100.0 * COUNT(*) FILTER (WHERE pages = 1) / COUNT(*), 2
) AS bounce_rate
FROM session_counts;
```

## E-Commerce Metrics

### Conversion Rate (Visitor to Purchase)
```sql
SELECT
  ROUND(100.0 * orders / sessions, 2) AS conversion_rate
FROM (
  SELECT
    COUNT(DISTINCT session_id) AS sessions,
    COUNT(DISTINCT session_id) FILTER (
      WHERE session_id IN (
        SELECT DISTINCT session_id FROM events
        WHERE event_name = 'purchase' AND client_id = $1
        AND created_at BETWEEN $2 AND $3
      )
    ) AS orders
  FROM events
  WHERE client_id = $1 AND created_at BETWEEN $2 AND $3
) t;
```

### Average Order Value (AOV)
```sql
SELECT ROUND(AVG((event_data->>'revenue')::NUMERIC), 2) AS aov
FROM events
WHERE client_id = $1 AND event_name = 'purchase'
AND created_at BETWEEN $2 AND $3;
```

### Cart Abandonment Rate
```sql
SELECT ROUND(
  100.0 * (1 - completed_carts::NUMERIC / started_carts), 2
) AS cart_abandonment_rate
FROM (
  SELECT
    COUNT(DISTINCT session_id) FILTER (WHERE event_name = 'add_to_cart') AS started_carts,
    COUNT(DISTINCT session_id) FILTER (WHERE event_name = 'purchase') AS completed_carts
  FROM events
  WHERE client_id = $1 AND created_at BETWEEN $2 AND $3
) t;
```

### Customer Acquisition Cost (CAC)
Manual input: `marketing_spend / new_customers`
Requires marketing spend to be entered manually in client config. New customers = sessions with `purchase` event where session has no prior purchase event (requires cohort logic).

### Customer Lifetime Value (LTV)
```
LTV = AOV × Purchase Frequency × Average Customer Lifespan
```
Requires order history data over time. Approximate with:
```sql
SELECT
  ROUND(AVG(customer_revenue), 2) AS ltv
FROM (
  SELECT
    session_id,
    SUM((event_data->>'revenue')::NUMERIC) AS customer_revenue
  FROM events
  WHERE client_id = $1 AND event_name = 'purchase'
  GROUP BY session_id
) t;
```

## Funnel Metrics

### Step Conversion Rate
```
step_conversion_rate = step_n_completions / step_0_entries
```

### Step Drop-Off Rate
```
drop_off_rate = 1 - (step_n_completions / step_(n-1)_completions)
```

All funnel math validated against raw SQL before dashboard display.

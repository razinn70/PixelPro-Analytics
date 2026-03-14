-- Migration: 001_core_schema
-- Description: Core multi-tenant schema for PixelPro Analytics platform
-- Author: Rajin Uddin
-- Date: 2026-03-14

BEGIN;

-- === UP ===

CREATE TABLE IF NOT EXISTS clients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  slug         TEXT        UNIQUE NOT NULL,
  vertical     TEXT        NOT NULL CHECK (vertical IN ('restaurant', 'ecommerce', 'service')),
  domain       TEXT,
  ga4_property_id TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  active       BOOLEAN     DEFAULT true
);

CREATE TABLE IF NOT EXISTS events (
  id           BIGSERIAL   PRIMARY KEY,
  client_id    UUID        REFERENCES clients(id) ON DELETE CASCADE,
  session_id   TEXT        NOT NULL,
  event_name   TEXT        NOT NULL,
  event_data   JSONB       DEFAULT '{}',
  page_url     TEXT,
  referrer     TEXT,
  user_agent   TEXT,
  ip_hash      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_client_id   ON events(client_id);
CREATE INDEX IF NOT EXISTS idx_events_session_id  ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at  ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_name  ON events(event_name);

CREATE TABLE IF NOT EXISTS daily_metrics (
  id           BIGSERIAL   PRIMARY KEY,
  client_id    UUID        REFERENCES clients(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  metric_name  TEXT        NOT NULL,
  metric_value NUMERIC     NOT NULL,
  dimension    JSONB       DEFAULT '{}',
  UNIQUE (client_id, date, metric_name, dimension)
);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_client_date ON daily_metrics(client_id, date);

CREATE TABLE IF NOT EXISTS funnels (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID        REFERENCES clients(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  steps        JSONB       NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funnels_client_id ON funnels(client_id);

CREATE TABLE IF NOT EXISTS funnel_events (
  id           BIGSERIAL   PRIMARY KEY,
  funnel_id    UUID        REFERENCES funnels(id) ON DELETE CASCADE,
  session_id   TEXT        NOT NULL,
  step_index   INT         NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_funnel_session ON funnel_events(funnel_id, session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_completed_at   ON funnel_events(completed_at);

CREATE TABLE IF NOT EXISTS reports (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID        REFERENCES clients(id) ON DELETE CASCADE,
  report_type  TEXT        NOT NULL,
  period_start DATE        NOT NULL,
  period_end   DATE        NOT NULL,
  data         JSONB       NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_client_id ON reports(client_id);

CREATE TABLE IF NOT EXISTS client_users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id    UUID        REFERENCES clients(id) ON DELETE CASCADE,
  role         TEXT        DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_client_users_user_id ON client_users(user_id);

-- Aggregation function called by daily ETL pipeline
-- Aggregates raw events into daily_metrics for a given date
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE)
RETURNS void AS $$
BEGIN
  -- Page views per client
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'page_views', COUNT(*)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'page_view'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;

  -- Sessions per client
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'sessions', COUNT(DISTINCT session_id)
  FROM events
  WHERE DATE(created_at) = target_date
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;

  -- Add-to-cart events per client
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'add_to_cart_count', COUNT(DISTINCT session_id)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'add_to_cart'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;

  -- Purchase count per client
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'purchase_count', COUNT(DISTINCT session_id)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'purchase'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;

  -- Daily revenue per client
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'revenue',
    COALESCE(SUM((event_data->>'revenue')::NUMERIC), 0)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'purchase'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- === DOWN ===
-- To rollback: create a new migration with:
-- DROP FUNCTION IF EXISTS aggregate_daily_metrics(DATE);
-- DROP TABLE IF EXISTS client_users, reports, funnel_events, funnels, daily_metrics, events, clients CASCADE;

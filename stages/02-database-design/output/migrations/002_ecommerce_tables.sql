-- Migration: 002_ecommerce_tables
-- Description: E-commerce vertical tables (products, orders) for PixelPro Analytics
-- Author: Rajin Uddin
-- Date: 2026-03-14
-- Depends on: 001_core_schema

BEGIN;

-- === UP ===

CREATE TABLE IF NOT EXISTS products (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID          REFERENCES clients(id) ON DELETE CASCADE,
  name            TEXT          NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL,
  category        TEXT,
  sku             TEXT,
  inventory_count INT           DEFAULT 0,
  active          BOOLEAN       DEFAULT true,
  created_at      TIMESTAMPTZ   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_client_id ON products(client_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(client_id, category);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS orders (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID          REFERENCES clients(id) ON DELETE CASCADE,
  session_id  TEXT          NOT NULL,
  items       JSONB         NOT NULL,
  subtotal    NUMERIC(10,2),
  status      TEXT          DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at  TIMESTAMPTZ   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_client_id  ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Extend daily_metrics aggregation for ecommerce-specific metrics
CREATE OR REPLACE FUNCTION aggregate_ecommerce_metrics(target_date DATE)
RETURNS void AS $$
BEGIN
  -- Average order value
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT client_id, target_date, 'aov',
    COALESCE(AVG((event_data->>'revenue')::NUMERIC), 0)
  FROM events
  WHERE DATE(created_at) = target_date AND event_name = 'purchase'
  GROUP BY client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;

  -- Cart abandonment count (add_to_cart without purchase, same session, same day)
  INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
  SELECT
    atc.client_id,
    target_date,
    'cart_abandonment_count',
    COUNT(DISTINCT atc.session_id) - COUNT(DISTINCT p.session_id)
  FROM
    (SELECT client_id, session_id FROM events
     WHERE DATE(created_at) = target_date AND event_name = 'add_to_cart') atc
  LEFT JOIN
    (SELECT client_id, session_id FROM events
     WHERE DATE(created_at) = target_date AND event_name = 'purchase') p
    ON atc.client_id = p.client_id AND atc.session_id = p.session_id
  GROUP BY atc.client_id
  ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
    SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- === DOWN ===
-- DROP FUNCTION IF EXISTS aggregate_ecommerce_metrics(DATE);
-- DROP TABLE IF EXISTS orders, products CASCADE;

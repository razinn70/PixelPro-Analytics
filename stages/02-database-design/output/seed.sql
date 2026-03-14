-- Seed Data: PixelPro Analytics (pixelpro-analytics)
-- Environment: DEVELOPMENT ONLY — DO NOT RUN IN PRODUCTION
-- Date: 2026-03-14

-- Fixed UUIDs for reproducible dev data
-- Client: 00000000-0000-0000-0000-000000000001
-- Funnel: 00000000-0000-0000-0000-000000000002
-- Products: 00000000-0000-0000-0000-00000000000[3-7]

-- ============================================================
-- 1. Client
-- ============================================================
INSERT INTO clients (id, name, slug, vertical, domain, ga4_property_id, active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'PixelPro Analytics',
  'pixelpro-analytics',
  'ecommerce',
  'pixelpro-analytics.vercel.app',
  'G-XXXXXXXXXX',
  true
)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      domain = EXCLUDED.domain;

-- ============================================================
-- 2. Purchase Funnel (5 steps)
-- ============================================================
INSERT INTO funnels (id, client_id, name, steps)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Purchase Funnel',
  '[
    {"index": 0, "name": "Product Listing View",  "event": "page_view",       "page": "/shop"},
    {"index": 1, "name": "Product Detail View",   "event": "view_item",       "page": "/shop/:id"},
    {"index": 2, "name": "Add to Cart",           "event": "add_to_cart",     "page": "/shop/:id"},
    {"index": 3, "name": "Checkout Initiated",    "event": "begin_checkout",  "page": "/checkout"},
    {"index": 4, "name": "Order Confirmed",       "event": "purchase",        "page": "/confirmation"}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET steps = EXCLUDED.steps;

-- ============================================================
-- 3. Products (5 sample items)
-- ============================================================
INSERT INTO products (id, client_id, name, description, price, category, sku, inventory_count, active)
VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'Analytics Starter Pack', 'Essential analytics setup for small businesses', 299.00, 'services', 'SVC-001', 99, true),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
   'Dashboard Pro Bundle', 'Full KPI dashboard with 30-day setup', 499.00, 'services', 'SVC-002', 99, true),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
   'Monthly Analytics Report', 'Automated weekly + monthly PDF reports', 149.00, 'subscriptions', 'SUB-001', 99, true),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
   'E-Commerce Funnel Audit', 'One-time conversion funnel analysis + recommendations', 199.00, 'services', 'SVC-003', 10, true),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001',
   'Annual Growth Package', '12 months of analytics + quarterly strategy sessions', 1499.00, 'subscriptions', 'SUB-002', 99, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Sample Events (20 rows, last 7 days)
-- Simulates a typical week of ecommerce activity
-- ============================================================
INSERT INTO events (client_id, session_id, event_name, event_data, page_url, referrer, ip_hash, created_at)
VALUES
  -- Day 1: 2 sessions
  ('00000000-0000-0000-0000-000000000001', 'sess-001', 'page_view',      '{}', '/shop', 'https://google.com', 'hash-ip-001', now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000000001', 'sess-001', 'view_item',      '{"item_id":"00000000-0000-0000-0000-000000000003","item_name":"Analytics Starter Pack","price":299.00,"category":"services"}', '/shop/00000000-0000-0000-0000-000000000003', '', 'hash-ip-001', now() - interval '6 days' + interval '2 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-001', 'add_to_cart',    '{"item_id":"00000000-0000-0000-0000-000000000003","item_name":"Analytics Starter Pack","price":299.00,"quantity":1}', '/shop/00000000-0000-0000-0000-000000000003', '', 'hash-ip-001', now() - interval '6 days' + interval '3 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-001', 'begin_checkout', '{"cart_value":299.00,"item_count":1}', '/checkout', '', 'hash-ip-001', now() - interval '6 days' + interval '4 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-001', 'purchase',       '{"transaction_id":"txn-001","revenue":299.00,"item_count":1}', '/confirmation', '', 'hash-ip-001', now() - interval '6 days' + interval '6 min'),
  -- Session 2 (abandon after add to cart)
  ('00000000-0000-0000-0000-000000000001', 'sess-002', 'page_view',      '{}', '/shop', 'https://linkedin.com', 'hash-ip-002', now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000000001', 'sess-002', 'view_item',      '{"item_id":"00000000-0000-0000-0000-000000000004","item_name":"Dashboard Pro Bundle","price":499.00,"category":"services"}', '/shop/00000000-0000-0000-0000-000000000004', '', 'hash-ip-002', now() - interval '5 days' + interval '1 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-002', 'add_to_cart',    '{"item_id":"00000000-0000-0000-0000-000000000004","item_name":"Dashboard Pro Bundle","price":499.00,"quantity":1}', '/shop/00000000-0000-0000-0000-000000000004', '', 'hash-ip-002', now() - interval '5 days' + interval '2 min'),
  -- Day 3: Full purchase
  ('00000000-0000-0000-0000-000000000001', 'sess-003', 'page_view',      '{}', '/shop', '', 'hash-ip-003', now() - interval '4 days'),
  ('00000000-0000-0000-0000-000000000001', 'sess-003', 'view_item',      '{"item_id":"00000000-0000-0000-0000-000000000005","item_name":"Monthly Analytics Report","price":149.00,"category":"subscriptions"}', '/shop/00000000-0000-0000-0000-000000000005', '', 'hash-ip-003', now() - interval '4 days' + interval '3 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-003', 'add_to_cart',    '{"item_id":"00000000-0000-0000-0000-000000000005","item_name":"Monthly Analytics Report","price":149.00,"quantity":1}', '/shop/00000000-0000-0000-0000-000000000005', '', 'hash-ip-003', now() - interval '4 days' + interval '4 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-003', 'begin_checkout', '{"cart_value":149.00,"item_count":1}', '/checkout', '', 'hash-ip-003', now() - interval '4 days' + interval '5 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-003', 'purchase',       '{"transaction_id":"txn-002","revenue":149.00,"item_count":1}', '/confirmation', '', 'hash-ip-003', now() - interval '4 days' + interval '8 min'),
  -- Day 5: Browse only
  ('00000000-0000-0000-0000-000000000001', 'sess-004', 'page_view',      '{}', '/shop', 'https://google.com', 'hash-ip-004', now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'sess-004', 'view_item',      '{"item_id":"00000000-0000-0000-0000-000000000007","item_name":"Annual Growth Package","price":1499.00,"category":"subscriptions"}', '/shop/00000000-0000-0000-0000-000000000007', '', 'hash-ip-004', now() - interval '2 days' + interval '5 min'),
  -- Day 6: Contact form
  ('00000000-0000-0000-0000-000000000001', 'sess-005', 'page_view',      '{}', '/contact', '', 'hash-ip-005', now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'sess-005', 'contact_form_submitted', '{}', '/contact', '', 'hash-ip-005', now() - interval '1 day' + interval '3 min'),
  -- Today: Full purchase + high-value
  ('00000000-0000-0000-0000-000000000001', 'sess-006', 'page_view',      '{}', '/shop', 'https://google.com', 'hash-ip-006', now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000001', 'sess-006', 'view_item',      '{"item_id":"00000000-0000-0000-0000-000000000007","item_name":"Annual Growth Package","price":1499.00,"category":"subscriptions"}', '/shop/00000000-0000-0000-0000-000000000007', '', 'hash-ip-006', now() - interval '55 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-006', 'add_to_cart',    '{"item_id":"00000000-0000-0000-0000-000000000007","item_name":"Annual Growth Package","price":1499.00,"quantity":1}', '/shop/00000000-0000-0000-0000-000000000007', '', 'hash-ip-006', now() - interval '50 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-006', 'begin_checkout', '{"cart_value":1499.00,"item_count":1}', '/checkout', '', 'hash-ip-006', now() - interval '45 min'),
  ('00000000-0000-0000-0000-000000000001', 'sess-006', 'purchase',       '{"transaction_id":"txn-003","revenue":1499.00,"item_count":1}', '/confirmation', '', 'hash-ip-006', now() - interval '40 min');

-- ============================================================
-- 5. Funnel Events (matching the purchase events above)
-- ============================================================
INSERT INTO funnel_events (funnel_id, session_id, step_index, completed_at)
VALUES
  -- sess-001: completed all 5 steps
  ('00000000-0000-0000-0000-000000000002', 'sess-001', 0, now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000000002', 'sess-001', 1, now() - interval '6 days' + interval '2 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-001', 2, now() - interval '6 days' + interval '3 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-001', 3, now() - interval '6 days' + interval '4 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-001', 4, now() - interval '6 days' + interval '6 min'),
  -- sess-002: dropped after step 2
  ('00000000-0000-0000-0000-000000000002', 'sess-002', 0, now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000000002', 'sess-002', 1, now() - interval '5 days' + interval '1 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-002', 2, now() - interval '5 days' + interval '2 min'),
  -- sess-003: completed all 5 steps
  ('00000000-0000-0000-0000-000000000002', 'sess-003', 0, now() - interval '4 days'),
  ('00000000-0000-0000-0000-000000000002', 'sess-003', 1, now() - interval '4 days' + interval '3 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-003', 2, now() - interval '4 days' + interval '4 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-003', 3, now() - interval '4 days' + interval '5 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-003', 4, now() - interval '4 days' + interval '8 min'),
  -- sess-004: dropped after step 1
  ('00000000-0000-0000-0000-000000000002', 'sess-004', 0, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000002', 'sess-004', 1, now() - interval '2 days' + interval '5 min'),
  -- sess-006: completed all 5 steps
  ('00000000-0000-0000-0000-000000000002', 'sess-006', 0, now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000002', 'sess-006', 1, now() - interval '55 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-006', 2, now() - interval '50 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-006', 3, now() - interval '45 min'),
  ('00000000-0000-0000-0000-000000000002', 'sess-006', 4, now() - interval '40 min');

-- ============================================================
-- 6. Daily Metrics (7 days of pre-aggregated data)
-- ============================================================
INSERT INTO daily_metrics (client_id, date, metric_name, metric_value)
VALUES
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 6, 'sessions',          2),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 6, 'page_views',         5),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 6, 'purchase_count',     1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 6, 'revenue',          299.00),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 5, 'sessions',           1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 5, 'page_views',         2),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 5, 'add_to_cart_count',  1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 5, 'revenue',            0),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 4, 'sessions',           1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 4, 'page_views',         3),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 4, 'purchase_count',     1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 4, 'revenue',          149.00),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 2, 'sessions',           1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 2, 'page_views',         2),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'sessions',           1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'page_views',         1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE,     'sessions',           1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE,     'page_views',         4),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE,     'purchase_count',     1),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE,     'revenue',         1499.00),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE,     'aov',             1499.00)
ON CONFLICT (client_id, date, metric_name, dimension) DO UPDATE
  SET metric_value = EXCLUDED.metric_value;

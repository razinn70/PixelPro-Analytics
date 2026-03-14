-- Migration: 003_rls_policies
-- Description: Row-Level Security policies for all tables
-- Author: Rajin Uddin
-- Date: 2026-03-14
-- Depends on: 001_core_schema, 002_ecommerce_tables

BEGIN;

-- === UP ===

-- Enable RLS on all tables
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_users   ENABLE ROW LEVEL SECURITY;
-- products and orders already have RLS enabled from migration 002

-- Helper: get the client_id for the currently authenticated user
-- Used inline in policies to avoid repeated subqueries
-- Note: Supabase service role bypasses all RLS policies

-- === client_users ===
-- Users can only see their own membership rows
CREATE POLICY "client_users_own_memberships"
  ON client_users
  FOR SELECT
  USING (user_id = auth.uid());

-- === events ===
CREATE POLICY "events_client_isolation"
  ON events
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "events_admin_full_access"
  ON events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM client_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- === daily_metrics ===
CREATE POLICY "daily_metrics_client_isolation"
  ON daily_metrics
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- === funnels ===
CREATE POLICY "funnels_client_isolation"
  ON funnels
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- === funnel_events ===
-- Access controlled via funnel_id → funnels → client_id chain
CREATE POLICY "funnel_events_client_isolation"
  ON funnel_events
  FOR ALL
  USING (
    funnel_id IN (
      SELECT id FROM funnels
      WHERE client_id = (
        SELECT client_id FROM client_users
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- === reports ===
CREATE POLICY "reports_client_isolation"
  ON reports
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- === products ===
CREATE POLICY "products_client_isolation"
  ON products
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- Products are also publicly readable (for the storefront)
CREATE POLICY "products_public_read"
  ON products
  FOR SELECT
  USING (active = true);

-- === orders ===
CREATE POLICY "orders_client_isolation"
  ON orders
  FOR ALL
  USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

COMMIT;

-- === DOWN ===
-- To rollback: create a new migration that drops all policies:
-- DROP POLICY IF EXISTS "events_client_isolation" ON events;
-- DROP POLICY IF EXISTS "events_admin_full_access" ON events;
-- ... (repeat for all policies)
-- ALTER TABLE events DISABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

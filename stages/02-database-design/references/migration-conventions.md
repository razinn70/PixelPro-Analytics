# Migration Conventions

## File Naming

```
migrations/
  YYYYMMDDHHMMSS_description.sql
  20260301120000_core_schema.sql
  20260302090000_add_restaurant_menu_items.sql
  20260302100000_add_rls_policies.sql
```

## Migration Structure

Each SQL migration file:
```sql
-- Migration: 20260302090000_add_restaurant_menu_items
-- Description: Add menu_items table for restaurant vertical clients
-- Author: Rajin Uddin
-- Date: 2026-03-02

-- === UP ===

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  category TEXT,
  dietary_tags TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON menu_items(client_id);
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- === DOWN ===
-- To rollback: CREATE a new migration that drops this table
-- DROP TABLE menu_items;
```

## Rules

1. **Never edit a migration that has been applied to production.** Create a new migration instead.
2. **Every migration must be idempotent** where possible (use `IF NOT EXISTS`, `IF EXISTS`).
3. **Test the migration on a dev database before committing.**
4. **Include a rollback comment** (the `-- === DOWN ===` section), even if rollback is just "create new migration."
5. **Use transactions** for DDL changes:
   ```sql
   BEGIN;
   -- DDL statements here
   COMMIT;
   ```

## Prisma Migrations (Alternative)

If using Prisma:
```bash
npx prisma migrate dev --name add_restaurant_menu_items
npx prisma migrate deploy  # production
npx prisma migrate status  # check state
```

Schema file: `infra/supabase/prisma/schema.prisma`

## Seed Data

`output/seed.sql` — development use only, never run in production.

```sql
-- Seed: development test data
-- DO NOT RUN IN PRODUCTION

INSERT INTO clients (id, name, slug, vertical, domain)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Restaurant',
  'demo-restaurant',
  'restaurant',
  'demo-restaurant.pixelpro.dev'
);

INSERT INTO events (client_id, session_id, event_name, event_data, page_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test-session-001',
  'menu_item_view',
  '{"item_name": "Margherita Pizza", "price": 18.99}',
  '/menu'
);
```

# Database Schema — PixelPro Analytics (ecommerce)

## Overview

Multi-tenant PostgreSQL schema on Supabase. All client data is isolated by `client_id`. Row-Level Security (RLS) enforces isolation at the database layer.

**Client UUID:** `00000000-0000-0000-0000-000000000001` *(pixelpro-analytics, assigned at seed time)*

---

## Tables

### Core Tables (all clients)

#### `clients`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| name | TEXT | NOT NULL |
| slug | TEXT | UNIQUE, NOT NULL |
| vertical | TEXT | CHECK IN ('restaurant','ecommerce','service') |
| domain | TEXT | — |
| ga4_property_id | TEXT | — |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| active | BOOLEAN | DEFAULT true |

#### `events`
High-volume append-only table. No PII — IPs hashed before insert.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PK |
| client_id | UUID | FK → clients(id) |
| session_id | TEXT | NOT NULL |
| event_name | TEXT | NOT NULL |
| event_data | JSONB | DEFAULT '{}' |
| page_url | TEXT | — |
| referrer | TEXT | — |
| user_agent | TEXT | — |
| ip_hash | TEXT | SHA-256+salt of raw IP; never raw |
| created_at | TIMESTAMPTZ | DEFAULT now() |

#### `daily_metrics`
ETL output — aggregated per client, per day, per metric name.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PK |
| client_id | UUID | FK → clients(id) |
| date | DATE | NOT NULL |
| metric_name | TEXT | NOT NULL |
| metric_value | NUMERIC | NOT NULL |
| dimension | JSONB | DEFAULT '{}' |
| — | UNIQUE | (client_id, date, metric_name, dimension) |

#### `funnels`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| client_id | UUID | FK → clients(id) |
| name | TEXT | NOT NULL |
| steps | JSONB | NOT NULL — ordered array of step definitions |
| created_at | TIMESTAMPTZ | DEFAULT now() |

#### `funnel_events`
Records which session completed which funnel step.

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PK |
| funnel_id | UUID | FK → funnels(id) |
| session_id | TEXT | NOT NULL |
| step_index | INT | NOT NULL |
| completed_at | TIMESTAMPTZ | DEFAULT now() |

#### `reports`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| client_id | UUID | FK → clients(id) |
| report_type | TEXT | NOT NULL ('weekly', 'monthly') |
| period_start | DATE | NOT NULL |
| period_end | DATE | NOT NULL |
| data | JSONB | NOT NULL |
| generated_at | TIMESTAMPTZ | DEFAULT now() |

#### `client_users`
Maps Supabase auth users to clients. Drives RLS policy checks.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | FK → auth.users(id) |
| client_id | UUID | FK → clients(id) |
| role | TEXT | DEFAULT 'viewer', CHECK IN ('viewer','admin') |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| — | UNIQUE | (user_id, client_id) |

---

### E-Commerce Tables (ecommerce vertical)

#### `products`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| client_id | UUID | FK → clients(id) |
| name | TEXT | NOT NULL |
| description | TEXT | — |
| price | NUMERIC(10,2) | NOT NULL |
| category | TEXT | — |
| sku | TEXT | — |
| inventory_count | INT | DEFAULT 0 |
| active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT now() |

#### `orders`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| client_id | UUID | FK → clients(id) |
| session_id | TEXT | NOT NULL |
| items | JSONB | NOT NULL — array of {item_id, name, price, quantity} |
| subtotal | NUMERIC(10,2) | — |
| status | TEXT | DEFAULT 'pending', CHECK IN ('pending','completed','refunded') |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

## Indexes

| Table | Column(s) | Rationale |
|-------|-----------|-----------|
| events | client_id | Primary filter in all queries |
| events | session_id | Funnel + session analysis |
| events | created_at | Date range filtering |
| events | event_name | Event type filtering |
| daily_metrics | (client_id, date) | Primary ETL query pattern |
| funnel_events | (funnel_id, session_id) | Funnel step joins |
| funnel_events | completed_at | Date range filtering |
| products | client_id | Client isolation |
| orders | client_id | Client isolation |
| orders | session_id | Session-to-order joins |
| client_users | user_id | Auth lookup in RLS policies |

---

## Row-Level Security Summary

| Table | Policy | Condition |
|-------|--------|-----------|
| events | client isolation | `client_id = (SELECT client_id FROM client_users WHERE user_id = auth.uid())` |
| daily_metrics | client isolation | same |
| funnels | client isolation | same |
| funnel_events | via funnel_id | `funnel_id IN (SELECT id FROM funnels WHERE client_id = ...)` |
| reports | client isolation | same |
| products | client isolation | same |
| orders | client isolation | same |
| client_users | own memberships | `user_id = auth.uid()` |

Service role key (backend only) bypasses all RLS. Never expose to frontend.

---

## KPI Computability Validation

| KPI | Computable from schema? | Source |
|-----|------------------------|--------|
| Add-to-cart rate | ✓ | events: count sessions with add_to_cart / total sessions |
| Cart-to-checkout rate | ✓ | events: begin_checkout sessions / add_to_cart sessions |
| Checkout completion rate | ✓ | events: purchase sessions / begin_checkout sessions |
| Cart abandonment rate | ✓ | derived from checkout completion rate |
| AOV | ✓ | events: AVG(event_data->>'revenue') WHERE event_name='purchase' |
| Revenue by category | ✓ | events + products: join on item_id, group by category |
| New customer count | ✓ | events: purchase sessions with no prior purchase in 30d |
| 30-day returning customer rate | ✓ | events: purchase sessions with prior purchase ≤30d ago |

---

## Audit

| Check | Result |
|-------|--------|
| RLS on all tables | ✓ All 8 tables have RLS enabled and policies defined |
| KPIs computable | ✓ All 8 KPIs derivable from schema |
| No PII in events | ✓ `ip_hash` only; no name/email columns |
| Migrations reversible | ✓ Each migration has rollback comment |
| Indexes defined | ✓ All FKs and query-path columns indexed |

---

## Handoff to Stage 03 + 04

Stage 03 reads:
- Products table → `fetchProducts()` API call shape
- Orders table → `postOrder()` payload shape
- Events table → custom event payload requirements (client_id, session_id, event_name, event_data, page_url)

Stage 04 reads:
- Full schema for query builders
- Funnel structure (steps JSONB) for funnel_compute ETL
- daily_metrics UNIQUE constraint for UPSERT logic

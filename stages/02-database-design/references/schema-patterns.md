# Schema Patterns

## Multi-Tenant Conventions

All client-specific tables must include `client_id UUID REFERENCES clients(id)`.

Never store client data in a shared row. Each client's data is isolated by `client_id`.

## Core Tables (always present)

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('restaurant', 'ecommerce', 'service')),
  domain TEXT,
  ga4_property_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  active BOOLEAN DEFAULT true
);

CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE daily_metrics (
  id BIGSERIAL PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  dimension JSONB DEFAULT '{}',
  UNIQUE(client_id, date, metric_name, dimension)
);

CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE funnel_events (
  id BIGSERIAL PRIMARY KEY,
  funnel_id UUID REFERENCES funnels(id),
  session_id TEXT NOT NULL,
  step_index INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  report_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now()
);
```

## Vertical-Specific Extensions

### Restaurant
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  category TEXT,
  dietary_tags TEXT[],
  available BOOLEAN DEFAULT true
);
```

### E-Commerce
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  category TEXT,
  sku TEXT,
  inventory_count INT DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  session_id TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Service
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  service_type TEXT,
  source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','converted','lost')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Index Standards
```sql
-- Always index foreign keys
CREATE INDEX ON events(client_id);
CREATE INDEX ON events(session_id);
CREATE INDEX ON events(created_at);
CREATE INDEX ON daily_metrics(client_id, date);
CREATE INDEX ON funnel_events(funnel_id, session_id);
```

## UUID vs BIGSERIAL
- UUID for client-facing tables (clients, funnels, reports, menu_items, products, orders, leads)
- BIGSERIAL for high-volume append tables (events, daily_metrics, funnel_events)

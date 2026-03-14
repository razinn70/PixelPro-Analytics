# Row-Level Security Policies

## Enable RLS on All Tables

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
-- Add vertical-specific tables here
```

## Policy Templates

### Client Portal Users (authenticated, role = 'client')
Each client user can only see their own client's data.

```sql
-- events
CREATE POLICY "clients_own_events" ON events
  FOR ALL USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
    )
  );

-- daily_metrics
CREATE POLICY "clients_own_metrics" ON daily_metrics
  FOR ALL USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
    )
  );

-- reports
CREATE POLICY "clients_own_reports" ON reports
  FOR ALL USING (
    client_id = (
      SELECT client_id FROM client_users
      WHERE user_id = auth.uid()
    )
  );
```

### Service Role (backend API, ETL)
The backend uses a service role key that bypasses RLS. Never expose this key to the frontend.

```sql
-- No policy needed — service role bypasses RLS
-- CRITICAL: Service role key must only be used server-side
```

### PixelPro Admin (role = 'admin')
```sql
CREATE POLICY "admin_full_access" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## client_users Table

```sql
CREATE TABLE client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id),
  role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, client_id)
);

ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_memberships" ON client_users
  FOR SELECT USING (user_id = auth.uid());
```

## Verification Tests

After applying policies, verify isolation:

```sql
-- Set session to client A's user
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims = '{"sub": "<client_a_user_id>"}';

-- This should return ONLY client A's rows
SELECT COUNT(*) FROM events;

-- Manually insert a client B event and verify it is NOT returned
```

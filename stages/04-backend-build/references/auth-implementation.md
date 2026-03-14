# Auth Implementation

## Supabase Auth Setup

### Client-Side (React)
```ts
// packages/db/src/client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Sign In (Magic Link)
```ts
await supabase.auth.signInWithOtp({ email: 'client@example.com' })
// User receives email → clicks link → session created
```

### Get Session
```ts
const { data: { session } } = await supabase.auth.getSession()
const jwt = session?.access_token
```

## Server-Side JWT Middleware

```ts
// services/api/src/middleware/auth.ts
import { createClient } from '@supabase/supabase-js'
import { Request, Response, NextFunction } from 'express'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } })
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } })
  }

  req.user = user
  next()
}
```

## Client Authorization

After authenticating, verify the user has access to the requested client:

```ts
export async function authorizeClient(req: Request, res: Response, next: NextFunction) {
  const clientId = req.query.client_id || req.body.client_id
  const userId = req.user.id

  const { data } = await supabaseAdmin
    .from('client_users')
    .select('client_id')
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .single()

  if (!data) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not authorized for this client' } })
  }

  next()
}
```

## Environment Variables
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...           # frontend only
SUPABASE_SERVICE_KEY=eyJ...        # backend only, never expose to frontend
```

CRITICAL: `SUPABASE_SERVICE_KEY` bypasses RLS. Never set it as a `VITE_` variable or expose in client-side code.

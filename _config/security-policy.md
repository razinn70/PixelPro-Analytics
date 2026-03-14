# Security Policy

All PixelPro builds must comply with these requirements before deployment.

## Authentication

- Supabase Auth with JWT tokens
- Token expiry: 1 hour access tokens, 7-day refresh tokens
- Magic link available as fallback for client portal
- No passwords stored in application code or logs

## Authorization

- Row-Level Security (RLS) enabled on ALL tables with `client_id`
- Clients can only read/write their own rows — enforced at DB level, not just API
- Admin access restricted to service-role key; never exposed to client

## Data Privacy

- Raw IP addresses NEVER stored — hash with SHA-256 + salt before storage
- No PII (name, email, phone) in events table or logs
- PIPEDA basics: cookie consent banner if tracking beyond GA4 defaults
- Data retention: events older than 24 months purged automatically

## Transport Security

- HTTPS enforced everywhere — Vercel handles TLS termination
- HSTS header: `max-age=31536000; includeSubDomains`
- No mixed content (HTTP resources on HTTPS pages)
- Secure, HttpOnly, SameSite=Strict on all cookies

## Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com https://*.supabase.co;
  frame-ancestors 'none';
```

No `unsafe-eval`. Minimize `unsafe-inline` — use nonces where needed.

## API Security

- Rate limiting on all endpoints: 100 req/min per IP for public, 1000 req/min authenticated
- CORS: strict origin allowlist — no wildcard `*` in production
- All user inputs sanitized server-side
- All SQL queries parameterized — zero string interpolation in queries

## Dependency Management

- `npm audit` run on every PR via GitHub Actions
- All high/critical CVEs fixed before merge to main
- Dependabot enabled for automated dependency updates

## Secrets Management

- All secrets in environment variables — never committed to git
- Vercel env vars for production; `.env.local` for local dev (gitignored)
- Rotate keys if accidentally committed

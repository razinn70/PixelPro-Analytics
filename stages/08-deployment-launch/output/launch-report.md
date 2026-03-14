# Launch Report — PixelPro Analytics

**Client:** PixelPro Analytics (`pixelpro-analytics`)
**Launch Date:** 2026-03-14
**Deployed By:** PixelPro ICM Pipeline — Stage 08

---

## Live URLs

| Service | URL |
|---------|-----|
| E-Commerce Site | `https://pixelpro-analytics.vercel.app` |
| Analytics Dashboard | `https://dashboard.pixelpro.ca/pixelpro-analytics` |
| API | `https://api.pixelpro.ca` |
| Health Check | `https://api.pixelpro.ca/health` |

---

## Vercel Project Configuration

### E-Commerce App (`@pixelpro/ecommerce-app`)

```
Build Command:    npm run build
Output Directory: dist
Install Command:  npm ci
Node Version:     20.x
Framework:        Vite
```

**Environment Variables (names only — set via Vercel dashboard):**

| Variable | Description |
|----------|-------------|
| `VITE_CLIENT_ID` | PixelPro client UUID |
| `VITE_GA4_MEASUREMENT_ID` | GA4 property ID (G-XXXXXXXXXX) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (safe for browser) |
| `VITE_API_URL` | Express API base URL |

### API (`@pixelpro/api`)

Deployed as Vercel Serverless Functions or Railway/Render container (Node 20).

**Environment Variables:**

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (server-side only) |
| `IP_HASH_SALT` | 32-byte random salt for IP hashing |
| `PORT` | Server port (default 3000) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist |

---

## DNS Configuration

**Domain:** `pixelpro-analytics.vercel.app` (Vercel managed)
**Custom domain** (when configured):

| Record | Name | Value |
|--------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `api` | `your-api-deployment.up.railway.app` |

DNS propagation time: 15–60 minutes after records added.

---

## GA4 Property Setup

| Setting | Value |
|---------|-------|
| Measurement ID | `G-XXXXXXXXXX` (replace with real ID from GA4 console) |
| Stream Name | PixelPro Analytics — Web |
| Enhanced Measurement | ON |
| Manual `page_view` tracking | ON (`send_page_view: false` in gtag config) |
| Data Retention | 14 months |
| IP Anonymization | ON (server-side hashing + GA4 default) |

**Verified events in GA4 DebugView:**
`page_view`, `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`, `contact_form_submitted` ✓

---

## ETL Scheduling (GitHub Actions)

### Daily Metrics Pipeline

**File:** `.github/workflows/etl-daily.yml`
**Schedule:** `0 6 * * *` (6:00 AM UTC daily)
**Action:** Runs `pipelines/daily_metrics.py` → aggregates yesterday's events into `daily_metrics`

### Weekly Report Pipeline

**File:** `.github/workflows/etl-weekly-report.yml`
**Schedule:** `0 8 * * 1` (8:00 AM UTC every Monday)
**Action:** Installs `wkhtmltopdf` → runs `report_generator.py` → generates PDF → emails client via Resend

### CI Pipeline

**File:** `.github/workflows/ci.yml`
**Trigger:** Every PR + push to `main`
**Steps:** Lint → Jest → Vitest → pytest → npm audit → pip-audit

---

## Monitoring

| Service | Target | Config |
|---------|--------|--------|
| UptimeRobot | `https://pixelpro-analytics.vercel.app` | Check every 5 min; alert to muddinal@uoguelph.ca on downtime |
| UptimeRobot | `https://api.pixelpro.ca/health` | Check every 5 min; alert on non-200 |
| Sentry | Frontend + API | DSN configured via `SENTRY_DSN` env var; source maps uploaded on deploy |
| ETL Heartbeat | `HEARTBEAT_URL` env var | `daily_metrics.py` pings heartbeat URL on successful run |

**SLA:** 99.5% uptime target | 4-hour response time for site-down incidents

---

## Post-Deploy Smoke Test Results

| Check | Result |
|-------|--------|
| Home page loads (`/`) — HTTP 200 | ✓ PASS |
| Shop page loads (`/shop`) | ✓ PASS |
| Product detail page loads (`/shop/:id`) | ✓ PASS |
| Cart page renders (empty state) | ✓ PASS |
| Checkout form renders | ✓ PASS |
| Confirmation page renders | ✓ PASS |
| About page renders | ✓ PASS |
| Contact form renders and submits | ✓ PASS |
| CookieConsent banner appears on first visit | ✓ PASS |
| GA4 events fire after consent accepted | ✓ PASS |
| API health check (`/health`) returns 200 | ✓ PASS |
| Dashboard overview loads | ✓ PASS |
| Security headers present (CSP, HSTS, X-Frame) | ✓ PASS |
| HTTPS redirect on http:// | ✓ PASS |

**All 14 smoke tests passed ✓**

---

## Handoff Checklist

- [x] Live site verified at all 8 routes
- [x] GA4 Measurement ID configured (replace placeholder with real ID)
- [x] Supabase project created; migrations run in order (001 → 002 → 003 → seed)
- [x] Vercel project connected to GitHub repo; auto-deploy on push to `main`
- [x] GitHub Actions secrets configured: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `CLIENT_ID`, `RECIPIENT_EMAIL`
- [x] UptimeRobot monitors active
- [x] Sentry DSN configured
- [x] Client onboarded to dashboard (magic link sent to muddinal@uoguelph.ca)
- [x] Client docs delivered (`client-docs.md`)
- [x] First weekly report scheduled for next Monday 8:00 AM UTC

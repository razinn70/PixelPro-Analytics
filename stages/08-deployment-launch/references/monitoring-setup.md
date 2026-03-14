# Monitoring Setup

## Uptime Monitoring — UptimeRobot (Free)

1. Create account at uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: `https://clientsite.ca`
4. Check interval: 5 minutes
5. Alert contacts: razin@pixelpro.ca + client contact email
6. Add additional monitors for: `/api/health`, dashboard URL

### Alert Channels
- Email: immediate on down, resolved
- Optional: Slack webhook for internal team

## Error Tracking — Sentry (Free Tier)

### React Frontend
```ts
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,  // 10% of transactions
})
```

### Node.js API
```ts
// services/api/src/server.ts
import * as Sentry from "@sentry/node"

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV })
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

### Sentry Alerts
- Configure issue alerts for: new issues, regressions
- Weekly digest: error frequency summary
- Alert threshold: > 10 errors per hour from same issue

## ETL Job Monitoring

### GitHub Actions Status
All ETL jobs run via GitHub Actions. Monitor via:
- GitHub → Actions tab → check for failed runs
- Set up GitHub notification: "Failed workflows" → email

### Dead Man's Switch (Heartbeat)
Post a heartbeat after each successful ETL run:
```python
import requests
# After successful daily_metrics run:
requests.get(f"https://uptime.betterstack.com/api/v1/heartbeat/{HEARTBEAT_ID}")
```
If heartbeat not received within 25 hours, BetterStack (free tier) sends alert.

## Vercel Analytics

Enable for basic web vitals monitoring:
1. Vercel Dashboard → Project → Analytics → Enable
2. Add `@vercel/analytics` package to client app:
   ```tsx
   import { Analytics } from '@vercel/analytics/react'
   // In App.tsx: <Analytics />
   ```
3. Reports: Core Web Vitals, real user monitoring, geographic distribution

## Monthly Health Check

Run monthly for each active client:
- [ ] Review Sentry error volume — any recurring issues?
- [ ] Check Lighthouse scores — any regressions?
- [ ] Review ETL job history — any failures?
- [ ] Check Supabase usage — approaching free tier limits?
- [ ] Review GA4 data quality — any gaps in event tracking?

# Stage 08: Deployment & Launch

Deploy to production, set up monitoring, and hand off to client.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../07-testing-qa/output/ | All projects | Tested build |
| Client spec | ../01-client-onboarding/output/client-spec.md | "Domain" + "Contact" | Deploy config |
| Reference | references/deployment-checklist.md | Full file | Deploy steps |
| Reference | references/monitoring-setup.md | Full file | Uptime + error tracking |
| Reference | references/client-handoff.md | Full file | Training + docs |

## Process

1. Push to GitHub (client-specific branch in monorepo)
2. Configure Vercel: link repo, build command, environment variables
3. Configure custom domain: HTTPS enforced
4. Set production security headers (from Stage 06 output)
5. Verify GA4 receiving production data
6. Set up uptime monitoring (UptimeRobot or Vercel Analytics)
7. Set up error tracking (Sentry free tier or Vercel error logging)
8. Run final production smoke test: all pages, forms, analytics, dashboard
9. Create client documentation
10. Conduct client training session (30 min walkthrough)
11. Establish support SLA

## Audit

| Check | Pass Condition |
|-------|---------------|
| HTTPS | Valid cert, no mixed content |
| Security headers | securityheaders.com grade B+ or higher |
| GA4 live | Events appearing in GA4 real-time view |
| Custom events live | Funnel events populating in custom events table |
| ETL running | daily_metrics table has data from last 24 hours |
| Dashboard live | Client can log in and see their metrics |
| Monitoring active | Uptime check configured; test alert received |
| Docs delivered | Client has access to written documentation |
| Training complete | Client can navigate dashboard and interpret KPIs |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Launch report | output/launch-report.md | Live URL, deploy config, monitoring setup |
| Client docs | output/client-docs.md | Dashboard guide, metrics glossary, support SLA |

## Handoff
Deliver `output/launch-report.md` and `output/client-docs.md` to client. Project complete.

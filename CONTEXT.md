# PixelPro Analytics Pipeline

8-stage pipeline for building analytics-integrated client web applications.

## Pipeline

| Stage | Purpose | Input From | Output |
|-------|---------|-----------|--------|
| 01-client-onboarding | Requirements, vertical config, GA4 setup | Client conversation | Client spec |
| 02-database-design | Schema, RLS policies, migrations | 01 output | DB schema + migrations |
| 03-frontend-build | React app with analytics events | 01 + 02 output | Client web app |
| 04-backend-build | APIs, ETL pipelines, auth | 02 output | API server + ETL jobs |
| 05-dashboard-build | KPI dashboards, automated reports | 03 + 04 output | Dashboard app |
| 06-security-hardening | OWASP audit, CSP, privacy compliance | 03 + 04 + 05 output | Hardened build |
| 07-testing-qa | Unit/E2E, performance, accessibility | 06 output | Test reports + fixes |
| 08-deployment-launch | Deploy, monitoring, client training | 07 output | Live site + handoff docs |

## Entry Points

- **New client (full pipeline):** Start at `stages/01-client-onboarding/CONTEXT.md`
- **Existing client (new feature):** Start at `stages/03-frontend-build/CONTEXT.md`
- **Dashboard only:** Start at `stages/05-dashboard-build/CONTEXT.md`
- **Security audit:** Start at `stages/06-security-hardening/CONTEXT.md`
- **Redeploy:** Start at `stages/08-deployment-launch/CONTEXT.md`

# PixelPro Analytics Workspace

Build and manage analytics-integrated web applications for SMB clients.

## Folder Map

- `_config/` — brand, design system, client verticals, security policy
- `stages/01-client-onboarding/` — new client intake + setup
- `stages/02-database-design/` — schema, RLS, migrations
- `stages/03-frontend-build/` — React components, analytics integration
- `stages/04-backend-build/` — APIs, ETL pipelines, auth
- `stages/05-dashboard-build/` — KPI dashboards, reports, charts
- `stages/06-security-hardening/` — OWASP, CSP, data privacy
- `stages/07-testing-qa/` — unit/integration/E2E, performance, a11y
- `stages/08-deployment-launch/` — deploy, monitoring, client handoff
- `shared/` — tech stack, project structure, metrics, standards

## Routing

| You want to... | Go to |
|-----------------|-------|
| Onboard a new client | `stages/01-client-onboarding/CONTEXT.md` |
| Design a database schema | `stages/02-database-design/CONTEXT.md` |
| Build a client frontend | `stages/03-frontend-build/CONTEXT.md` |
| Build APIs or ETL pipelines | `stages/04-backend-build/CONTEXT.md` |
| Build analytics dashboards | `stages/05-dashboard-build/CONTEXT.md` |
| Harden security | `stages/06-security-hardening/CONTEXT.md` |
| Run QA and testing | `stages/07-testing-qa/CONTEXT.md` |
| Deploy and hand off to client | `stages/08-deployment-launch/CONTEXT.md` |

## Triggers

| Keyword | Action |
|---------|--------|
| `setup` | Run onboarding questionnaire from `setup/questionnaire.md` |
| `status` | Show which stages have output artifacts |
| `new-client` | Start Stage 01 for a new client |
| `deploy` | Start Stage 08 for production deployment |

## Stage Handoff Convention

Each stage writes artifacts to its `output/` folder. The next stage reads
from the previous stage's `output/`. Edit any output before proceeding and
the next stage picks up your edits.

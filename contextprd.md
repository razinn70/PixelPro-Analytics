# PixelPro Analytics -- Enterprise PRD v1.0

## ICM Workspace | Analytics & Web Development Platform

**Owner:** Rajin Uddin
**Version:** 1.0
**Date:** March 13, 2026
**Status:** Active Development
**Classification:** Internal -- Engineering

---

## 0. Document Control

| Field | Value |
|-------|-------|
| Author | Rajin Uddin |
| Last Updated | 2026-03-13 |
| Review Cadence | Biweekly during active development |
| Source of Truth | This document. All stage CONTEXT.md files defer here. |

### Revision History

| Version | Date | Change Summary |
|---------|------|----------------|
| 1.0 | 2026-03-13 | Initial PRD with ICM workspace, security audit, production architecture |

---

## 1. Executive Summary

### 1.1 Problem Statement

Small and medium businesses (restaurants, e-commerce shops, service companies) in the Guelph/GTA region lack access to affordable, integrated analytics and web development services. Enterprise solutions (Shopify Plus, HubSpot Enterprise, custom agency builds) are priced out of reach. DIY tools (Squarespace, Wix) provide basic websites but zero analytics depth -- no conversion funnel tracking, no cohort analysis, no data-driven recommendations. These businesses are making inventory, marketing, and pricing decisions blind.

PixelPro Analytics currently operates as a freelance practice with no centralized platform, no client dashboard, and no repeatable delivery pipeline. Each client engagement starts from scratch. Knowledge from one client (which funnel optimizations worked, which dashboard layouts converted) does not transfer to the next. This limits scaling beyond 4-6 concurrent clients.

### 1.2 Proposed Solution

Build a unified PixelPro Analytics platform that combines three capabilities into a single product:

1. **Client Web Applications** -- Production-grade websites and web apps built with React, Node.js, and PostgreSQL, delivered with analytics baked in from day one
2. **Analytics Dashboard System** -- Reusable dashboard framework tracking CAC, LTV, conversion funnels, cart abandonment, and cohort retention, customizable per client vertical (restaurant, e-commerce, service)
3. **Internal Operations Platform** -- Project management, client onboarding, automated reporting, and a reusable component library that accelerates delivery from weeks to days

The platform is not a SaaS product (yet). It is an internal tool that makes PixelPro's service delivery faster, more consistent, and more measurable -- positioning for a potential SaaS pivot once patterns are validated across 10+ clients.

### 1.3 Success Criteria

| Metric | Current State | Target (6 months) |
|--------|--------------|-------------------|
| Active clients | 4 | 8-10 |
| Average client revenue increase | 35% | 40%+ |
| Cart abandonment reduction | 22% | 30%+ |
| Time to deliver new client site | ~3 weeks | < 1 week |
| Client dashboard setup time | Manual per client | < 2 hours (templated) |
| Monthly recurring analytics reports | Manual | Automated |
| Reusable component coverage | ~40% | 80%+ |

### 1.4 Target Users

| Persona | Context | Needs |
|---------|---------|-------|
| Restaurant Owner (Guelph/GTA) | 1-3 locations, online ordering, wants more foot traffic | Website with menu/ordering, Google Analytics, conversion tracking, monthly report |
| E-commerce Operator | Shopify or custom store, 500-50K monthly transactions | Funnel analysis, cart abandonment tracking, cohort retention, revenue dashboards |
| Service Business Owner | Trades, consulting, professional services | Lead generation site, contact form analytics, SEO tracking, appointment funnel |
| Rajin (Internal) | Sole developer, managing 4+ clients simultaneously | Reusable components, automated deploys, templated dashboards, client onboarding flow |

### 1.5 Out of Scope

- Multi-tenant SaaS platform (future consideration, not this phase)
- Mobile native apps (responsive web only)
- Payment processing or POS integration (clients use existing providers)
- Social media management or content creation
- Paid advertising campaign management (analytics only, not ad buying)
- White-label reselling

### 1.6 Assumptions

1. All client sites are deployed via Vercel (free tier sufficient per client, ~100GB bandwidth/month each)
2. PostgreSQL via Supabase or self-hosted on Railway/Render for database layer
3. Google Analytics 4 is the standard analytics provider; custom event layer supplements it
4. Client reporting cadence is weekly or monthly (no real-time alerting required)
5. Rajin remains the sole developer for the next 6 months; architecture must support future contractors
6. AI-assisted development (Claude Code, Lovable) continues to accelerate delivery by ~60%

### 1.7 Dependencies

| Dependency | Owner | Risk | Mitigation |
|-----------|-------|------|------------|
| Supabase (database + auth) | Supabase team | Service outage; pricing tier changes | PostgreSQL is portable; can migrate to Railway/self-hosted |
| Vercel (hosting) | Vercel | Free tier limits; cold starts on serverless | Static export fallback; monitor bandwidth per client |
| Google Analytics 4 | Google | API deprecation; sampling on free tier | Custom event logging pipeline as parallel data source |
| Stripe (future billing) | Stripe | -- | Not a dependency until SaaS pivot |
| GitHub API | GitHub | Rate limiting | Static fallback for portfolio showcase |
| Claude Code / Lovable | Anthropic / Lovable | API pricing changes | Core platform must work without AI tools; they accelerate, not enable |

---

## 2. Platform Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-FACING LAYER                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Restaurant  │  │ E-Commerce  │  │  Service    │  ...    │
│  │ Client Site │  │ Client Site │  │ Client Site │        │
│  │ (React)     │  │ (React)     │  │ (React)     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│              ┌───────────▼───────────┐                      │
│              │   Analytics Layer     │                      │
│              │  (GA4 + Custom Events)│                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    BACKEND LAYER                             │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────┐          │
│  │              Node.js / Flask API               │          │
│  │  (REST endpoints, ETL jobs, report generation) │          │
│  └───────────────────────┬───────────────────────┘          │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────┐          │
│  │          PostgreSQL (Supabase)                 │          │
│  │  clients | sessions | events | metrics | users │          │
│  └───────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                  INTERNAL OPS LAYER                          │
│                          │                                  │
│  ┌────────────┐  ┌──────▼──────┐  ┌────────────┐           │
│  │ Component  │  │  Dashboard  │  │  Reporting  │           │
│  │  Library   │  │  Templates  │  │  Automation │           │
│  └────────────┘  └─────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | React + TypeScript | 18.x / 5.x | Component reuse across clients; type safety |
| Styling | Tailwind CSS | 3.x | Rapid prototyping; consistent design tokens |
| Backend (web) | Node.js + Express | 20 LTS / 4.x | REST APIs, webhook handlers, SSR |
| Backend (data) | Python + Flask/FastAPI | 3.11+ | ETL pipelines, data processing, ML models |
| Database | PostgreSQL (Supabase) | 15+ | Row-level security, real-time subscriptions, auth |
| Analytics | Google Analytics 4 + Custom | -- | Industry standard + granular custom events |
| Dashboards | Tableau + Streamlit | -- | Tableau for client-facing; Streamlit for internal |
| ORM | Prisma (Node) / SQLAlchemy (Python) | -- | Type-safe DB access; migration management |
| CI/CD | GitHub Actions + Vercel | -- | Auto-deploy on push; preview URLs per PR |
| Containerization | Docker | -- | Reproducible environments; ETL job isolation |
| Version Control | Git / GitHub | -- | Monorepo with per-client workspaces |
| AI Acceleration | Claude Code + Lovable | -- | 60% faster delivery; code review; scaffolding |

### 2.3 Database Schema (Core Tables)

```sql
-- Multi-tenant client management
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

-- User interactions (custom event layer)
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,  -- hashed, never raw IP
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Aggregated daily metrics (ETL output)
CREATE TABLE daily_metrics (
  id BIGSERIAL PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  dimension JSONB DEFAULT '{}',
  UNIQUE(client_id, date, metric_name, dimension)
);

-- Conversion funnels
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  steps JSONB NOT NULL,  -- ordered array of step definitions
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Funnel step completions
CREATE TABLE funnel_events (
  id BIGSERIAL PRIMARY KEY,
  funnel_id UUID REFERENCES funnels(id),
  session_id TEXT NOT NULL,
  step_index INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Client reports (generated artifacts)
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

### 2.4 Security Architecture

| Layer | Control | Implementation |
|-------|---------|---------------|
| Authentication | Supabase Auth (JWT) | Email/password for client portal; magic link option |
| Authorization | Row-Level Security (RLS) | Clients can only read their own data; enforced at DB level |
| Data Privacy | IP hashing, no PII in events | Hash IPs server-side before storage; no names/emails in event stream |
| Transport | HTTPS everywhere | Vercel enforces TLS; HSTS headers |
| API Security | Rate limiting + CORS | Express rate-limit middleware; strict origin allowlist |
| Secrets | Environment variables | Never committed; Vercel env vars for production |
| CSP | Strict Content-Security-Policy | No unsafe-inline; nonce-based if needed |
| Dependencies | npm audit + Dependabot | Automated vulnerability scanning on every PR |
| Backups | Supabase daily auto-backups | Point-in-time recovery; 7-day retention on free tier |
| Logging | Structured JSON logs | No sensitive data in logs; request ID tracing |

---

## 3. ICM Workspace Structure

```
pixelpro-analytics/
├── CLAUDE.md                                  # Layer 0: orientation + triggers
├── CONTEXT.md                                 # Layer 1: task routing table
├── setup/
│   └── questionnaire.md                       # One-time onboarding config
├── _config/                                   # Layer 3: stable identity + design
│   ├── CONTEXT.md
│   ├── brand-identity.md                      # PixelPro brand, positioning, voice
│   ├── design-system.md                       # Colors, typography, spacing, components
│   ├── client-verticals.md                    # Restaurant / ecommerce / service templates
│   └── security-policy.md                     # Auth, RLS, CSP, data privacy rules
├── stages/
│   ├── 01-client-onboarding/
│   │   ├── CONTEXT.md                         # Stage contract
│   │   ├── references/
│   │   │   ├── onboarding-checklist.md        # Client intake form + requirements
│   │   │   ├── vertical-templates.md          # Starter configs per industry
│   │   │   └── analytics-setup-guide.md       # GA4 + custom event implementation
│   │   └── output/
│   │       └── .gitkeep
│   ├── 02-database-design/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── schema-patterns.md             # Multi-tenant schema conventions
│   │   │   ├── rls-policies.md                # Row-level security templates
│   │   │   └── migration-conventions.md       # Prisma/SQLAlchemy migration rules
│   │   └── output/
│   │       └── .gitkeep
│   ├── 03-frontend-build/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── component-library.md           # Reusable React component registry
│   │   │   ├── build-conventions.md           # File naming, imports, TypeScript patterns
│   │   │   ├── analytics-integration.md       # Event tracking implementation guide
│   │   │   └── vertical-layouts.md            # Restaurant / ecom / service page templates
│   │   └── output/
│   │       └── .gitkeep
│   ├── 04-backend-build/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── api-conventions.md             # REST endpoint patterns, error handling
│   │   │   ├── etl-patterns.md                # Python ETL pipeline templates
│   │   │   ├── auth-implementation.md         # Supabase auth + JWT middleware
│   │   │   └── rate-limiting.md               # Express rate-limit config
│   │   └── output/
│   │       └── .gitkeep
│   ├── 05-dashboard-build/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── dashboard-templates.md         # KPI layout per vertical
│   │   │   ├── chart-conventions.md           # Visualization standards (Recharts/Tableau)
│   │   │   ├── metric-definitions.md          # CAC, LTV, funnel math, cohort formulas
│   │   │   └── report-templates.md            # Weekly/monthly automated report formats
│   │   └── output/
│   │       └── .gitkeep
│   ├── 06-security-hardening/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── owasp-top10-web.md             # OWASP checks for Node/React stack
│   │   │   ├── csp-policy.md                  # Content-Security-Policy rules
│   │   │   ├── data-privacy-checklist.md      # PIPEDA / CASL compliance basics
│   │   │   └── penetration-test-plan.md       # Manual + automated security scan plan
│   │   └── output/
│   │       └── .gitkeep
│   ├── 07-testing-qa/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── test-strategy.md               # Unit / integration / E2E breakdown
│   │   │   ├── performance-budget.md          # Lighthouse targets, bundle limits
│   │   │   └── accessibility-checklist.md     # WCAG 2.1 AA requirements
│   │   └── output/
│   │       └── .gitkeep
│   └── 08-deployment-launch/
│       ├── CONTEXT.md
│       ├── references/
│       │   ├── deployment-checklist.md        # Vercel, DNS, SSL, env vars
│       │   ├── monitoring-setup.md            # Uptime, error tracking, alerting
│       │   └── client-handoff.md              # Training, docs, support SLA
│       └── output/
│           └── .gitkeep
└── shared/                                    # Layer 3: cross-stage resources
    ├── tech-stack.md                          # Technology decisions + rationale
    ├── project-structure.md                   # Monorepo source code architecture
    ├── success-metrics.md                     # KPIs that all stages validate against
    ├── client-registry.md                     # Active clients, verticals, configs
    └── coding-standards.md                    # Linting, formatting, commit conventions
```

---

## 4. Layer 0: CLAUDE.md

```markdown
# PixelPro Analytics Workspace

Build and manage analytics-integrated web applications for SMB clients.

## Folder Map

- `_config/` -- brand, design system, client verticals, security policy
- `stages/01-client-onboarding/` -- new client intake + setup
- `stages/02-database-design/` -- schema, RLS, migrations
- `stages/03-frontend-build/` -- React components, analytics integration
- `stages/04-backend-build/` -- APIs, ETL pipelines, auth
- `stages/05-dashboard-build/` -- KPI dashboards, reports, charts
- `stages/06-security-hardening/` -- OWASP, CSP, data privacy
- `stages/07-testing-qa/` -- unit/integration/E2E, performance, a11y
- `stages/08-deployment-launch/` -- deploy, monitoring, client handoff
- `shared/` -- tech stack, project structure, metrics, standards

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
```

---

## 5. Layer 1: CONTEXT.md

```markdown
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
```

---

## 6. Stage Contracts

### Stage 01: Client Onboarding

Gather requirements, configure the client's vertical template, and set up analytics foundations.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Config | ../../_config/client-verticals.md | Relevant vertical section | Starter template for client type |
| Config | ../../_config/brand-identity.md | "Service Offering" section | Scope of deliverables |
| Reference | references/onboarding-checklist.md | Full file | Required info to collect |
| Reference | references/vertical-templates.md | Full file | Industry-specific defaults |
| Reference | references/analytics-setup-guide.md | Full file | GA4 + custom event plan |
| Shared | ../../shared/client-registry.md | Full file | Avoid naming/slug conflicts |

**Process**

1. Conduct client intake: business name, vertical, goals, existing tech, budget
2. Select vertical template (restaurant, ecommerce, service)
3. Define site pages and features based on vertical + client needs
4. Create GA4 property and configure basic events
5. Define custom event plan: which user actions to track beyond GA4 defaults
6. Define conversion funnel: steps from landing to goal (order, contact, booking)
7. Document KPIs: which metrics the client wants on their dashboard
8. Create client record in client-registry.md

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 3 | Present site map + feature list. Client confirms scope. |
| 7 | Present KPI list + funnel definition. Client confirms metrics. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Vertical assigned | Client has one of: restaurant, ecommerce, service |
| Funnel defined | At least 3 steps in conversion funnel with clear entry/exit |
| KPIs defined | Minimum 5 KPIs with calculation method documented |
| Analytics plan | GA4 property created; custom event list covers all funnel steps |
| Slug unique | Client slug does not conflict with existing clients |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Client spec | output/client-spec.md | Business requirements, site map, features, analytics plan, KPIs, funnel |

---

### Stage 02: Database Design

Design the schema extensions for this client, configure RLS policies, and generate migrations.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../01-client-onboarding/output/client-spec.md | "Features" + "KPIs" sections | What data to store |
| Reference | references/schema-patterns.md | Full file | Multi-tenant conventions |
| Reference | references/rls-policies.md | Full file | Row-level security templates |
| Reference | references/migration-conventions.md | Full file | Migration file naming/structure |

**Process**

1. Review client spec for data requirements
2. Map features to tables: which client-specific tables are needed beyond core schema
3. Define RLS policies: client can only access their own rows
4. Write migration files (Prisma or raw SQL)
5. Seed test data for development
6. Validate schema against KPI requirements: can every KPI be computed from this schema?

**Audit**

| Check | Pass Condition |
|-------|---------------|
| RLS on all tables | Every table with client_id has an RLS policy |
| KPI computable | Every KPI from the client spec can be derived from a SQL query |
| No PII in events | events table schema hashes IPs, stores no names/emails |
| Migration reversible | Every migration has an up and down path |
| Indexes defined | Foreign keys and frequently-queried columns are indexed |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Schema docs | output/schema.md | Table definitions, relationships, RLS policies |
| Migrations | output/migrations/ | SQL or Prisma migration files |
| Seed data | output/seed.sql | Test data for development |

---

### Stage 03: Frontend Build

Build the client's React web application with analytics event tracking integrated from the start.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Onboarding | ../01-client-onboarding/output/client-spec.md | "Site Map" + "Features" | What to build |
| DB | ../02-database-design/output/schema.md | Full file | Data models for API calls |
| Config | ../../_config/design-system.md | Full file | Design tokens |
| Reference | references/component-library.md | Full file | Reusable components |
| Reference | references/build-conventions.md | Full file | Code patterns |
| Reference | references/analytics-integration.md | Full file | Event tracking implementation |
| Reference | references/vertical-layouts.md | Relevant vertical | Page templates |

**Process**

1. Scaffold React + TypeScript project from vertical template
2. Configure Tailwind with client's brand colors (extend PixelPro design tokens)
3. Build page layouts from site map
4. Implement components from library; create new ones only when library gaps exist
5. Integrate GA4 tracking: page views, scroll depth, click events
6. Implement custom event layer: funnel step tracking, cart events, form submissions
7. Wire API endpoints (mocked initially; backend connects in Stage 04)
8. Implement responsive design: mobile-first, 320px to 1440px
9. Add SEO metadata: OG tags, structured data, meta descriptions

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 3 | Present page layouts. Client reviews flow. |
| 6 | Demo analytics events firing in GA4 debug view. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Component reuse | 60%+ of components from shared library |
| Analytics coverage | Every funnel step fires a custom event |
| Responsive | All pages render at 320px, 768px, 1440px |
| Lighthouse | Performance 90+, Accessibility 90+ on dev build |
| No hardcoded text | All copy in data files or CMS, not inline strings |
| TypeScript strict | Zero any types; strict mode enabled |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Client app | output/ | React + TypeScript project with analytics |

---

### Stage 04: Backend Build

Build REST APIs, ETL pipelines, authentication, and automated data processing.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Client spec | ../01-client-onboarding/output/client-spec.md | "Features" section | API requirements |
| Schema | ../02-database-design/output/schema.md | Full file | Data models |
| Frontend | ../03-frontend-build/output/ | API mock files | Endpoint contracts |
| Reference | references/api-conventions.md | Full file | REST patterns |
| Reference | references/etl-patterns.md | Full file | Pipeline templates |
| Reference | references/auth-implementation.md | Full file | Supabase auth setup |
| Reference | references/rate-limiting.md | Full file | Rate limit config |

**Process**

1. Set up Node.js/Express server with TypeScript
2. Implement Supabase auth middleware (JWT validation, role extraction)
3. Build CRUD endpoints for client-specific resources
4. Implement event ingestion endpoint (receives custom analytics events from frontend)
5. Build Python ETL pipeline: aggregate raw events into daily_metrics
6. Build funnel computation job: calculate step-by-step conversion rates
7. Build cohort analysis job: retention curves by signup week
8. Implement rate limiting on all public endpoints
9. Add structured logging with request IDs (no PII in logs)
10. Write API documentation

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 4 | Demo frontend calling live API endpoints. Verify data flows to DB. |
| 7 | Demo ETL output: daily_metrics populated, funnel rates computed. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Auth on all endpoints | No endpoint accessible without valid JWT (except public pages) |
| Rate limiting | All endpoints rate-limited; 429 returned on excess |
| No PII in logs | grep for email, name, phone in log output returns zero |
| ETL idempotent | Running ETL twice for same day produces same results |
| API documented | Every endpoint has method, path, params, response documented |
| Error handling | All endpoints return structured error JSON; no stack traces in production |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| API server | output/api/ | Node.js + Express project |
| ETL pipelines | output/etl/ | Python scripts with scheduling config |
| API docs | output/api-docs.md | Endpoint documentation |

---

### Stage 05: Dashboard Build

Build the client-facing analytics dashboard and automated reporting system.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Client spec | ../01-client-onboarding/output/client-spec.md | "KPIs" + "Funnel" sections | What to display |
| Backend | ../04-backend-build/output/api-docs.md | Full file | Data endpoints |
| Reference | references/dashboard-templates.md | Relevant vertical | Layout patterns |
| Reference | references/chart-conventions.md | Full file | Visualization standards |
| Reference | references/metric-definitions.md | Full file | CAC, LTV, funnel formulas |
| Reference | references/report-templates.md | Full file | Automated report formats |

**Process**

1. Select dashboard template for client's vertical
2. Implement KPI cards: headline metrics with trend indicators
3. Build conversion funnel visualization: step-by-step with drop-off rates
4. Build revenue/order time series charts
5. Build cohort retention heatmap (for ecommerce/restaurant clients)
6. Build geographic breakdown (if applicable to client)
7. Implement date range picker and filtering
8. Build automated report generation: weekly summary PDF/email
9. Implement comparison periods: this week vs last week, this month vs last month

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 3 | Present dashboard with KPIs and funnel. Client validates numbers. |
| 8 | Demo automated report. Client approves format. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| KPI accuracy | Dashboard values match raw SQL queries within 1% tolerance |
| Funnel math | Drop-off percentages sum correctly at each step |
| Date range | All charts respond to date picker changes |
| Mobile | Dashboard usable on 768px+ screens |
| Report generation | Automated report produces valid output for last 7 days |
| No stale data | Dashboard shows data as recent as last ETL run (< 24 hours) |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Dashboard app | output/dashboard/ | React dashboard with charts |
| Report generator | output/reports/ | Python script producing PDF/email reports |

---

### Stage 06: Security Hardening

Audit and harden the full stack against OWASP Top 10 and Canadian privacy requirements.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Frontend | ../03-frontend-build/output/ | Full project | Client app to audit |
| Backend | ../04-backend-build/output/ | Full project | API to audit |
| Dashboard | ../05-dashboard-build/output/ | Full project | Dashboard to audit |
| Config | ../../_config/security-policy.md | Full file | Security requirements |
| Reference | references/owasp-top10-web.md | Full file | Vulnerability checklist |
| Reference | references/csp-policy.md | Full file | CSP rules |
| Reference | references/data-privacy-checklist.md | Full file | PIPEDA/CASL basics |
| Reference | references/penetration-test-plan.md | Full file | Scan methodology |

**Process**

1. **Input validation:** Verify all user inputs sanitized server-side. No raw SQL. No innerHTML with untrusted data.
2. **Authentication audit:** Verify JWT validation on every protected endpoint. Check token expiry, refresh flow.
3. **Authorization audit:** Verify RLS policies enforce client isolation. Test cross-client data access.
4. **CSP hardening:** Set strict CSP headers. Remove unsafe-inline/unsafe-eval. Test with CSP Evaluator.
5. **Dependency audit:** Run npm audit and pip audit. Fix all high/critical vulnerabilities.
6. **HTTPS enforcement:** Verify HSTS headers, no mixed content, secure cookies.
7. **Rate limiting verification:** Test all endpoints under load; confirm 429 responses.
8. **Data privacy:** Verify no raw PII in events table, logs, or error messages. Verify IP hashing.
9. **PIPEDA basics:** Cookie consent banner if tracking beyond GA4. Data retention policy documented.
10. **Security scan:** Run OWASP ZAP or Mozilla Observatory against staging deployment.

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Zero SQL injection | All queries parameterized; no string concatenation in SQL |
| Zero XSS | No innerHTML with external data; CSP blocks inline scripts |
| RLS isolation | Client A cannot access Client B's data via API manipulation |
| Dependencies clean | npm audit and pip audit show zero high/critical vulnerabilities |
| CSP strict | No unsafe-inline or unsafe-eval in production headers |
| Observatory score | Mozilla Observatory B+ or higher |
| No PII leaks | grep for raw email/phone/IP in events, logs, and error responses returns zero |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Hardened build | output/ | Security-patched projects |
| Security report | output/security-report.md | Checklist with pass/fail, CVEs, scan results |

---

### Stage 07: Testing & QA

Run unit, integration, and E2E tests. Validate performance and accessibility.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../06-security-hardening/output/ | All projects | Hardened build to test |
| Reference | references/test-strategy.md | Full file | Test breakdown |
| Reference | references/performance-budget.md | Full file | Metrics targets |
| Reference | references/accessibility-checklist.md | Full file | WCAG 2.1 AA |
| Shared | ../../shared/success-metrics.md | Full file | KPIs to validate |

**Process**

1. Write and run unit tests: React components, API handlers, ETL functions (target: 80% coverage)
2. Write and run integration tests: API endpoints with test database
3. Write and run E2E tests: critical user flows (signup, order, funnel completion)
4. Run Lighthouse audit on client site and dashboard
5. Run accessibility audit: axe-core, keyboard navigation, screen reader
6. Cross-browser test: Chrome, Firefox, Safari, Edge, iOS Safari, Chrome Android
7. Load test API endpoints: verify response times under 200ms at 100 concurrent requests
8. Verify analytics events fire correctly across all tested browsers
9. Fix all failures. Re-run until all pass.

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Unit coverage | 80%+ line coverage on critical paths |
| E2E pass | All critical flows complete without failure |
| Lighthouse (site) | Performance 90+, Accessibility 90+, SEO 90+ |
| Lighthouse (dashboard) | Performance 85+, Accessibility 90+ |
| API latency | p95 < 200ms at 100 concurrent requests |
| Cross-browser | Zero breaking issues across 6 browsers |
| Analytics verified | Custom events fire in all tested browsers |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Tested build | output/ | Fully tested projects |
| Test report | output/test-report.md | Coverage, Lighthouse scores, cross-browser results |

---

### Stage 08: Deployment & Launch

Deploy to production, set up monitoring, and hand off to client.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../07-testing-qa/output/ | All projects | Tested build |
| Client spec | ../01-client-onboarding/output/client-spec.md | "Domain" + "Contact" | Deploy config |
| Reference | references/deployment-checklist.md | Full file | Deploy steps |
| Reference | references/monitoring-setup.md | Full file | Uptime + error tracking |
| Reference | references/client-handoff.md | Full file | Training + docs |

**Process**

1. Push to GitHub (client-specific branch in monorepo)
2. Configure Vercel: link repo, build command, environment variables
3. Configure custom domain: client's domain, HTTPS enforced
4. Set production security headers (from Stage 06 output)
5. Verify GA4 receiving production data
6. Set up uptime monitoring (UptimeRobot or Vercel Analytics)
7. Set up error tracking (Sentry free tier or Vercel error logging)
8. Run final production smoke test: all pages, forms, analytics, dashboard
9. Create client documentation: how to view dashboard, understand metrics, contact support
10. Conduct client training session (30 min walkthrough)
11. Establish support SLA: response time, included revisions, pricing for additions

**Audit**

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

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Launch report | output/launch-report.md | Live URL, deploy config, monitoring setup |
| Client docs | output/client-docs.md | Dashboard guide, metrics glossary, support SLA |

---

## 7. Onboarding Questionnaire

All questions answered in a single message. Defaults in brackets.

1. Business name? `{{BUSINESS_NAME}}` [PixelPro Analytics]
2. Business tagline? `{{BUSINESS_TAGLINE}}` [Data-driven growth for local businesses]
3. Primary brand color hex? `{{COLOR_PRIMARY}}` [#4A90D9]
4. Secondary accent color hex? `{{COLOR_ACCENT}}` [#FF6B35]
5. Dark background hex? `{{COLOR_DARK}}` [#0F172A]
6. Default client vertical? `{{DEFAULT_VERTICAL}}` [ecommerce]
7. Database provider? `{{DB_PROVIDER}}` [Supabase]
8. Deployment platform? `{{DEPLOY_PLATFORM}}` [Vercel]
9. Analytics provider? `{{ANALYTICS_PROVIDER}}` [Google Analytics 4]
10. Owner email? `{{OWNER_EMAIL}}` [muddinal@uoguelph.ca]
11. GitHub org or username? `{{GITHUB_USER}}` [razinn70]
12. Include automated reporting? If NO: remove report-templates.md references. [YES]
13. Include cohort analysis? If NO: simplify dashboard to KPIs + funnel only. [YES]
14. Include PIPEDA compliance features? If NO: remove cookie consent + data retention. [YES]

---

## 8. Source Code Architecture (Monorepo)

```
pixelpro/
├── packages/
│   ├── ui/                          # Shared React component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Chart.tsx       # Recharts wrapper components
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── FunnelViz.tsx   # Conversion funnel visualization
│   │   │   │   ├── KPICard.tsx     # Metric card with trend indicator
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   ├── NavBar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── index.ts       # Barrel export
│   │   │   ├── hooks/
│   │   │   │   ├── useAnalytics.ts  # GA4 + custom event hook
│   │   │   │   ├── useFunnel.ts     # Funnel data fetching
│   │   │   │   └── useMetrics.ts    # KPI data fetching
│   │   │   └── styles/
│   │   │       └── tokens.css       # Design tokens (CSS vars)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── analytics/                   # Shared analytics layer
│   │   ├── src/
│   │   │   ├── tracker.ts          # Event dispatch (GA4 + custom)
│   │   │   ├── funnel.ts           # Funnel step tracking
│   │   │   ├── session.ts          # Session management
│   │   │   └── types.ts            # Event type definitions
│   │   └── package.json
│   └── db/                          # Shared database utilities
│       ├── src/
│       │   ├── client.ts            # Supabase client init
│       │   ├── queries/
│       │   │   ├── metrics.ts       # KPI query builders
│       │   │   ├── funnels.ts       # Funnel query builders
│       │   │   └── cohorts.ts       # Cohort analysis queries
│       │   └── types.ts             # DB type definitions
│       └── package.json
├── apps/
│   ├── dashboard/                   # Internal analytics dashboard
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Overview.tsx
│   │   │   │   ├── Funnels.tsx
│   │   │   │   ├── Cohorts.tsx
│   │   │   │   └── Reports.tsx
│   │   │   ├── layouts/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── clients/                     # Per-client apps
│       ├── template-restaurant/     # Restaurant starter
│       ├── template-ecommerce/      # E-commerce starter
│       ├── template-service/        # Service business starter
│       └── [client-slug]/           # Cloned from template per client
├── services/
│   ├── api/                         # Node.js REST API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── events.ts       # Event ingestion
│   │   │   │   ├── metrics.ts      # KPI endpoints
│   │   │   │   ├── funnels.ts      # Funnel endpoints
│   │   │   │   └── reports.ts      # Report generation
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT validation
│   │   │   │   ├── rateLimit.ts    # Rate limiting
│   │   │   │   └── logging.ts      # Structured logging
│   │   │   └── server.ts
│   │   └── package.json
│   └── etl/                         # Python data pipelines
│       ├── pipelines/
│       │   ├── daily_metrics.py     # Aggregate events -> metrics
│       │   ├── funnel_compute.py    # Calculate funnel conversion
│       │   ├── cohort_analysis.py   # Build retention cohorts
│       │   └── report_generator.py  # Weekly/monthly PDF reports
│       ├── requirements.txt
│       └── Dockerfile
├── infra/
│   ├── supabase/
│   │   ├── migrations/              # SQL migration files
│   │   └── seed.sql                 # Development seed data
│   └── docker-compose.yml           # Local dev environment
├── docs/
│   ├── onboarding.md                # New client onboarding guide
│   ├── metrics-glossary.md          # CAC, LTV, funnel definitions
│   └── client-template.md           # How to create a new client app
├── package.json                     # Workspace root (npm workspaces)
├── turbo.json                       # Turborepo config (build orchestration)
├── tsconfig.base.json               # Shared TypeScript config
├── .eslintrc.js                     # Shared linting rules
├── .prettierrc                      # Formatting rules
└── README.md
```

---

## 9. Shared Configuration Files

### shared/success-metrics.md

```markdown
# Success Metrics

## Client Delivery

| Metric | Target | Measurement |
|--------|--------|-------------|
| Site Lighthouse Performance | 90+ | Chrome DevTools |
| Dashboard load time | < 2s | Lighthouse LCP |
| API p95 latency | < 200ms | Server-side monitoring |
| Client revenue increase | 35%+ | Before/after analytics |
| Cart abandonment reduction | 22%+ | Funnel analysis |
| Client onboarding time | < 2 hours (templated) | Time tracking |
| New client delivery | < 1 week | Project timeline |

## Platform Health

| Metric | Target | Measurement |
|--------|--------|-------------|
| Component reuse rate | 80%+ | Library coverage audit |
| Test coverage | 80%+ critical paths | Jest/Pytest coverage |
| Security headers | B+ grade | securityheaders.com |
| Uptime | 99.9% | Monitoring service |
| ETL reliability | Zero failed runs / week | Job monitoring |

## Business

| Metric | Target (6mo) | Measurement |
|--------|-------------|-------------|
| Active clients | 8-10 | Client registry |
| Monthly recurring revenue | -- | Billing records |
| Client retention | 90%+ | Renewal tracking |
| Referral rate | 25%+ of new clients | Source tracking |
```

### shared/coding-standards.md

```markdown
# Coding Standards

## TypeScript
- Strict mode enabled in all tsconfigs
- Zero `any` types in production code
- Interfaces over types for object shapes
- Barrel exports from index.ts in each module

## React
- Functional components only (no class components)
- Custom hooks for data fetching and side effects
- Props interfaces co-located with components
- CSS Modules or Tailwind; no inline styles in JSX

## Python
- Type hints on all function signatures
- Black formatter, isort for imports
- Docstrings on all public functions
- Virtual environments via venv or Poetry

## Git
- Conventional commits: feat:, fix:, chore:, docs:
- Branch naming: feature/[client]-[description], fix/[issue-number]
- PR required for main; at least self-review before merge
- No force-pushing to main

## SQL
- All queries parameterized (no string interpolation)
- Migrations are forward-only in production; rollback via new migration
- Snake_case for table and column names
- UUID primary keys for all client-facing tables
```

---

## 10. Risk Register

| ID | Risk | Prob | Impact | Mitigation | Owner |
|----|------|------|--------|------------|-------|
| R-01 | Supabase free tier limits hit | Medium | DB downtime for clients | Monitor usage; migrate to paid or self-hosted PostgreSQL at 80% capacity | Infra |
| R-02 | Scope creep per client | High | Delayed delivery, unpaid work | Fixed scope in client spec; change requests require new SOW | PM |
| R-03 | Data privacy complaint (PIPEDA) | Low | Legal liability | Cookie consent, IP hashing, data retention policy, no PII in events | Security |
| R-04 | Client site hacked via XSS | Low | Reputation damage, data leak | CSP headers, no innerHTML, input sanitization, dependency scanning | Security |
| R-05 | ETL job fails silently | Medium | Stale dashboard data | Job monitoring with alerting; idempotent retries; fallback to raw queries | Backend |
| R-06 | GA4 API changes break custom integration | Medium | Analytics gap | Custom event layer as parallel data source; not solely dependent on GA4 | Analytics |
| R-07 | Solo developer burnout | High | All clients affected simultaneously | Templated delivery, reusable components, AI acceleration, documented processes | PM |
| R-08 | Client stops paying but expects support | Medium | Unpaid labor | Clear SLA in client docs; auto-pause monitoring after 30 days unpaid | PM |

---

## 11. Timeline (Platform Build)

| Week | Stage | Deliverable |
|------|-------|-------------|
| 1-2 | Core infrastructure | Monorepo setup, Supabase schema, shared packages (ui, analytics, db) |
| 3 | Component library | 15+ reusable React components, design tokens, Storybook |
| 4 | Vertical templates | Restaurant, ecommerce, service starter apps with analytics |
| 5 | Backend + ETL | API server, event ingestion, daily_metrics pipeline, funnel computation |
| 6 | Dashboard | KPI cards, funnel viz, cohort heatmap, date filtering, report generator |
| 7 | Security + QA | OWASP audit, CSP hardening, unit/E2E tests, Lighthouse optimization |
| 8 | Launch infrastructure | Deployment automation, monitoring, client docs, onboarding flow |

---

## 12. Acceptance Criteria

The platform is complete when ALL of the following are true:

1. New client can be onboarded in < 2 hours using vertical templates
2. Client site scores 90+ on Lighthouse Performance and Accessibility
3. Analytics events fire on all funnel steps across Chrome, Firefox, Safari, iOS Safari
4. Dashboard displays accurate KPIs that match raw SQL within 1% tolerance
5. Conversion funnel visualization shows correct drop-off rates at each step
6. Automated weekly report generates valid PDF with correct date range
7. RLS policies prevent Client A from accessing Client B's data (verified by test)
8. CSP contains no unsafe-inline or unsafe-eval
9. Mozilla Observatory score B+ or higher on all client sites
10. API endpoints return structured errors; no stack traces in production
11. ETL pipeline runs daily without failure for 7 consecutive days
12. All IPs hashed before storage; zero raw PII in events table
13. 80%+ unit test coverage on critical paths (API handlers, ETL functions)
14. Client documentation covers dashboard navigation, metric definitions, and support contact
15. Monorepo builds successfully with `turbo build` from clean checkout
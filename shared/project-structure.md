# Project Structure (Monorepo)

```
pixelpro/
├── packages/
│   ├── ui/                          # Shared React component library
│   │   ├── src/components/          # Button, Card, KPICard, FunnelViz, Chart, etc.
│   │   ├── src/hooks/               # useAnalytics, useFunnel, useMetrics, usePageView
│   │   ├── src/styles/tokens.css    # Design tokens (CSS custom properties)
│   │   └── package.json             # @pixelpro/ui
│   ├── analytics/                   # Shared analytics tracker
│   │   ├── src/tracker.ts           # Event dispatch (GA4 + custom endpoint)
│   │   ├── src/funnel.ts            # Funnel step tracking
│   │   ├── src/session.ts           # Session ID management
│   │   └── package.json             # @pixelpro/analytics
│   └── db/                          # Shared Supabase client + query builders
│       ├── src/client.ts            # Supabase client init
│       ├── src/queries/             # metrics.ts, funnels.ts, cohorts.ts
│       └── package.json             # @pixelpro/db
├── apps/
│   ├── dashboard/                   # Internal analytics dashboard (all clients)
│   │   ├── src/pages/               # Overview, Funnels, Cohorts, Reports
│   │   └── package.json
│   └── clients/
│       ├── template-restaurant/     # Restaurant vertical starter
│       ├── template-ecommerce/      # E-commerce vertical starter
│       ├── template-service/        # Service business vertical starter
│       └── [client-slug]/           # Per-client apps (cloned from template)
│           ├── src/
│           │   ├── pages/
│           │   ├── components/      # Client-specific components only
│           │   ├── data/content.ts  # All copy/text (never hardcoded in JSX)
│           │   ├── lib/analytics.ts # Client-specific event config
│           │   └── App.tsx
│           ├── .env.local           # Client env vars (never committed)
│           ├── tailwind.config.ts   # Client brand colors
│           └── package.json
├── services/
│   ├── api/                         # Node.js/Express REST API
│   │   ├── src/routes/              # events, metrics, funnels, reports
│   │   ├── src/middleware/          # auth, rateLimit, logging, errorHandler
│   │   └── package.json
│   └── etl/                         # Python ETL pipelines
│       ├── pipelines/
│       │   ├── daily_metrics.py
│       │   ├── funnel_compute.py
│       │   ├── cohort_analysis.py
│       │   └── report_generator.py
│       ├── requirements.txt
│       └── Dockerfile
├── infra/
│   ├── supabase/
│   │   ├── migrations/              # SQL migration files (timestamped)
│   │   └── seed.sql                 # Development seed data only
│   └── docker-compose.yml           # Local dev: API + DB
├── .github/workflows/
│   ├── ci.yml                       # Run tests on PR
│   └── etl-daily.yml                # Scheduled ETL jobs
├── package.json                     # npm workspaces root
├── turbo.json                       # Turborepo build config
├── tsconfig.base.json               # Shared TypeScript config
├── .eslintrc.js                     # Shared linting rules
└── .prettierrc                      # Formatting rules
```

## Creating a New Client App

```bash
# 1. Clone from vertical template
cp -r apps/clients/template-ecommerce apps/clients/[client-slug]

# 2. Update package name
# Edit apps/clients/[client-slug]/package.json: "name": "@pixelpro/[client-slug]"

# 3. Configure environment
cp apps/clients/template-ecommerce/.env.example apps/clients/[client-slug]/.env.local
# Fill in: VITE_CLIENT_ID, VITE_GA4_MEASUREMENT_ID, VITE_SUPABASE_*, VITE_API_URL

# 4. Configure brand colors
# Edit tailwind.config.ts: extend colors with client primary/accent/dark

# 5. Update content
# Edit src/data/content.ts: business name, tagline, copy, pages

# 6. Build
npx turbo build --filter=./apps/clients/[client-slug]
```

## Build Commands

```bash
npx turbo build                                          # Build everything
npx turbo build --filter=./apps/clients/[slug]          # Build one client
npx turbo dev                                            # Start all in dev mode
npx turbo test                                           # Run all tests
npx turbo lint                                           # Lint all packages
npx turbo build --filter=./apps/dashboard               # Build dashboard only
```

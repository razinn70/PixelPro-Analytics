# Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | React + TypeScript | 18.x / 5.x | Component reuse across clients; type safety |
| Styling | Tailwind CSS | 3.x | Rapid prototyping; consistent design tokens |
| Build tool | Vite | 5.x | Fast dev server; optimized production builds |
| Backend (web) | Node.js + Express | 20 LTS / 4.x | REST APIs, webhook handlers |
| Backend (data) | Python + FastAPI | 3.11+ | ETL pipelines, data processing, report generation |
| Database | PostgreSQL (Supabase) | 15+ | Row-level security, real-time subscriptions, built-in auth |
| Analytics (client) | Google Analytics 4 | — | Industry standard; free tier sufficient |
| Analytics (custom) | PixelPro event layer | — | Granular funnel tracking; data owned by PixelPro |
| Dashboards | Recharts (in-app) | — | React-native; composable; lightweight |
| ORM | Prisma (Node) / SQLAlchemy (Python) | — | Type-safe DB access; migration management |
| Validation | Zod (TS) / Pydantic (Python) | — | Runtime type validation at boundaries |
| Auth | Supabase Auth (JWT) | — | Magic link + email/password; RLS integration |
| CI/CD | GitHub Actions + Vercel | — | Auto-deploy on push; preview URLs per PR |
| Containerization | Docker | — | ETL job isolation; reproducible environments |
| Monorepo | npm workspaces + Turborepo | — | Shared packages; optimized build graph |
| Testing (React) | Vitest + Testing Library + Playwright | — | Unit + E2E |
| Testing (Node) | Jest + Supertest | — | Unit + integration |
| Testing (Python) | Pytest | — | Unit + ETL testing |
| Error tracking | Sentry (free tier) | — | Production error monitoring |
| Uptime | UptimeRobot (free) | — | External uptime checks per client |
| Version control | Git / GitHub | — | Monorepo; per-client branches |
| AI acceleration | Claude Code + Lovable | — | ~60% faster delivery; scaffolding; code review |

## Hosting

| Service | What runs there | Tier |
|---------|----------------|------|
| Vercel | Client React apps + dashboard | Free per project |
| Supabase | PostgreSQL + auth | Free tier (500MB DB, 50K MAU) |
| GitHub Actions | ETL pipelines (scheduled) | Free for public/small private |
| Railway / Render | Node.js API (if not Vercel serverless) | Starter ~$5/mo |

## Upgrade Triggers
- Supabase: migrate to paid ($25/mo) when approaching 500MB DB or 50K MAU per client
- Vercel: upgrade if bandwidth exceeds 100GB/month per project
- Railway: scale to production plan if API traffic requires persistent connections

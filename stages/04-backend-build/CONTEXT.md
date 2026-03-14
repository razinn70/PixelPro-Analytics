# Stage 04: Backend Build

Build REST APIs, ETL pipelines, authentication, and automated data processing.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Client spec | ../01-client-onboarding/output/client-spec.md | "Features" section | API requirements |
| Schema | ../02-database-design/output/schema.md | Full file | Data models |
| Frontend | ../03-frontend-build/output/ | API mock files | Endpoint contracts |
| Reference | references/api-conventions.md | Full file | REST patterns |
| Reference | references/etl-patterns.md | Full file | Pipeline templates |
| Reference | references/auth-implementation.md | Full file | Supabase auth setup |
| Reference | references/rate-limiting.md | Full file | Rate limit config |

## Process

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

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 4 | Demo frontend calling live API endpoints. Verify data flows to DB. |
| 7 | Demo ETL output: daily_metrics populated, funnel rates computed. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Auth on all endpoints | No endpoint accessible without valid JWT (except public pages) |
| Rate limiting | All endpoints rate-limited; 429 returned on excess |
| No PII in logs | grep for email, name, phone in log output returns zero |
| ETL idempotent | Running ETL twice for same day produces same results |
| API documented | Every endpoint has method, path, params, response documented |
| Error handling | All endpoints return structured error JSON; no stack traces in production |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| API server | output/api/ | Node.js + Express project |
| ETL pipelines | output/etl/ | Python scripts with scheduling config |
| API docs | output/api-docs.md | Endpoint documentation |

## Handoff
Write outputs to `output/`. Stage 05 reads `output/api-docs.md` to connect dashboard.

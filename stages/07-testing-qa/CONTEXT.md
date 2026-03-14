# Stage 07: Testing & QA

Run unit, integration, and E2E tests. Validate performance and accessibility.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../06-security-hardening/output/ | All projects | Hardened build to test |
| Reference | references/test-strategy.md | Full file | Test breakdown |
| Reference | references/performance-budget.md | Full file | Metrics targets |
| Reference | references/accessibility-checklist.md | Full file | WCAG 2.1 AA |
| Shared | ../../shared/success-metrics.md | Full file | KPIs to validate |

## Process

1. Write and run unit tests: React components, API handlers, ETL functions (80% coverage)
2. Write and run integration tests: API endpoints with test database
3. Write and run E2E tests: critical user flows
4. Run Lighthouse audit on client site and dashboard
5. Run accessibility audit: axe-core, keyboard navigation, screen reader
6. Cross-browser test: Chrome, Firefox, Safari, Edge, iOS Safari, Chrome Android
7. Load test API: response times under 200ms at 100 concurrent requests
8. Verify analytics events fire across all tested browsers
9. Fix all failures. Re-run until all pass.

## Audit

| Check | Pass Condition |
|-------|---------------|
| Unit coverage | 80%+ line coverage on critical paths |
| E2E pass | All critical flows complete without failure |
| Lighthouse (site) | Performance 90+, Accessibility 90+, SEO 90+ |
| Lighthouse (dashboard) | Performance 85+, Accessibility 90+ |
| API latency | p95 < 200ms at 100 concurrent requests |
| Cross-browser | Zero breaking issues across 6 browsers |
| Analytics verified | Custom events fire in all tested browsers |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Tested build | output/ | Fully tested projects |
| Test report | output/test-report.md | Coverage, Lighthouse scores, cross-browser results |

## Handoff
Write outputs to `output/`. Stage 08 deploys the tested, hardened build.

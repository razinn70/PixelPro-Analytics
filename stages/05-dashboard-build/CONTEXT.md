# Stage 05: Dashboard Build

Build the client-facing analytics dashboard and automated reporting system.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Client spec | ../01-client-onboarding/output/client-spec.md | "KPIs" + "Funnel" sections | What to display |
| Backend | ../04-backend-build/output/api-docs.md | Full file | Data endpoints |
| Reference | references/dashboard-templates.md | Relevant vertical | Layout patterns |
| Reference | references/chart-conventions.md | Full file | Visualization standards |
| Reference | references/metric-definitions.md | Full file | CAC, LTV, funnel formulas |
| Reference | references/report-templates.md | Full file | Automated report formats |

## Process

1. Select dashboard template for client's vertical
2. Implement KPI cards: headline metrics with trend indicators
3. Build conversion funnel visualization: step-by-step with drop-off rates
4. Build revenue/order time series charts
5. Build cohort retention heatmap (for ecommerce/restaurant clients)
6. Build geographic breakdown (if applicable to client)
7. Implement date range picker and filtering
8. Build automated report generation: weekly summary PDF/email
9. Implement comparison periods: this week vs last week, this month vs last month

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 3 | Present dashboard with KPIs and funnel. Client validates numbers. |
| 8 | Demo automated report. Client approves format. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| KPI accuracy | Dashboard values match raw SQL queries within 1% tolerance |
| Funnel math | Drop-off percentages sum correctly at each step |
| Date range | All charts respond to date picker changes |
| Mobile | Dashboard usable on 768px+ screens |
| Report generation | Automated report produces valid output for last 7 days |
| No stale data | Dashboard shows data as recent as last ETL run (< 24 hours) |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Dashboard app | output/dashboard/ | React dashboard with charts |
| Report generator | output/reports/ | Python script producing PDF/email reports |

## Handoff
Write outputs to `output/`. Stage 06 audits the dashboard for security.

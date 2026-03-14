# Stage 01: Client Onboarding

Gather requirements, configure the client's vertical template, and set up analytics foundations.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Config | ../../_config/client-verticals.md | Relevant vertical section | Starter template for client type |
| Config | ../../_config/brand-identity.md | "Service Offering" section | Scope of deliverables |
| Reference | references/onboarding-checklist.md | Full file | Required info to collect |
| Reference | references/vertical-templates.md | Full file | Industry-specific defaults |
| Reference | references/analytics-setup-guide.md | Full file | GA4 + custom event plan |
| Shared | ../../shared/client-registry.md | Full file | Avoid naming/slug conflicts |

## Process

1. Conduct client intake: business name, vertical, goals, existing tech, budget
2. Select vertical template (restaurant, ecommerce, service)
3. Define site pages and features based on vertical + client needs
4. Create GA4 property and configure basic events
5. Define custom event plan: which user actions to track beyond GA4 defaults
6. Define conversion funnel: steps from landing to goal (order, contact, booking)
7. Document KPIs: which metrics the client wants on their dashboard
8. Create client record in client-registry.md

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 3 | Present site map + feature list. Client confirms scope. |
| 7 | Present KPI list + funnel definition. Client confirms metrics. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Vertical assigned | Client has one of: restaurant, ecommerce, service |
| Funnel defined | At least 3 steps in conversion funnel with clear entry/exit |
| KPIs defined | Minimum 5 KPIs with calculation method documented |
| Analytics plan | GA4 property created; custom event list covers all funnel steps |
| Slug unique | Client slug does not conflict with existing clients |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Client spec | output/client-spec.md | Business requirements, site map, features, analytics plan, KPIs, funnel |

## Handoff
Write `output/client-spec.md`. Stage 02 reads from this file.

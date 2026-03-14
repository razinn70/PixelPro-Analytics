# Stage 03: Frontend Build

Build the client's React web application with analytics event tracking integrated from the start.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Onboarding | ../01-client-onboarding/output/client-spec.md | "Site Map" + "Features" | What to build |
| DB | ../02-database-design/output/schema.md | Full file | Data models for API calls |
| Config | ../../_config/design-system.md | Full file | Design tokens |
| Reference | references/component-library.md | Full file | Reusable components |
| Reference | references/build-conventions.md | Full file | Code patterns |
| Reference | references/analytics-integration.md | Full file | Event tracking implementation |
| Reference | references/vertical-layouts.md | Relevant vertical | Page templates |

## Process

1. Scaffold React + TypeScript project from vertical template
2. Configure Tailwind with client's brand colors (extend PixelPro design tokens)
3. Build page layouts from site map
4. Implement components from library; create new ones only when library gaps exist
5. Integrate GA4 tracking: page views, scroll depth, click events
6. Implement custom event layer: funnel step tracking, cart events, form submissions
7. Wire API endpoints (mocked initially; backend connects in Stage 04)
8. Implement responsive design: mobile-first, 320px to 1440px
9. Add SEO metadata: OG tags, structured data, meta descriptions

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 3 | Present page layouts. Client reviews flow. |
| 6 | Demo analytics events firing in GA4 debug view. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Component reuse | 60%+ of components from shared library |
| Analytics coverage | Every funnel step fires a custom event |
| Responsive | All pages render at 320px, 768px, 1440px |
| Lighthouse | Performance 90+, Accessibility 90+ on dev build |
| No hardcoded text | All copy in data files or CMS, not inline strings |
| TypeScript strict | Zero any types; strict mode enabled |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Client app | output/ | React + TypeScript project with analytics |

## Handoff
Write React app to `output/`. Stage 04 connects backend APIs. Stage 05 reads for dashboard data context.

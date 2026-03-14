# Component Library

Shared React components from `packages/ui/`. Import from `@pixelpro/ui`.

## Layout Components

| Component | Props | Usage |
|-----------|-------|-------|
| `NavBar` | `logo, links, cta` | Top navigation for all verticals |
| `Footer` | `links, social, contact` | Page footer |
| `PageLayout` | `children, title, description` | SEO wrapper with meta tags |
| `Section` | `children, id, className` | Page section with padding |
| `Container` | `children, maxWidth` | Constrained width wrapper |

## UI Components

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | `variant, size, onClick, href, children` | Primary/secondary/ghost variants |
| `Card` | `children, className, onClick` | Content card with border/shadow |
| `Badge` | `variant, children` | Status/category label |
| `Spinner` | `size` | Loading indicator |
| `Alert` | `type, message` | Error/success/info messages |
| `Modal` | `isOpen, onClose, title, children` | Overlay dialog |

## Form Components

| Component | Props | Usage |
|-----------|-------|-------|
| `Input` | `label, name, type, value, onChange, error` | Text/email/phone input |
| `Textarea` | `label, name, value, onChange, error` | Multi-line text |
| `Select` | `label, name, options, value, onChange` | Dropdown select |
| `Checkbox` | `label, name, checked, onChange` | Boolean toggle |
| `Form` | `onSubmit, children` | Form wrapper with submit handling |

## Analytics / Dashboard Components

| Component | Props | Usage |
|-----------|-------|-------|
| `KPICard` | `label, value, change, trend, unit` | Metric card with trend arrow |
| `FunnelViz` | `steps, data` | Conversion funnel visualization |
| `Chart` | `type, data, xKey, yKey, color` | Recharts wrapper (line/bar/pie) |
| `DataTable` | `columns, rows, sortable, paginate` | Tabular data display |
| `DatePicker` | `startDate, endDate, onChange` | Date range selector |
| `MetricComparison` | `current, previous, label` | Period-over-period comparison |

## Hooks

| Hook | Returns | Usage |
|------|---------|-------|
| `useAnalytics()` | `track(event, data)` | Fire GA4 + custom events |
| `useFunnel(funnelId)` | `{ steps, data, loading }` | Fetch funnel data |
| `useMetrics(clientId, dateRange)` | `{ metrics, loading }` | Fetch KPI data |
| `usePageView()` | void | Auto-tracks route changes (use in layout) |

## Adding New Components

1. Check library first — build from existing if 80% match
2. If new component needed: add to `packages/ui/src/components/`
3. Export from `packages/ui/src/components/index.ts`
4. Document in this file
5. Do not duplicate existing components with minor variations

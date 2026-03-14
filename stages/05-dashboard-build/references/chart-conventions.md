# Chart Conventions

## Library
Primary: Recharts (React-native, composable)
Fallback / complex visualizations: Tableau (client-facing exports)

## Color Palette
- Primary data series: `#4A90D9` (PixelPro blue)
- Secondary series: `#FF6B35` (PixelPro orange)
- Positive trend: `#22C55E` (green-500)
- Negative trend: `#EF4444` (red-500)
- Neutral: `#94A3B8` (slate-400)
- Grid lines: `#E2E8F0` (slate-200)
- Background: transparent (inherits card background)

## Chart Types

| Data type | Chart |
|-----------|-------|
| Trend over time (single metric) | Line chart |
| Trend over time (multiple metrics) | Multi-line chart |
| Comparison (categories) | Horizontal bar chart |
| Composition (parts of whole) | Pie chart (max 5 slices; group remainder as "Other") |
| Distribution (frequency) | Vertical bar chart |
| Correlation | Scatter plot |
| Cohort retention | Heatmap (custom component) |
| Funnel | Custom FunnelViz component |

## Formatting

- Currency: `CAD $X,XXX.XX` or `$X.XXk` for large values
- Percentages: `XX.X%` (one decimal)
- Large numbers: `1.2k`, `45.3k`, `1.2M` (abbreviated above 9999)
- Dates: `MMM D` for daily (Mar 1), `MMM YYYY` for monthly (Mar 2026)

## Axes
- X-axis: dates or categories
- Y-axis: always start at 0 (unless showing rates/percentages that cannot be zero)
- Y-axis labels: abbreviated format (1k, 10k)

## Tooltips
All charts must have tooltips showing:
- Exact value (formatted)
- Date/category
- Comparison to previous period where applicable

## Accessibility
- All charts must include `aria-label` describing the chart
- Data available in tabular format via toggle (screen reader accessible)
- Color not the only differentiator (use dashed/dotted lines for secondary series)

## Responsive Behavior
- Charts container: 100% width, fixed height in px
- Desktop heights: line/bar 300px, pie 250px, funnel 400px, heatmap 280px
- Mobile (< 768px): reduce heights by 20%, hide X-axis labels if crowded

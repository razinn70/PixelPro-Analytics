# Dashboard Templates

## Default Layout (All Verticals)

```
<DashboardLayout>
  <Header>
    Client Logo | Date Range Picker | Export Button
  </Header>
  <KPIRow>
    4-6 KPICards (headline metrics with trend)
  </KPIRow>
  <ChartRow>
    <TimeSeriesChart> (primary metric over time, 70% width)
    <ComparisonWidget> (vs previous period, 30% width)
  </ChartRow>
  <FunnelRow>
    <FunnelViz> (step-by-step conversion, 50% width)
    <TopBreakdown> (top pages/products/services, 50% width)
  </FunnelRow>
  [Vertical-specific section]
  <Footer>
    Last updated timestamp | Data freshness indicator
  </Footer>
</DashboardLayout>
```

## Restaurant Dashboard

### KPI Cards
1. Orders Today (vs yesterday)
2. Revenue Today (vs yesterday)
3. Average Order Value (vs last 7 days)
4. Menu Page Visits (vs last 7 days)
5. Online Order Conversion Rate (vs last 7 days)
6. Repeat Visitors (vs last 7 days)

### Charts
- Orders per day (line chart, last 30 days)
- Revenue per day (bar chart, last 30 days)
- Top menu items by order count (horizontal bar)
- Order conversion funnel

## E-Commerce Dashboard

### KPI Cards
1. Revenue (vs previous period)
2. Orders (vs previous period)
3. Average Order Value (vs previous period)
4. Cart Abandonment Rate (vs previous period)
5. New Customers (vs previous period)
6. Returning Customer Rate (vs previous period)

### Charts
- Daily revenue line chart (last 30 days)
- Conversion funnel (product view → purchase)
- Revenue by product category (pie chart)
- Cohort retention heatmap (weekly cohorts, 8 weeks)

## Service Business Dashboard

### KPI Cards
1. Total Leads (vs previous period)
2. Lead Conversion Rate (vs previous period)
3. Contact Form Submissions (vs previous period)
4. Quote Requests (vs previous period)
5. Top Traffic Source
6. Most Viewed Service

### Charts
- Leads per day (bar chart, last 30 days)
- Lead conversion funnel
- Traffic source breakdown (pie chart)
- Service page views (horizontal bar)

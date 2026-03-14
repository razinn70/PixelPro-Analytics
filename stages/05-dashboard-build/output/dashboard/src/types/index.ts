export interface KPIMetric {
  label:       string
  value:       number
  change:      number        // percentage change vs prior period
  trend:       'up' | 'down' | 'neutral'
  unit:        'currency' | 'percent' | 'count'
  description: string
}

export interface FunnelStep {
  step_index:       number
  name:             string
  sessions:         number
  conversion_rate:  number   // rate FROM previous step (null for first step)
  drop_off_rate:    number
}

export interface CohortRow {
  cohort_week: string        // ISO week start date
  weeks:       number[]      // retention % for weeks 0-7
  total_users: number
}

export interface RevenueDataPoint {
  date:    string
  revenue: number
  orders:  number
}

export interface Report {
  id:           string
  client_id:    string
  report_type:  'weekly' | 'monthly'
  period_start: string
  period_end:   string
  status:       'generating' | 'ready' | 'failed'
  file_url:     string | null
  created_at:   string
}

export interface DateRange {
  from: string   // ISO date string
  to:   string   // ISO date string
}

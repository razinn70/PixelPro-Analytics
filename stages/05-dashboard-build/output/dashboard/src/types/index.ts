export interface KPIMetric {
  name: string
  value: number
  unit: 'percent' | 'currency' | 'count'
  change?: number
  changeDirection?: 'up' | 'down' | 'neutral'
}

export interface DailyMetric {
  date: string
  metric_name: string
  value: number
  client_id: string
}

export interface FunnelStep {
  step_number: number
  step_name: string
  count: number
  conversion_rate: number
}

export interface Funnel {
  id: string
  name: string
  client_id: string
  steps: FunnelStep[]
}

export interface CohortRow {
  cohort_week: string
  week_0: number
  week_1: number
  week_2: number
  week_3: number
  week_4: number
  week_5: number
  week_6: number
  week_7: number
}

export interface Report {
  id: string
  client_id: string
  status: 'pending' | 'generating' | 'complete' | 'failed'
  report_url?: string
  created_at: string
}

export interface DateRange {
  from: Date
  to: Date
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

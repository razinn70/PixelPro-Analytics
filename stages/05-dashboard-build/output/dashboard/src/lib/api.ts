import { createClient } from '@supabase/supabase-js'
import type { DateRange, KPIMetric, FunnelStep, CohortRow, RevenueDataPoint, Report } from '@/types'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
)

const API_URL    = import.meta.env.VITE_API_URL as string
const CLIENT_ID  = import.meta.env.VITE_CLIENT_ID as string

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function getDateParams(range: DateRange) {
  return new URLSearchParams({ client_id: CLIENT_ID, from: range.from, to: range.to }).toString()
}

export async function fetchMetrics(range: DateRange): Promise<KPIMetric[]> {
  return authFetch<KPIMetric[]>(`/api/v1/metrics?${getDateParams(range)}`)
}

export async function fetchFunnel(funnelId: string, range: DateRange): Promise<FunnelStep[]> {
  return authFetch<FunnelStep[]>(`/api/v1/funnels/${funnelId}?${getDateParams(range)}`)
}

export async function fetchCohorts(range: DateRange): Promise<CohortRow[]> {
  return authFetch<CohortRow[]>(`/api/v1/cohorts?${getDateParams(range)}`)
}

export async function fetchRevenueTimeSeries(range: DateRange): Promise<RevenueDataPoint[]> {
  return authFetch<RevenueDataPoint[]>(`/api/v1/metrics/revenue-series?${getDateParams(range)}`)
}

export async function fetchReports(): Promise<Report[]> {
  return authFetch<Report[]>(`/api/v1/reports?client_id=${CLIENT_ID}`)
}

export async function generateReport(reportType: 'weekly' | 'monthly'): Promise<{ id: string }> {
  return authFetch<{ id: string }>('/api/v1/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ client_id: CLIENT_ID, report_type: reportType }),
  })
}

export { supabase }

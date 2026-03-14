import type { DailyMetric, Funnel, CohortRow, Report } from '@/types'
import { supabase } from '@/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL as string
const API_PREFIX = '/api/v1'

interface ApiEnvelope<T> {
  data: T
}

/**
 * Generic fetch wrapper. Reads VITE_API_URL, attaches JSON headers,
 * and throws a descriptive Error on any non-2xx response.
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers ?? {}),
    },
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as {
        error?: string | { message?: string }
        message?: string
      }
      message = typeof body.error === 'string'
        ? body.error
        : body.error?.message ?? body.message ?? message
    } catch {
      // ignore JSON parse failures; use the status string
    }
    throw new Error(message)
  }

  const body = await res.json() as ApiEnvelope<T>
  return body.data
}

/**
 * Fetch daily metrics for a client within a date range.
 * GET /metrics?client_id=&from=&to=
 */
export function fetchMetrics(
  clientId: string,
  from: string,
  to: string,
): Promise<DailyMetric[]> {
  const params = new URLSearchParams({ client_id: clientId, from, to })
  return apiFetch<DailyMetric[]>(`/metrics?${params.toString()}`)
}

/**
 * Fetch a single funnel (with its steps) by ID.
 * GET /funnels/:id
 */
export function fetchFunnel(funnelId: string): Promise<Funnel> {
  return apiFetch<Funnel>(`/funnels/${encodeURIComponent(funnelId)}`)
}

/**
 * Fetch cohort retention rows for a client.
 * GET /cohorts?client_id=
 */
export function fetchCohorts(clientId: string): Promise<CohortRow[]> {
  const params = new URLSearchParams({ client_id: clientId })
  return apiFetch<CohortRow[]>(`/cohorts?${params.toString()}`)
}

/**
 * Fetch all reports for a client.
 * GET /reports?client_id=
 */
export function fetchReports(clientId: string): Promise<Report[]> {
  const params = new URLSearchParams({ client_id: clientId })
  return apiFetch<Report[]>(`/reports?${params.toString()}`)
}

/**
 * Trigger generation of a new report for a client.
 * POST /reports/generate  { client_id }
 */
export function generateReport(clientId: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ client_id: clientId }),
  })
}

import { useState, useEffect } from 'react'
import { fetchMetrics, fetchRevenueTimeSeries } from '@/lib/api'
import type { DateRange, KPIMetric, RevenueDataPoint } from '@/types'

interface MetricsState {
  kpis:         KPIMetric[]
  revenueSeries: RevenueDataPoint[]
  loading:      boolean
  error:        string | null
}

export function useMetrics(dateRange: DateRange): MetricsState {
  const [state, setState] = useState<MetricsState>({
    kpis: [], revenueSeries: [], loading: true, error: null,
  })

  useEffect(() => {
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null }))

    Promise.all([fetchMetrics(dateRange), fetchRevenueTimeSeries(dateRange)])
      .then(([kpis, revenueSeries]) => {
        if (!cancelled) setState({ kpis, revenueSeries, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: (err as Error).message }))
      })

    return () => { cancelled = true }
  }, [dateRange.from, dateRange.to])

  return state
}

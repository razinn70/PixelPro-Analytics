import { useState, useEffect } from 'react'
import { fetchFunnel } from '@/lib/api'
import type { DateRange, FunnelStep } from '@/types'

interface FunnelState {
  steps:   FunnelStep[]
  loading: boolean
  error:   string | null
}

const DEFAULT_FUNNEL_ID = import.meta.env.VITE_FUNNEL_ID as string ?? '1'

export function useFunnel(dateRange: DateRange, funnelId = DEFAULT_FUNNEL_ID): FunnelState {
  const [state, setState] = useState<FunnelState>({ steps: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null }))

    fetchFunnel(funnelId, dateRange)
      .then(steps => {
        if (!cancelled) setState({ steps, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: (err as Error).message }))
      })

    return () => { cancelled = true }
  }, [funnelId, dateRange.from, dateRange.to])

  return state
}

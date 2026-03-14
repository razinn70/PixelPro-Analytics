import { useState, useEffect } from 'react'
import { fetchFunnel } from '@/lib/api'
import type { Funnel } from '@/types'

interface FunnelState {
  funnel: Funnel | null
  loading: boolean
  error: string | null
}

export function useFunnel(funnelId: string): FunnelState {
  const [state, setState] = useState<FunnelState>({
    funnel:  null,
    loading: true,
    error:   null,
  })

  useEffect(() => {
    if (!funnelId) {
      setState({ funnel: null, loading: false, error: 'No funnel ID provided.' })
      return
    }

    let cancelled = false

    setState(s => ({ ...s, loading: true, error: null }))

    fetchFunnel(funnelId)
      .then(funnel => {
        if (cancelled) return
        setState({ funnel, loading: false, error: null })
      })
      .catch(err => {
        if (cancelled) return
        setState({ funnel: null, loading: false, error: (err as Error).message })
      })

    return () => { cancelled = true }
  }, [funnelId])

  return state
}

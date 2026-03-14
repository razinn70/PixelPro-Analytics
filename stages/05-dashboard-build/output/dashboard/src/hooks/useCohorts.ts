import { useState, useEffect } from 'react'
import { fetchCohorts } from '@/lib/api'
import type { CohortRow } from '@/types'

interface CohortState {
  cohorts: CohortRow[]
  loading: boolean
  error: string | null
}

export function useCohorts(clientId: string): CohortState {
  const [state, setState] = useState<CohortState>({
    cohorts: [],
    loading: true,
    error:   null,
  })

  useEffect(() => {
    let cancelled = false

    setState(s => ({ ...s, loading: true, error: null }))

    fetchCohorts(clientId)
      .then(cohorts => {
        if (cancelled) return
        setState({ cohorts, loading: false, error: null })
      })
      .catch(err => {
        if (cancelled) return
        setState({ cohorts: [], loading: false, error: (err as Error).message })
      })

    return () => { cancelled = true }
  }, [clientId])

  return state
}

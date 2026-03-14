import { useState, useEffect } from 'react'
import { fetchCohorts } from '@/lib/api'
import type { DateRange, CohortRow } from '@/types'

interface CohortState {
  rows:    CohortRow[]
  loading: boolean
  error:   string | null
}

export function useCohorts(dateRange: DateRange): CohortState {
  const [state, setState] = useState<CohortState>({ rows: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState(s => ({ ...s, loading: true, error: null }))

    fetchCohorts(dateRange)
      .then(rows => {
        if (!cancelled) setState({ rows, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: (err as Error).message }))
      })

    return () => { cancelled = true }
  }, [dateRange.from, dateRange.to])

  return state
}

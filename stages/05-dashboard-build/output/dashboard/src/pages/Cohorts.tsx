import CohortHeatmap from '@/components/CohortHeatmap'
import { useCohorts } from '@/hooks/useCohorts'
import type { DateRange } from '@/types'

interface Props { dateRange: DateRange }

export default function Cohorts({ dateRange }: Props) {
  const { rows, loading, error } = useCohorts(dateRange)

  const avgWk4Retention = rows.length > 0
    ? rows.reduce((sum, r) => sum + (r.weeks[4] ?? 0), 0) / rows.length
    : 0

  const bestCohort = rows.length > 0
    ? rows.reduce((best, r) => (r.weeks[4] ?? 0) > (best.weeks[4] ?? 0) ? r : best)
    : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Cohort Analysis</h1>

      {error && <p className="text-danger text-sm">{error}</p>}
      {loading && <p className="text-text-secondary">Loading…</p>}

      {!loading && rows.length > 0 && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl p-5 border border-border">
              <p className="text-text-secondary text-sm mb-1">Avg Week-4 Retention</p>
              <p className="text-2xl font-bold text-primary">{avgWk4Retention.toFixed(1)}%</p>
            </div>
            <div className="bg-surface rounded-xl p-5 border border-border">
              <p className="text-text-secondary text-sm mb-1">Best Cohort (Wk 4)</p>
              <p className="text-2xl font-bold text-success">
                {bestCohort ? `${(bestCohort.weeks[4] ?? 0).toFixed(1)}%` : '—'}
              </p>
            </div>
            <div className="bg-surface rounded-xl p-5 border border-border">
              <p className="text-text-secondary text-sm mb-1">Total Cohorts</p>
              <p className="text-2xl font-bold text-text-primary">{rows.length}</p>
            </div>
          </div>

          <CohortHeatmap rows={rows} />
        </>
      )}
    </div>
  )
}

import { useCohorts } from '@/hooks/useCohorts'
import CohortHeatmap from '@/components/CohortHeatmap'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string

export default function Cohorts() {
  const { cohorts, loading, error } = useCohorts(CLIENT_ID)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Customer Retention Cohorts</h1>
        <p className="text-text-secondary text-sm mt-1">
          Percentage of customers from each weekly cohort who returned in subsequent weeks.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-surface rounded-xl p-6 border border-border animate-pulse h-64" />
      )}

      {/* Heatmap */}
      {!loading && !error && cohorts.length > 0 && (
        <CohortHeatmap cohorts={cohorts} />
      )}

      {/* Empty state */}
      {!loading && !error && cohorts.length === 0 && (
        <p className="text-text-secondary text-sm">No cohort data available.</p>
      )}
    </div>
  )
}

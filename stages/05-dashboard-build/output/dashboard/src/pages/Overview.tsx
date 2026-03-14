import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/RevenueChart'
import FunnelChart from '@/components/FunnelChart'
import { useMetrics } from '@/hooks/useMetrics'
import { useFunnel } from '@/hooks/useFunnel'
import type { DateRange } from '@/types'

interface Props { dateRange: DateRange }

export default function Overview({ dateRange }: Props) {
  const { kpis, revenueSeries, loading: metricsLoading, error: metricsError } = useMetrics(dateRange)
  const { steps, loading: funnelLoading, error: funnelError } = useFunnel(dateRange)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      {metricsError && (
        <p className="text-danger text-sm">Failed to load metrics: {metricsError}</p>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-surface rounded-xl p-5 border border-border animate-pulse h-28" />
            ))
          : kpis.map(kpi => <KPICard key={kpi.label} {...kpi} />)
        }
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueSeries.length > 0 && <RevenueChart data={revenueSeries} />}
        {funnelError
          ? <p className="text-danger text-sm">Failed to load funnel: {funnelError}</p>
          : !funnelLoading && steps.length > 0
            ? <FunnelChart steps={steps} />
            : null
        }
      </div>
    </div>
  )
}

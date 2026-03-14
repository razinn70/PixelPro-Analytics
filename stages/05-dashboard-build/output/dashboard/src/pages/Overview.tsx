import { useState } from 'react'
import { subDays } from 'date-fns'
import { useMetrics } from '@/hooks/useMetrics'
import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/RevenueChart'
import DateRangePicker, { defaultDateRange } from '@/components/DateRangePicker'
import type { DateRange } from '@/types'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string

export default function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)

  const { kpis, dailyData, loading, error } = useMetrics(CLIENT_ID, dateRange)

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-text-primary">Overview</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
          Failed to load metrics: {error}
        </div>
      )}

      {/* KPI grid — 8 cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl p-6 border border-border animate-pulse h-32"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <KPICard key={kpi.name} metric={kpi} />
          ))}
        </div>
      )}

      {/* Revenue trend chart */}
      {!loading && dailyData.length > 0 && (
        <RevenueChart data={dailyData} />
      )}
    </div>
  )
}

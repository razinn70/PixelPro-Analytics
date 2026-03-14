import type { KPIMetric } from '@/types'

function formatValue(value: number, unit: KPIMetric['unit']): string {
  if (unit === 'currency') return `$${value.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (unit === 'percent')  return `${value.toFixed(1)}%`
  return value.toLocaleString()
}

export default function KPICard({ label, value, change, trend, unit, description }: KPIMetric) {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted'
  const trendArrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'
  const changeAbs  = Math.abs(change)

  return (
    <div className="bg-surface rounded-xl p-5 border border-border">
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="text-text-primary text-2xl font-bold mb-2">{formatValue(value, unit)}</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-medium ${trendColor}`}>
          {trendArrow} {changeAbs.toFixed(1)}%
        </span>
        <span className="text-xs text-muted">vs prior period</span>
      </div>
      <p className="text-xs text-muted mt-2">{description}</p>
    </div>
  )
}

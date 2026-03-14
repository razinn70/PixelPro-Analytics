import clsx from 'clsx'
import type { KPIMetric } from '@/types'

function formatValue(value: number, unit: KPIMetric['unit']): string {
  switch (unit) {
    case 'currency':
      return `$${value.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'count':
      return value.toLocaleString('en-CA')
  }
}

interface Props {
  metric: KPIMetric
}

export default function KPICard({ metric }: Props) {
  const { name, value, unit, change, changeDirection } = metric

  const hasChange = change !== undefined && changeDirection !== undefined

  const arrowIcon =
    changeDirection === 'up'   ? '▲' :
    changeDirection === 'down' ? '▼' : '—'

  const changeColor = clsx({
    'text-success': changeDirection === 'up',
    'text-danger':  changeDirection === 'down',
    'text-muted':   changeDirection === 'neutral' || !changeDirection,
  })

  return (
    <div className="bg-surface rounded-xl p-6 border border-border flex flex-col gap-3">
      <p className="text-text-secondary text-sm font-medium leading-tight">{name}</p>

      <p className="text-text-primary text-2xl font-bold leading-none">
        {formatValue(value, unit)}
      </p>

      {hasChange && (
        <div className="flex items-center gap-1">
          <span className={clsx('text-xs font-semibold', changeColor)}>
            {arrowIcon} {Math.abs(change!).toFixed(1)}%
          </span>
          <span className="text-xs text-muted">vs prior period</span>
        </div>
      )}
    </div>
  )
}

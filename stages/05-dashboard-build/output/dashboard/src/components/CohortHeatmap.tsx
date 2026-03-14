import { format, parseISO } from 'date-fns'
import type { CohortRow } from '@/types'

interface Props {
  cohorts: CohortRow[]
}

const WEEK_KEYS = [
  'week_0', 'week_1', 'week_2', 'week_3',
  'week_4', 'week_5', 'week_6', 'week_7',
] as const

type WeekKey = typeof WEEK_KEYS[number]

/** Map a retention percentage (0–100) to an inline background-color using primary #4A90D9 with varying opacity. */
function cellStyle(pct: number): React.CSSProperties {
  const opacity = Math.min(1, Math.max(0, pct / 100))
  return { backgroundColor: `rgba(74, 144, 217, ${opacity.toFixed(2)})` }
}

function cellTextClass(pct: number): string {
  // Use white text on darker cells, muted on near-empty cells.
  return pct >= 40 ? 'text-white font-semibold' : 'text-text-secondary'
}

export default function CohortHeatmap({ cohorts }: Props) {
  if (cohorts.length === 0) return null

  return (
    <div className="bg-surface rounded-xl p-6 border border-border overflow-x-auto">
      <p className="font-semibold text-text-primary mb-4">Retention Heatmap (8-Week Cohorts)</p>
      <table className="text-xs border-collapse min-w-max w-full">
        <thead>
          <tr>
            <th className="text-left text-text-secondary pb-2 pr-6 font-medium whitespace-nowrap">
              Cohort Week
            </th>
            {WEEK_KEYS.map((_, i) => (
              <th
                key={i}
                className="text-center text-text-secondary pb-2 px-1 font-medium w-14"
              >
                Wk {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map(row => (
            <tr key={row.cohort_week}>
              <td className="text-text-secondary pr-6 py-1 whitespace-nowrap">
                {format(parseISO(row.cohort_week), 'MMM d, yyyy')}
              </td>
              {WEEK_KEYS.map(key => {
                const pct = row[key as WeekKey]
                return (
                  <td key={key} className="px-1 py-1">
                    <div
                      className={`w-12 h-8 rounded flex items-center justify-center text-xs ${cellTextClass(pct)}`}
                      style={cellStyle(pct)}
                      title={`${pct.toFixed(1)}% retained`}
                    >
                      {pct > 0 ? `${Math.round(pct)}%` : '—'}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

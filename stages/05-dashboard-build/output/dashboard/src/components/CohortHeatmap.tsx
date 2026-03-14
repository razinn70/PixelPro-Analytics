import type { CohortRow } from '@/types'
import { format, parseISO } from 'date-fns'

interface Props {
  rows: CohortRow[]
}

function pctToColor(pct: number): string {
  if (pct >= 60) return 'bg-primary opacity-90'
  if (pct >= 40) return 'bg-primary opacity-70'
  if (pct >= 20) return 'bg-primary opacity-45'
  if (pct > 0)   return 'bg-primary opacity-20'
  return 'bg-dark'
}

export default function CohortHeatmap({ rows }: Props) {
  return (
    <div className="bg-surface rounded-xl p-5 border border-border overflow-x-auto">
      <p className="font-semibold text-text-primary mb-4">Cohort Retention Heatmap</p>
      <table className="text-xs border-collapse w-full min-w-[560px]">
        <thead>
          <tr>
            <th className="text-left text-text-secondary pb-2 pr-4 font-medium">Cohort</th>
            <th className="text-text-secondary pb-2 px-1 font-medium">Users</th>
            {Array.from({ length: 8 }, (_, i) => (
              <th key={i} className="text-text-secondary pb-2 px-1 font-medium">Wk {i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.cohort_week}>
              <td className="text-text-secondary pr-4 py-0.5 whitespace-nowrap">
                {format(parseISO(row.cohort_week), 'MMM d')}
              </td>
              <td className="text-text-secondary text-center px-1">{row.total_users}</td>
              {row.weeks.map((pct, wIdx) => (
                <td key={wIdx} className="px-1 py-0.5">
                  <div
                    className={`w-10 h-7 rounded flex items-center justify-center text-text-primary font-medium ${pctToColor(pct)}`}
                    title={`${pct.toFixed(1)}% retained`}
                  >
                    {pct > 0 ? `${Math.round(pct)}%` : '—'}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

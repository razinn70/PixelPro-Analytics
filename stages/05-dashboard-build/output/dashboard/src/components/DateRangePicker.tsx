import { format, subDays } from 'date-fns'
import type { DateRange } from '@/types'

interface Props {
  value: DateRange
  onChange: (range: DateRange) => void
}

const ISO = (d: Date) => format(d, 'yyyy-MM-dd')

/** Default date range: last 30 days. */
export function defaultDateRange(): DateRange {
  const to   = new Date()
  const from = subDays(to, 29)
  return { from, to }
}

export default function DateRangePicker({ value, onChange }: Props) {
  const fromStr  = ISO(value.from)
  const toStr    = ISO(value.to)
  const todayStr = ISO(new Date())

  function handleFrom(e: React.ChangeEvent<HTMLInputElement>) {
    const newFrom = new Date(e.target.value)
    if (!isNaN(newFrom.getTime())) {
      onChange({ ...value, from: newFrom })
    }
  }

  function handleTo(e: React.ChangeEvent<HTMLInputElement>) {
    const newTo = new Date(e.target.value)
    if (!isNaN(newTo.getTime())) {
      onChange({ ...value, to: newTo })
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-xs text-text-secondary">From</label>
      <input
        type="date"
        value={fromStr}
        max={toStr}
        onChange={handleFrom}
        className="text-xs bg-dark border border-border rounded px-2 py-1 text-text-secondary focus:border-primary focus:outline-none"
      />
      <span className="text-muted text-xs">to</span>
      <input
        type="date"
        value={toStr}
        min={fromStr}
        max={todayStr}
        onChange={handleTo}
        className="text-xs bg-dark border border-border rounded px-2 py-1 text-text-secondary focus:border-primary focus:outline-none"
      />
    </div>
  )
}

import { format, subDays } from 'date-fns'
import type { DateRange } from '@/types'

interface Props {
  value:    DateRange
  onChange: (range: DateRange) => void
}

const PRESETS: { label: string; days: number }[] = [
  { label: '7d',  days: 6  },
  { label: '30d', days: 29 },
  { label: '90d', days: 89 },
]

export default function DateRangePicker({ value, onChange }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd')

  function applyPreset(days: number) {
    onChange({
      from: format(subDays(new Date(), days), 'yyyy-MM-dd'),
      to:   today,
    })
  }

  return (
    <div className="flex items-center gap-2">
      {PRESETS.map(p => (
        <button
          key={p.label}
          onClick={() => applyPreset(p.days)}
          className="text-xs px-2 py-1 rounded border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
        >
          {p.label}
        </button>
      ))}
      <input
        type="date"
        value={value.from}
        max={value.to}
        onChange={e => onChange({ ...value, from: e.target.value })}
        className="text-xs bg-dark border border-border rounded px-2 py-1 text-text-secondary focus:border-primary outline-none"
      />
      <span className="text-muted text-xs">→</span>
      <input
        type="date"
        value={value.to}
        min={value.from}
        max={today}
        onChange={e => onChange({ ...value, to: e.target.value })}
        className="text-xs bg-dark border border-border rounded px-2 py-1 text-text-secondary focus:border-primary outline-none"
      />
    </div>
  )
}

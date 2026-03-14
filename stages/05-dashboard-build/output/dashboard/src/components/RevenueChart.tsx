import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { DailyMetric } from '@/types'

interface Props {
  data: DailyMetric[]
}

export default function RevenueChart({ data }: Props) {
  // Filter to only revenue rows and sort chronologically.
  const revenueRows = data
    .filter(d => d.metric_name === 'revenue')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date:    d.date,
      label:   format(parseISO(d.date), 'MMM d'),
      revenue: d.value,
    }))

  if (revenueRows.length === 0) return null

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <p className="font-semibold text-text-primary mb-4">Daily Revenue</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={revenueRows} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#F8FAFC', fontWeight: 600 }}
            itemStyle={{ color: '#FF6B35' }}
            formatter={(v: number) => [`$${v.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`, 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#FF6B35"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#FF6B35' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

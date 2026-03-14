import {
  ResponsiveContainer, ComposedChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { RevenueDataPoint } from '@/types'

interface Props {
  data: RevenueDataPoint[]
}

export default function RevenueChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'MMM d'),
  }))

  return (
    <div className="bg-surface rounded-xl p-5 border border-border">
      <p className="font-semibold text-text-primary mb-4">Revenue & Orders</p>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={formatted} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="dateLabel" tick={{ fill: '#94A3B8', fontSize: 11 }} />
          <YAxis yAxisId="rev" tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={v => `$${v}`} />
          <YAxis yAxisId="orders" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#F8FAFC' }}
          />
          <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
          <Bar    yAxisId="orders" dataKey="orders"  fill="#FF6B35" opacity={0.7} name="Orders" radius={[3,3,0,0]} />
          <Line  yAxisId="rev"    dataKey="revenue" stroke="#4A90D9" strokeWidth={2} dot={false} name="Revenue ($)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

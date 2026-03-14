import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import type { FunnelStep } from '@/types'

interface Props {
  steps: FunnelStep[]
}

interface CustomLabelProps {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: number
}

function ConversionLabel({ x = 0, y = 0, width = 0, height = 0, value }: CustomLabelProps) {
  if (value === undefined || value === 0) return null
  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dominantBaseline="middle"
      fill="#94A3B8"
      fontSize={11}
    >
      {value.toFixed(1)}% conv.
    </text>
  )
}

export default function FunnelChart({ steps }: Props) {
  if (steps.length === 0) return null

  const data = steps.map(s => ({
    name:            s.step_name,
    count:           s.count,
    conversion_rate: s.conversion_rate,
  }))

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <p className="font-semibold text-text-primary mb-4">Purchase Funnel</p>
      <ResponsiveContainer width="100%" height={steps.length * 52 + 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 100, bottom: 0, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#F8FAFC', fontWeight: 600 }}
            itemStyle={{ color: '#94A3B8' }}
            formatter={(v: number) => [v.toLocaleString(), 'Visitors']}
          />
          <Bar dataKey="count" fill="#4A90D9" radius={[0, 4, 4, 0]} barSize={28}>
            <LabelList content={<ConversionLabel />} dataKey="conversion_rate" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

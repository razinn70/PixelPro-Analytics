import FunnelChart from '@/components/FunnelChart'
import { useFunnel } from '@/hooks/useFunnel'
import type { DateRange } from '@/types'

interface Props { dateRange: DateRange }

export default function Funnels({ dateRange }: Props) {
  const { steps, loading, error } = useFunnel(dateRange)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Purchase Funnel</h1>

      {error && <p className="text-danger text-sm">{error}</p>}
      {loading && <p className="text-text-secondary">Loading…</p>}

      {!loading && steps.length > 0 && (
        <>
          <FunnelChart steps={steps} />

          {/* Step detail table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">#</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Step</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Sessions</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Step Conversion</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Drop-off</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, idx) => {
                  const cumulative = steps[0].sessions > 0
                    ? (step.sessions / steps[0].sessions) * 100
                    : 0
                  return (
                    <tr key={step.step_index} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-muted">{idx + 1}</td>
                      <td className="px-5 py-3 text-text-primary">{step.name}</td>
                      <td className="px-5 py-3 text-right text-text-primary">{step.sessions.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-success">
                        {idx === 0 ? '—' : `${step.conversion_rate.toFixed(1)}%`}
                      </td>
                      <td className="px-5 py-3 text-right text-danger">
                        {idx === 0 ? '—' : `${step.drop_off_rate.toFixed(1)}%`}
                      </td>
                      <td className="px-5 py-3 text-right text-primary font-medium">
                        {cumulative.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

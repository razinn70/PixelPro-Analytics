import { useFunnel } from '@/hooks/useFunnel'
import FunnelChart from '@/components/FunnelChart'

// The purchase funnel ID is read from env; falls back to a stable default.
const FUNNEL_ID = (import.meta.env.VITE_FUNNEL_ID as string | undefined) ?? '1'

export default function Funnels() {
  const { funnel, loading, error } = useFunnel(FUNNEL_ID)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">
        {funnel ? funnel.name : 'Purchase Funnel'}
      </h1>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-border animate-pulse h-14" />
          ))}
        </div>
      )}

      {/* Chart + table */}
      {!loading && funnel && funnel.steps.length > 0 && (
        <>
          <FunnelChart steps={funnel.steps} />

          {/* Step detail table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">#</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Step Name</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Visitors</th>
                  <th className="text-right px-5 py-3 text-text-secondary font-medium">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {funnel.steps.map(step => (
                  <tr
                    key={step.step_number}
                    className="border-b border-border last:border-0 hover:bg-dark/40 transition-colors"
                  >
                    <td className="px-5 py-3 text-muted">{step.step_number}</td>
                    <td className="px-5 py-3 text-text-primary">{step.step_name}</td>
                    <td className="px-5 py-3 text-right text-text-primary">
                      {step.count.toLocaleString('en-CA')}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {step.step_number === 1 ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <span className="text-success font-medium">
                          {step.conversion_rate.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && funnel && funnel.steps.length === 0 && (
        <p className="text-text-secondary text-sm">No funnel steps found.</p>
      )}
    </div>
  )
}

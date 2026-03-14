import type { FunnelStep } from '@/types'

interface Props {
  steps: FunnelStep[]
}

export default function FunnelChart({ steps }: Props) {
  if (steps.length === 0) return null
  const maxSessions = steps[0]?.sessions ?? 1

  return (
    <div className="bg-surface rounded-xl p-5 border border-border">
      <p className="font-semibold text-text-primary mb-4">Purchase Funnel</p>
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const barPct = (step.sessions / maxSessions) * 100
          return (
            <div key={step.step_index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">{step.name}</span>
                <span className="text-text-primary font-medium">{step.sessions.toLocaleString()}</span>
              </div>
              <div className="h-7 bg-dark rounded overflow-hidden relative">
                <div
                  className="h-full bg-primary rounded transition-all"
                  style={{ width: `${barPct}%` }}
                />
                {idx > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                    {step.conversion_rate.toFixed(1)}% from prev
                  </span>
                )}
              </div>
              {idx > 0 && (
                <p className="text-xs text-danger mt-0.5">
                  ↓ {step.drop_off_rate.toFixed(1)}% drop-off
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

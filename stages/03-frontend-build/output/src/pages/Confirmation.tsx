import { useLocation, Link } from 'react-router-dom'
import { content } from '@/data/content'

interface LocationState {
  orderId?: string
  total?:   number
}

export default function Confirmation() {
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">{content.confirmation.headline}</h1>
      <p className="text-text-secondary text-lg mb-2">{content.confirmation.subhead}</p>

      {state.orderId && (
        <p className="text-sm text-muted mb-8">Order ID: {state.orderId}</p>
      )}
      {state.total !== undefined && (
        <p className="text-2xl font-bold text-primary mb-10">
          Total paid: ${state.total.toFixed(2)} CAD
        </p>
      )}

      <ul className="text-left bg-surface rounded-xl p-6 border border-border mb-10 space-y-3">
        {content.confirmation.nextSteps.map(step => (
          <li key={step} className="flex gap-3 text-text-secondary">
            <span className="text-success font-bold mt-0.5">✓</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <Link
        to={content.confirmation.cta.href}
        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        {content.confirmation.cta.label}
      </Link>
    </div>
  )
}

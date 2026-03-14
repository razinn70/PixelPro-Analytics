import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { trackPurchase } from '@/lib/analytics'
import { postOrder } from '@/lib/api'
import { getSessionId } from '@/lib/analytics'
import { content } from '@/data/content'

interface CheckoutForm {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  company:   string
}

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, itemCount, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '', lastName: '', email: '', phone: '', company: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const order = await postOrder({
        client_id:  CLIENT_ID,
        session_id: getSessionId(),
        items: items.map(i => ({
          item_id:  i.product.id,
          name:     i.product.name,
          price:    i.product.price,
          quantity: i.quantity,
        })),
        subtotal: total,
      })

      trackPurchase({
        transaction_id: order.id,
        revenue:        total,
        item_count:     itemCount,
      })

      clearCart()
      navigate('/confirmation', { state: { orderId: order.id, total } })
    } catch {
      setError('Something went wrong. Please try again or contact support@pixelpro.ca')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{content.checkout.headline}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">{content.checkout.sections.shipping}</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['firstName', 'lastName'] as const).map(field => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm text-text-secondary mb-1">
                  {content.checkout.fields[field]}
                </label>
                <input
                  id={field} name={field} type="text" required
                  value={form[field]} onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {(['email', 'phone', 'company'] as const).map(field => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm text-text-secondary mb-1">
                  {content.checkout.fields[field]}
                </label>
                <input
                  id={field} name={field}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  required={field !== 'company'}
                  value={form[field]} onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-surface rounded-xl p-5 border border-border">
          <p className="font-semibold mb-3">Order Summary</p>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm text-text-secondary py-1">
              <span>{product.name} × {quantity}</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-primary mt-3 pt-3 border-t border-border">
            <span>Total</span>
            <span>${total.toFixed(2)} CAD</span>
          </div>
        </div>

        <p className="text-xs text-text-secondary">{content.checkout.pipedaNotice}</p>

        {error && (
          <p role="alert" className="text-danger text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          {submitting ? 'Processing…' : content.checkout.submitCta}
        </button>
      </form>
    </div>
  )
}

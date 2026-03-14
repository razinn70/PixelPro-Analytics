import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { trackRemoveFromCart, trackBeginCheckout } from '@/lib/analytics'
import { content } from '@/data/content'

export default function Cart() {
  const { items, removeItem, total, itemCount } = useCart()
  const navigate = useNavigate()

  function handleRemove(productId: string, name: string, price: number) {
    removeItem(productId)
    trackRemoveFromCart({ item_id: productId, item_name: name, price })
  }

  function handleCheckout() {
    trackBeginCheckout({ cart_value: total, item_count: itemCount })
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">{content.cart.headline}</h1>
        <p className="text-text-secondary mb-8">{content.cart.emptyMessage}</p>
        <Link
          to={content.cart.emptyCtaHref}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {content.cart.emptyCtaLabel}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{content.cart.headline}</h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-surface rounded-xl p-5 border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-dark rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              📊
            </div>
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-text-secondary text-sm">
                ${product.price.toFixed(2)} × {quantity}
              </p>
            </div>
            <p className="font-bold text-primary">
              ${(product.price * quantity).toFixed(2)}
            </p>
            <button
              onClick={() => handleRemove(product.id, product.name, product.price)}
              className="text-muted hover:text-danger transition-colors ml-2"
              aria-label={`Remove ${product.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <span className="text-text-secondary">{content.cart.subtotalLabel}</span>
          <span className="text-2xl font-bold text-primary">
            ${total.toFixed(2)} CAD
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          {content.cart.checkoutCta}
        </button>
      </div>
    </div>
  )
}

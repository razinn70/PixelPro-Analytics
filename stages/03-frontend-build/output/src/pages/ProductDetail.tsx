import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProducts, fetchProduct } from '@/lib/api'
import { trackViewItem, trackAddToCart } from '@/lib/analytics'
import { useCart } from '@/hooks/useCart'
import { content } from '@/data/content'
import type { Product } from '@/types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct]   = useState<Product | null>(null)
  const [related, setRelated]   = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading]   = useState(true)
  const [added, setAdded]       = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([fetchProduct(id), fetchProducts()])
      .then(([p, all]) => {
        setProduct(p)
        setRelated(all.filter(a => a.id !== id && a.category === p.category).slice(0, 3))
        trackViewItem({ item_id: p.id, item_name: p.name, price: p.price, category: p.category ?? undefined })
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  function handleAddToCart() {
    if (!product) return
    addItem(product, quantity)
    trackAddToCart({ item_id: product.id, item_name: product.name, price: product.price, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-text-secondary">Loading…</div>
  }
  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image placeholder */}
        <div className="bg-surface rounded-2xl aspect-square flex items-center justify-center border border-border">
          <span className="text-6xl">📊</span>
        </div>

        {/* Product info */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-text-secondary mb-6 text-lg leading-relaxed">
              {product.description}
            </p>
          )}
          <p className="text-4xl font-bold text-primary mb-8">
            ${product.price.toFixed(2)} <span className="text-xl font-normal text-muted">CAD</span>
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="qty" className="text-text-secondary text-sm">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-primary"
                aria-label="Decrease quantity"
              >−</button>
              <span id="qty" className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-primary"
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.active || product.inventory_count === 0}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {!product.active || product.inventory_count === 0
              ? content.product.outOfStock
              : added ? '✓ Added to Cart' : content.product.addToCart}
          </button>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{content.product.relatedHeadline}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(p => (
              <a key={p.id} href={`/shop/${p.id}`} className="bg-surface rounded-xl p-5 border border-border hover:border-primary transition-colors">
                <p className="text-sm font-semibold mb-1">{p.name}</p>
                <p className="text-primary font-bold">${p.price.toFixed(2)}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

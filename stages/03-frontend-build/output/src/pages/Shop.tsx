import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '@/lib/api'
import { trackViewItem } from '@/lib/analytics'
import { content } from '@/data/content'
import type { Product } from '@/types'

export default function Shop() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('All')
  const [priceRange, setPriceRange] = useState(0) // index into content.shop.filters.priceRanges

  useEffect(() => {
    setLoading(true)
    const filter = content.shop.filters.priceRanges[priceRange]
    fetchProducts({
      category:  category === 'All' ? undefined : category,
      minPrice:  filter.min,
      maxPrice:  filter.max === Infinity ? undefined : filter.max,
    })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, priceRange])

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{content.shop.headline}</h1>
        <p className="text-text-secondary">{content.shop.subhead}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="flex gap-2">
          {content.shop.filters.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'border border-border text-text-secondary hover:border-primary'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={priceRange}
          onChange={e => setPriceRange(Number(e.target.value))}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-secondary"
          aria-label="Filter by price range"
        >
          {content.shop.filters.priceRanges.map((range, i) => (
            <option key={range.label} value={i}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-text-secondary">Loading services…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">No services match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/shop/${product.id}`}
              onClick={() => trackViewItem({
                item_id:   product.id,
                item_name: product.name,
                price:     product.price,
                category:  product.category ?? undefined,
              })}
              className="bg-surface rounded-xl p-6 border border-border hover:border-primary transition-colors flex flex-col"
            >
              <p className="text-xs text-muted uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h2 className="text-lg font-semibold mb-3 flex-1 leading-snug">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              <p className="text-primary font-bold text-xl">
                ${product.price.toFixed(2)} CAD
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

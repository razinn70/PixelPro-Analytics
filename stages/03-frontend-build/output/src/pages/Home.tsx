import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '@/lib/api'
import { trackViewItem } from '@/lib/analytics'
import { content } from '@/data/content'
import type { Product } from '@/types'

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then(all => setFeatured(all.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {content.home.hero.headline}
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            {content.home.hero.subhead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={content.home.hero.cta.href}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {content.home.hero.cta.label}
            </Link>
            <Link
              to={content.home.hero.secondary.href}
              className="border border-border hover:border-primary text-text-secondary hover:text-text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {content.home.hero.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.home.valueProps.map(vp => (
              <div key={vp.title} className="text-center p-6">
                <div className="text-4xl mb-4">{vp.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{vp.title}</h3>
                <p className="text-text-secondary">{vp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {content.home.featuredHeadline}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(product => (
                <Link
                  key={product.id}
                  to={`/shop/${product.id}`}
                  onClick={() => trackViewItem({
                    item_id:   product.id,
                    item_name: product.name,
                    price:     product.price,
                    category:  product.category ?? undefined,
                  })}
                  className="bg-surface rounded-xl p-6 border border-border hover:border-primary transition-colors"
                >
                  <p className="text-xs text-muted uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-semibold mb-3 leading-snug">{product.name}</h3>
                  <p className="text-primary font-bold text-lg">
                    ${product.price.toFixed(2)} CAD
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/shop"
                className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            {content.home.socialProof.headline}
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {content.home.socialProof.stats.map(stat => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

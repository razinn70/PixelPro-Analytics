import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'
import { content } from '@/data/content'

export default function Layout() {
  const location = useLocation()

  // Fire page view on every route change (SPA tracking)
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-dark text-text-primary">
      <nav className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            {content.brand.name}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {content.nav.links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            to={content.nav.cta.href}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {content.nav.cta.label}
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-primary text-lg mb-2">{content.brand.name}</p>
              <p className="text-text-secondary text-sm">{content.footer.tagline}</p>
            </div>
            <div>
              <p className="font-semibold mb-3">Links</p>
              <ul className="space-y-2">
                {content.footer.links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-text-secondary hover:text-text-primary text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Contact</p>
              <p className="text-text-secondary text-sm">{content.footer.contact.email}</p>
              <p className="text-text-secondary text-sm">{content.footer.contact.location}</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-text-secondary text-sm">
            {content.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  )
}

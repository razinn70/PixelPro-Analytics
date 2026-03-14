import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/',        label: 'Overview' },
  { to: '/funnels', label: 'Funnels'  },
  { to: '/cohorts', label: 'Cohorts'  },
  { to: '/reports', label: 'Reports'  },
]

const PAGE_TITLES: Record<string, string> = {
  '/':        'Overview',
  '/funnels': 'Funnels',
  '/cohorts': 'Cohorts',
  '/reports': 'Reports',
}

function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function DashboardLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard'
  const today     = formatDateDisplay(new Date())

  return (
    <div className="min-h-screen bg-dark text-text-primary flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-60 bg-surface border-r border-border flex flex-col transition-transform duration-200',
          'md:relative md:translate-x-0 md:flex',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border flex-shrink-0">
          <p className="text-text-primary font-bold text-xl tracking-tight">
            <span className="text-primary">Pixel</span>Pro
          </p>
          <p className="text-text-secondary text-xs mt-0.5">Analytics Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Client info */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0">
          <p className="text-xs text-text-secondary font-medium">PixelPro Analytics</p>
          <p className="text-xs text-muted mt-0.5">pixelpro-analytics</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <p className="text-text-primary font-semibold">{pageTitle}</p>
          </div>
          <span className="text-text-secondary text-sm hidden sm:inline">{today}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

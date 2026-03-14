import { Outlet, NavLink } from 'react-router-dom'
import DateRangePicker from '@/components/DateRangePicker'
import type { DateRange } from '@/types'

interface Props {
  dateRange:          DateRange
  onDateRangeChange:  (range: DateRange) => void
}

const NAV = [
  { to: '/overview', label: 'Overview' },
  { to: '/funnels',  label: 'Funnels'  },
  { to: '/cohorts',  label: 'Cohorts'  },
  { to: '/reports',  label: 'Reports'  },
]

export default function DashboardLayout({ dateRange, onDateRangeChange }: Props) {
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-border flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <p className="text-text-primary font-bold text-lg">PixelPro</p>
          <p className="text-text-secondary text-xs mt-0.5">Analytics Dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-muted">PixelPro Analytics</p>
          <p className="text-xs text-muted">pixelpro-analytics</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <p className="text-text-primary font-semibold">Analytics Dashboard</p>
          <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

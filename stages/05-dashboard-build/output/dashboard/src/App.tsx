import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { format, subDays } from 'date-fns'
import DashboardLayout from '@/components/DashboardLayout'
import Overview from '@/pages/Overview'
import Funnels from '@/pages/Funnels'
import Cohorts from '@/pages/Cohorts'
import Reports from '@/pages/Reports'
import type { DateRange } from '@/types'

export default function App() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
    to:   format(new Date(), 'yyyy-MM-dd'),
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout dateRange={dateRange} onDateRangeChange={setDateRange} />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview"  element={<Overview  dateRange={dateRange} />} />
          <Route path="funnels"   element={<Funnels   dateRange={dateRange} />} />
          <Route path="cohorts"   element={<Cohorts   dateRange={dateRange} />} />
          <Route path="reports"   element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

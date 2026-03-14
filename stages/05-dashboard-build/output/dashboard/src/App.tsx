import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/DashboardLayout'
import Overview from '@/pages/Overview'
import Funnels from '@/pages/Funnels'
import Cohorts from '@/pages/Cohorts'
import Reports from '@/pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index        element={<Overview />} />
          <Route path="funnels" element={<Funnels />}  />
          <Route path="cohorts" element={<Cohorts />}  />
          <Route path="reports" element={<Reports />}  />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

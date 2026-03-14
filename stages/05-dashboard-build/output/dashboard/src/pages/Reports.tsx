import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { fetchReports, generateReport } from '@/lib/api'
import type { Report } from '@/types'
import { useEffect } from 'react'

export default function Reports() {
  const [reports, setReports]     = useState<Report[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  async function loadReports() {
    setLoading(true)
    try {
      const data = await fetchReports()
      setReports(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadReports() }, [])

  async function handleGenerate(type: 'weekly' | 'monthly') {
    setGenerating(true)
    try {
      await generateReport(type)
      await loadReports()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  const statusBadge = (status: Report['status']) => {
    const map = {
      ready:      'bg-success/20 text-success',
      generating: 'bg-warning/20 text-warning',
      failed:     'bg-danger/20 text-danger',
    } as const
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status]}`}>{status}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleGenerate('weekly')}
            disabled={generating}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {generating ? 'Generating…' : 'Generate Weekly'}
          </button>
          <button
            onClick={() => handleGenerate('monthly')}
            disabled={generating}
            className="bg-surface border border-border hover:border-primary text-text-secondary hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Generate Monthly
          </button>
        </div>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      {loading
        ? <p className="text-text-secondary">Loading…</p>
        : reports.length === 0
          ? <p className="text-text-secondary">No reports yet. Generate your first report above.</p>
          : (
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-text-secondary font-medium">Type</th>
                    <th className="text-left px-5 py-3 text-text-secondary font-medium">Period</th>
                    <th className="text-left px-5 py-3 text-text-secondary font-medium">Generated</th>
                    <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
                    <th className="text-left px-5 py-3 text-text-secondary font-medium">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-text-primary capitalize">{r.report_type}</td>
                      <td className="px-5 py-3 text-text-secondary">
                        {format(parseISO(r.period_start), 'MMM d')} – {format(parseISO(r.period_end), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {format(parseISO(r.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-3">{statusBadge(r.status)}</td>
                      <td className="px-5 py-3">
                        {r.file_url && r.status === 'ready'
                          ? <a href={r.file_url} className="text-primary hover:underline text-xs">Download PDF</a>
                          : <span className="text-muted text-xs">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      }
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { fetchReports, generateReport } from '@/lib/api'
import type { Report } from '@/types'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string

type StatusBadgeProps = { status: Report['status'] }

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<Report['status'], string> = {
    pending:    'bg-muted/20 text-muted',
    generating: 'bg-warning/20 text-warning',
    complete:   'bg-success/20 text-success',
    failed:     'bg-danger/20 text-danger',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function Reports() {
  const [reports,    setReports]    = useState<Report[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReports(CLIENT_ID)
      setReports(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      await generateReport(CLIENT_ID)
      // Give the backend a moment to register the new report, then refetch.
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadReports()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="
            bg-primary hover:bg-primary-hover disabled:opacity-50
            text-white text-sm font-medium
            px-4 py-2 rounded-lg transition-colors
          "
        >
          {generating ? 'Generating…' : 'Generate Weekly Report'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border animate-pulse h-12" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && reports.length === 0 && !error && (
        <p className="text-text-secondary text-sm">
          No reports yet. Click "Generate Weekly Report" above to create your first report.
        </p>
      )}

      {/* Reports table */}
      {!loading && reports.length > 0 && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Report ID</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Created</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-dark/30 transition-colors"
                >
                  <td className="px-5 py-3 text-text-secondary font-mono text-xs">
                    {r.id.slice(0, 8)}…
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {format(parseISO(r.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3">
                    {r.status === 'complete' && r.report_url ? (
                      <a
                        href={r.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs font-medium"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

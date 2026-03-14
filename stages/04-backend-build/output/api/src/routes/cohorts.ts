import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { authenticate, authorizeClient } from '@/middleware/auth'
import type { AuthenticatedRequest } from '@/types'

const router = Router()

const querySchema = z.object({
  client_id: z.string().uuid(),
  weeks:     z.coerce.number().min(1).max(12).default(8),
})

// GET /api/v1/cohorts?client_id=&weeks=
router.get('/', authenticate, authorizeClient, async (req: AuthenticatedRequest, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'client_id required', request_id: req.requestId } })
    return
  }

  const { client_id, weeks } = parsed.data

  // Fetch cohort retention data from daily_metrics
  // dimension field stores cohort_week and retention_week when populated by cohort_analysis.py
  const { data, error } = await supabaseAdmin
    .from('daily_metrics')
    .select('*')
    .eq('client_id', client_id)
    .eq('metric_name', 'cohort_retention')
    .order('date', { ascending: false })
    .limit(weeks * weeks)

  if (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch cohort data', request_id: req.requestId } })
    return
  }

  const rowsByCohort = new Map<string, Record<string, number | string>>()

  for (const row of data ?? []) {
    const cohortWeek = row.dimension?.cohort_week as string | undefined
    const retentionWeek = row.dimension?.retention_week as number | undefined

    if (!cohortWeek || retentionWeek === undefined || retentionWeek < 0 || retentionWeek >= weeks) {
      continue
    }

    const existing = rowsByCohort.get(cohortWeek) ?? { cohort_week: cohortWeek }
    existing[`week_${retentionWeek}`] = Number(row.metric_value)
    rowsByCohort.set(cohortWeek, existing)
  }

  const normalized = Array.from(rowsByCohort.values())
    .map(row => {
      const completeRow: Record<string, number | string> = { cohort_week: row.cohort_week }
      for (let i = 0; i < weeks; i += 1) {
        completeRow[`week_${i}`] = Number(row[`week_${i}`] ?? 0)
      }
      return completeRow
    })
    .sort((a, b) => String(a.cohort_week).localeCompare(String(b.cohort_week)))

  res.json({ data: normalized, meta: { request_id: req.requestId, timestamp: new Date().toISOString() } })
})

export default router

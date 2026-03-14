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

  res.json({ data, meta: { request_id: req.requestId, timestamp: new Date().toISOString() } })
})

export default router

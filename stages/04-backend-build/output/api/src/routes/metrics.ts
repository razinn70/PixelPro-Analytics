import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { authenticate, authorizeClient } from '@/middleware/auth'
import type { AuthenticatedRequest } from '@/types'

const router = Router()

const querySchema = z.object({
  client_id: z.string().uuid(),
  from:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

// GET /api/v1/metrics?client_id=&from=&to=
router.get('/', authenticate, authorizeClient, async (req: AuthenticatedRequest, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'client_id, from, and to are required (YYYY-MM-DD)', request_id: req.requestId } })
    return
  }

  const { client_id, from, to } = parsed.data

  const { data, error } = await supabaseAdmin
    .from('daily_metrics')
    .select('*')
    .eq('client_id', client_id)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true })

  if (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch metrics', request_id: req.requestId } })
    return
  }

  const normalized = (data ?? []).map(row => ({
    client_id: row.client_id,
    date: row.date,
    metric_name: row.metric_name,
    value: Number(row.metric_value),
  }))

  res.json({ data: normalized, meta: { request_id: req.requestId, timestamp: new Date().toISOString() } })
})

export default router

import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { authenticate } from '@/middleware/auth'
import type { AuthenticatedRequest } from '@/types'

const router = Router()

const querySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

// GET /api/v1/funnels/:id
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid date format', request_id: req.requestId } })
    return
  }

  const { id } = req.params
  const { from, to } = parsed.data

  // Fetch funnel definition
  const { data: funnel, error: funnelErr } = await supabaseAdmin
    .from('funnels').select('*').eq('id', id).single()

  if (funnelErr || !funnel) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Funnel not found', request_id: req.requestId } })
    return
  }

  // Fetch step counts
  let query = supabaseAdmin
    .from('funnel_events')
    .select('step_index')
    .eq('funnel_id', id)

  if (from) query = query.gte('completed_at', `${from}T00:00:00Z`)
  if (to)   query = query.lte('completed_at', `${to}T23:59:59Z`)

  const { data: events, error: eventsErr } = await query

  if (eventsErr) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch funnel events', request_id: req.requestId } })
    return
  }

  const stepCounts: Record<number, number> = {}
  for (const e of events ?? []) {
    stepCounts[e.step_index] = (stepCounts[e.step_index] ?? 0) + 1
  }

  const steps = (funnel.steps as Array<{ index: number; name: string; event: string }>).map(step => ({
    step_number: step.index + 1,
    step_name: step.name,
    count: stepCounts[step.index] ?? 0,
    conversion_rate: step.index === 0
      ? 100
      : stepCounts[0] ? Math.round((stepCounts[step.index] ?? 0) / stepCounts[0] * 100) : 0,
  }))

  res.json({
    data: {
      id: funnel.id,
      name: funnel.name,
      client_id: funnel.client_id,
      steps,
    },
    meta: { request_id: req.requestId, timestamp: new Date().toISOString() },
  })
})

export default router

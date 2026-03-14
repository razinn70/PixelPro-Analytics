import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { authenticate, authorizeClient } from '@/middleware/auth'
import { reportLimiter } from '@/middleware/rateLimit'
import type { AuthenticatedRequest } from '@/types'

const router = Router()

function normalizeReport(report: {
  id: string
  client_id: string
  generated_at: string
  data?: { status?: string; pdf_path?: string }
}) {
  return {
    id: report.id,
    client_id: report.client_id,
    status: report.data?.status === 'generated' ? 'complete' : (report.data?.status ?? 'pending'),
    report_url: report.data?.pdf_path,
    created_at: report.generated_at,
  }
}

// GET /api/v1/reports?client_id=&type=
router.get('/', authenticate, authorizeClient, async (req: AuthenticatedRequest, res) => {
  const clientId   = req.query.client_id as string
  const reportType = req.query.type as string | undefined

  let query = supabaseAdmin.from('reports').select('*').eq('client_id', clientId)
  if (reportType) query = query.eq('report_type', reportType)

  const { data, error } = await query.order('generated_at', { ascending: false }).limit(50)

  if (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch reports', request_id: req.requestId } })
    return
  }

  res.json({
    data: (data ?? []).map(normalizeReport),
    meta: { request_id: req.requestId, timestamp: new Date().toISOString() },
  })
})

const generateSchema = z.object({
  client_id:   z.string().uuid(),
  report_type: z.enum(['weekly', 'monthly']).default('weekly'),
  week_end:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

// POST /api/v1/reports/generate
router.post('/generate', authenticate, authorizeClient, reportLimiter, async (req: AuthenticatedRequest, res) => {
  const parsed = generateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid input', request_id: req.requestId } })
    return
  }

  // In production, enqueue a background job to generate the PDF report.
  // For now, create a placeholder report record.
  const { client_id, report_type } = parsed.data
  const today = new Date().toISOString().split('T')[0]!
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]!

  const { data, error } = await supabaseAdmin.from('reports').insert({
    client_id,
    report_type,
    period_start: weekAgo,
    period_end:   today,
    data:         { status: 'generating', queued_at: new Date().toISOString() },
  }).select().single()

  if (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to queue report', request_id: req.requestId } })
    return
  }

  res.status(202).json({
    data: normalizeReport(data),
    meta: { request_id: req.requestId, timestamp: new Date().toISOString() },
  })
})

export default router

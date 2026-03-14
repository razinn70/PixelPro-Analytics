import { Router } from 'express'
import { z } from 'zod'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { eventIngestLimiter } from '@/middleware/rateLimit'
import type { AuthenticatedRequest } from '@/types'

const router = Router()

const ingestEventSchema = z.object({
  client_id:  z.string().uuid(),
  session_id: z.string().min(1).max(100),
  event_name: z.string().min(1).max(100),
  event_data: z.record(z.unknown()).optional().default({}),
  page_url:   z.string().url(),
  referrer:   z.string().optional(),
})

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'pixelpro-default-salt'
  return crypto.createHmac('sha256', salt).update(ip).digest('hex')
}

// POST /api/v1/events — public endpoint, rate limited
router.post('/', eventIngestLimiter, async (req: AuthenticatedRequest, res) => {
  const parsed = ingestEventSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Invalid input', request_id: req.requestId },
    })
    return
  }

  const { client_id, session_id, event_name, event_data, page_url, referrer } = parsed.data
  const rawIp   = req.ip ?? req.socket.remoteAddress ?? ''
  const ip_hash = hashIp(rawIp)

  const { error } = await supabaseAdmin.from('events').insert({
    client_id, session_id, event_name, event_data, page_url, referrer, ip_hash,
    user_agent: req.headers['user-agent'],
  })

  if (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to store event', request_id: req.requestId } })
    return
  }

  res.status(201).json({ data: { ok: true }, meta: { request_id: req.requestId, timestamp: new Date().toISOString() } })
})

export default router

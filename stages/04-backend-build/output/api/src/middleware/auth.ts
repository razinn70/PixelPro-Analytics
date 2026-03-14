import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '@/types'
import { supabaseAdmin } from '@/lib/supabase'

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing authorization token', request_id: req.requestId },
    })
    return
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token', request_id: req.requestId },
    })
    return
  }

  req.user = user
  next()
}

export async function authorizeClient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const clientId = (req.query.client_id ?? req.body?.client_id ?? req.params.client_id) as string | undefined

  if (!clientId) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'client_id is required', request_id: req.requestId },
    })
    return
  }

  const { data } = await supabaseAdmin
    .from('client_users')
    .select('client_id')
    .eq('user_id', req.user.id)
    .eq('client_id', clientId)
    .single()

  if (!data) {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Not authorized for this client', request_id: req.requestId },
    })
    return
  }

  next()
}

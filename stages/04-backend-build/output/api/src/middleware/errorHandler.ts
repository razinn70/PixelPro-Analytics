import type { Request, Response, NextFunction } from 'express'
import { logger } from './logging'

export function errorHandler(
  err: Error,
  req: Request & { requestId?: string },
  res: Response,
  _next: NextFunction
): void {
  // Log full error server-side — never expose to client
  logger.error('unhandled_error', {
    request_id: req.requestId,
    message:    err.message,
    stack:      err.stack,
  })

  res.status(500).json({
    error: {
      code:       'INTERNAL_ERROR',
      message:    'An unexpected error occurred',
      request_id: req.requestId ?? 'unknown',
    },
  })
}

import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import winston from 'winston'

export const logger = winston.createLogger({
  level:  process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
})

// Attach request ID and log incoming requests
// NEVER logs Authorization header, email, phone, or IP
export function requestLogger(req: Request & { requestId?: string }, res: Response, next: NextFunction): void {
  const requestId = uuidv4()
  req.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  logger.info('request', {
    request_id: requestId,
    method:     req.method,
    path:       req.path,
    // Omit: authorization, body (may contain PII), ip
  })

  res.on('finish', () => {
    logger.info('response', {
      request_id: requestId,
      method:     req.method,
      path:       req.path,
      status:     res.statusCode,
    })
  })

  next()
}

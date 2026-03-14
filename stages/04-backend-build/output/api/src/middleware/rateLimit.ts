import rateLimit from 'express-rate-limit'

// Public event ingestion — 100 requests per IP per minute
export const eventIngestLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again shortly.' } },
})

// Authenticated API endpoints — 300 per user per minute
export const apiLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             300,
  keyGenerator:    (req) => (req as { user?: { id?: string } }).user?.id ?? req.ip ?? 'unknown',
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again shortly.' } },
})

// Report generation — 10 per user per hour (expensive operation)
export const reportLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             10,
  keyGenerator:    (req) => (req as { user?: { id?: string } }).user?.id ?? req.ip ?? 'unknown',
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: { code: 'RATE_LIMITED', message: 'Report generation limit reached. Try again in 1 hour.' } },
})

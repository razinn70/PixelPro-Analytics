# Rate Limiting

## Express Rate Limit Configuration

```ts
// services/api/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

// Public event ingestion (unauthenticated)
export const eventIngestLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 100,               // 100 events per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } }
})

// Authenticated API endpoints
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 300,               // 300 requests per user per minute
  keyGenerator: (req) => req.user?.id ?? req.ip,  // rate limit per user, not IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } }
})

// Report generation (expensive operation)
export const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 report generates per hour
  keyGenerator: (req) => req.user?.id ?? req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Report generation limit reached' } }
})
```

## Apply to Routes

```ts
// services/api/src/server.ts
app.post('/api/v1/events', eventIngestLimiter, eventController.ingest)
app.use('/api/v1', apiLimiter, authenticate, router)
app.post('/api/v1/reports/generate', reportLimiter, reportController.generate)
```

## Headers Returned

On limit hit (`429 Too Many Requests`):
```
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1709500000
Retry-After: 45
```

## Testing Rate Limits

```bash
# Test event ingestion limit (run 101 times quickly)
for i in {1..101}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/v1/events \
    -H "Content-Type: application/json" \
    -d '{"client_id":"uuid","session_id":"test","event_name":"test","page_url":"http://test.com"}'
done
# Last few should return 429
```

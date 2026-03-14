import express from 'express'
import helmet  from 'helmet'
import cors    from 'cors'
import { requestLogger } from './middleware/logging'
import { apiLimiter }    from './middleware/rateLimit'
import { authenticate }  from './middleware/auth'
import { errorHandler }  from './middleware/errorHandler'
import router            from './routes'

const app  = express()
const PORT = process.env.PORT ?? 3000

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',')

app.use(helmet())
app.use(cors({ origin: allowedOrigins, credentials: false }))
app.use(express.json({ limit: '256kb' }))
app.use(requestLogger)

// Health check — unauthenticated, not rate limited
app.get('/health', (_req, res) => res.json({ ok: true }))

// Event ingestion — public, rate limit applied inside events router
// All other /api/v1 routes require auth + api rate limit
app.use('/api/v1', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/events') return next()
  apiLimiter(req, res, next)
})

app.use('/api/v1', router)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`PixelPro API running on port ${PORT}`)
})

export default app

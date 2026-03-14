# API Conventions

## Base URL
`/api/v1`

## Endpoint Patterns

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/metrics?client_id=&from=&to=` | Fetch KPI metrics |
| GET | `/api/v1/funnels/:id?from=&to=` | Fetch funnel data |
| POST | `/api/v1/events` | Ingest custom event |
| GET | `/api/v1/reports?client_id=&type=&period=` | Fetch report |
| POST | `/api/v1/reports/generate` | Trigger report generation |
| GET | `/api/v1/cohorts?client_id=&from=&to=` | Fetch cohort data |

## Request Format
```json
POST /api/v1/events
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "client_id": "uuid",
  "session_id": "string",
  "event_name": "string",
  "event_data": {},
  "page_url": "string",
  "referrer": "string"
}
```

## Response Format
```json
// Success
{
  "data": { ... },
  "meta": { "request_id": "string", "timestamp": "ISO8601" }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "client_id is required",
    "request_id": "string"
  }
}
```

## HTTP Status Codes
- `200` OK
- `201` Created
- `400` Bad Request (validation error)
- `401` Unauthorized (missing/invalid JWT)
- `403` Forbidden (valid JWT but wrong client)
- `404` Not Found
- `429` Too Many Requests
- `500` Internal Server Error (never expose stack traces)

## Error Codes
| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Missing or invalid request parameter |
| `UNAUTHORIZED` | Missing or expired JWT |
| `FORBIDDEN` | Authenticated but not authorized for this resource |
| `NOT_FOUND` | Resource does not exist |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error (log full error server-side, return generic message) |

## Middleware Stack (Express)
```ts
app.use(helmet())           // Security headers
app.use(cors(corsOptions))  // Strict origin allowlist
app.use(rateLimiter)        // Rate limiting (see rate-limiting.md)
app.use(requestLogger)      // Structured logging with request ID
app.use(authenticate)       // JWT validation
app.use('/api/v1', router)  // Routes
app.use(errorHandler)       // Global error handler
```

## Authentication
All endpoints require `Authorization: Bearer <jwt>` except:
- `POST /api/v1/events` — public event ingestion (rate limited, no auth required for frontend tracking)
- Health check `GET /health`

## Validation
Use Zod for request validation:
```ts
const ingestEventSchema = z.object({
  client_id: z.string().uuid(),
  session_id: z.string().min(1).max(100),
  event_name: z.string().min(1).max(100),
  event_data: z.record(z.unknown()).optional().default({}),
  page_url: z.string().url(),
  referrer: z.string().optional(),
})
```

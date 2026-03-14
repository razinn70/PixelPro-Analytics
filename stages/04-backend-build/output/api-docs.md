# PixelPro Analytics — API Documentation

Base URL: `https://api.pixelpro.ca`
All authenticated endpoints require `Authorization: Bearer <supabase_jwt>`.

---

## Health

### GET /health
No auth required.

**Response:**
```json
{ "ok": true }
```

---

## Events

### POST /api/v1/events
Public endpoint. Rate limited: 100 req/IP/min.

**Request body:**
```json
{
  "client_id":  "uuid",
  "session_id": "string (max 100 chars)",
  "event_name": "string (max 100 chars)",
  "event_data": { "key": "value" },
  "page_url":   "https://...",
  "referrer":   "https://... (optional)"
}
```

**Success (201):**
```json
{ "data": { "ok": true }, "meta": { "request_id": "...", "timestamp": "ISO8601" } }
```

**Errors:** 400 VALIDATION_ERROR, 429 RATE_LIMITED, 500 INTERNAL_ERROR

---

## Metrics

### GET /api/v1/metrics
Auth required. Returns daily_metrics rows for date range.

**Query params:**
- `client_id` (UUID, required)
- `from` (YYYY-MM-DD, required)
- `to` (YYYY-MM-DD, required)

**Success (200):**
```json
{
  "data": [
    { "id": 1, "client_id": "uuid", "date": "2026-03-14", "metric_name": "sessions", "metric_value": 42, "dimension": {} }
  ],
  "meta": { "request_id": "...", "timestamp": "ISO8601" }
}
```

**Errors:** 400 VALIDATION_ERROR, 401 UNAUTHORIZED, 403 FORBIDDEN, 500 INTERNAL_ERROR

---

## Funnels

### GET /api/v1/funnels/:id
Auth required. Returns funnel definition + step counts for date range.

**Query params:**
- `from` (YYYY-MM-DD, optional)
- `to` (YYYY-MM-DD, optional)

**Success (200):**
```json
{
  "data": {
    "funnel": { "id": "uuid", "name": "Purchase Funnel", "steps": [...] },
    "steps": [
      { "index": 0, "name": "Product Listing View", "count": 100, "conversion_rate": 100 },
      { "index": 1, "name": "Product Detail View",  "count": 72,  "conversion_rate": 72 },
      { "index": 2, "name": "Add to Cart",          "count": 45,  "conversion_rate": 45 },
      { "index": 3, "name": "Checkout Initiated",   "count": 30,  "conversion_rate": 30 },
      { "index": 4, "name": "Order Confirmed",      "count": 22,  "conversion_rate": 22 }
    ]
  },
  "meta": { "request_id": "...", "timestamp": "ISO8601" }
}
```

**Errors:** 401 UNAUTHORIZED, 404 NOT_FOUND, 500 INTERNAL_ERROR

---

## Reports

### GET /api/v1/reports
Auth required.

**Query params:**
- `client_id` (UUID, required)
- `type` (weekly | monthly, optional)

**Success (200):** Array of report records.

---

### POST /api/v1/reports/generate
Auth required. Rate limited: 10 req/user/hr.

**Request body:**
```json
{
  "client_id":   "uuid",
  "report_type": "weekly",
  "week_end":    "2026-03-14 (optional)"
}
```

**Success (202):** Report record with status "generating".

**Errors:** 400, 401, 403, 429, 500

---

## Cohorts

### GET /api/v1/cohorts
Auth required. Returns cohort retention data from daily_metrics.

**Query params:**
- `client_id` (UUID, required)
- `weeks` (number 1–12, default 8)

**Success (200):** Array of daily_metrics rows with metric_name='cohort_retention'.

---

## Error Response Format

```json
{
  "error": {
    "code":       "VALIDATION_ERROR",
    "message":    "client_id is required",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error codes:**
| Code | HTTP | Meaning |
|------|------|---------|
| VALIDATION_ERROR | 400 | Missing or invalid request parameters |
| UNAUTHORIZED | 401 | Missing or expired JWT |
| FORBIDDEN | 403 | Valid JWT, not authorized for this client |
| NOT_FOUND | 404 | Resource does not exist |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error (details logged server-side only) |

---

## Example cURL

```bash
# Ingest an event (no auth)
curl -X POST https://api.pixelpro.ca/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"client_id":"00000000-0000-0000-0000-000000000001","session_id":"test-sess","event_name":"page_view","page_url":"https://pixelpro-analytics.vercel.app/shop"}'

# Fetch metrics (requires JWT)
curl "https://api.pixelpro.ca/api/v1/metrics?client_id=00000000-0000-0000-0000-000000000001&from=2026-03-01&to=2026-03-14" \
  -H "Authorization: Bearer $SUPABASE_JWT"
```

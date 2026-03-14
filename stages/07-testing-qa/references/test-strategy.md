# Test Strategy

## Testing Pyramid

```
          E2E Tests
        (critical flows)
       Integration Tests
      (API + database)
     Unit Tests (broad coverage)
```

## Unit Tests

Tool: Vitest (React) + Jest (Node.js) + Pytest (Python)

### What to Unit Test
- React components: renders, prop variations, event handlers
- API handler logic (business logic, not Express wiring)
- ETL functions: aggregation math, data transformations
- Utility functions: formatters, validators, calculators

### Coverage Target
80%+ line coverage on:
- `services/api/src/` (API handlers, middleware, utilities)
- `services/etl/pipelines/` (ETL business logic)
- `packages/ui/src/components/` (shared components)

Do NOT chase 100% coverage on boilerplate, config files, or index barrels.

### React Component Tests
```tsx
// Example: KPICard component test
import { render, screen } from '@testing-library/react'
import { KPICard } from '@pixelpro/ui'

test('shows positive trend with green color', () => {
  render(<KPICard label="Revenue" value="$1,234" change={5.2} trend="up" />)
  expect(screen.getByText('$1,234')).toBeInTheDocument()
  expect(screen.getByText('+5.2%')).toHaveClass('text-green-500')
})
```

### API Handler Tests
```ts
// Example: event ingestion handler test
describe('POST /api/v1/events', () => {
  it('rejects invalid client_id', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .send({ client_id: 'not-a-uuid', session_id: 'test', event_name: 'test', page_url: 'http://test.com' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})
```

## Integration Tests

Tool: Supertest (Node.js) + real Supabase test database

### What to Integration Test
- Full API request → database → response cycle
- RLS policy enforcement (cross-client isolation)
- ETL pipeline → database state
- Auth middleware with real JWTs

### Test Database
Use a separate Supabase project for testing. Never run integration tests against production.
Set `SUPABASE_URL_TEST` and `SUPABASE_SERVICE_KEY_TEST` in CI environment.

## E2E Tests

Tool: Playwright

### Critical Flows to Test

#### Restaurant
1. Visit homepage → view menu → click "Order Now" → verify funnel event fired
2. Submit contact form → verify success message → verify form event in DB

#### E-Commerce
1. Browse products → add to cart → begin checkout → complete order → verify on confirmation page
2. Add to cart → abandon → verify cart abandonment event fired

#### Service Business
1. Visit homepage → view services → submit quote form → verify lead created in DB
2. Click phone number on mobile viewport → verify phone click event

### E2E Test Setup
```bash
npx playwright install chromium firefox webkit
npx playwright test  # runs against staging URL
```

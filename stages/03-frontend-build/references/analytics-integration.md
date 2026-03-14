# Analytics Integration Guide

## Setup

In `src/lib/analytics.ts`:

```ts
import { tracker } from '@pixelpro/analytics'

export const analytics = tracker({
  clientId: import.meta.env.VITE_CLIENT_ID,
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  apiEndpoint: import.meta.env.VITE_API_URL + '/events',
})
```

## useAnalytics Hook

```tsx
import { useAnalytics } from '@pixelpro/ui'

function ProductCard({ product }) {
  const { track } = useAnalytics()

  return (
    <button onClick={() => {
      track('add_to_cart', {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        category: product.category,
      })
    }}>
      Add to Cart
    </button>
  )
}
```

## Page View Tracking (SPA)

Add `usePageView()` in the root layout component:

```tsx
import { usePageView } from '@pixelpro/ui'
import { useLocation } from 'react-router-dom'

export function Layout({ children }) {
  usePageView()  // fires on every route change
  return <>{children}</>
}
```

## Funnel Step Tracking

Track each funnel step when the user reaches the corresponding page or action:

```tsx
import { useFunnelStep } from '@pixelpro/analytics'

function CheckoutPage() {
  const trackStep = useFunnelStep(FUNNEL_ID, 3)  // step index 3 = checkout

  useEffect(() => {
    trackStep()  // fires once on mount
  }, [])
}
```

## Standard Events Per Vertical

### Restaurant
```ts
track('menu_item_view', { item_name, category, price })
track('order_started', { source_page })
track('order_completed', { order_value, item_count })
track('reservation_submitted', { party_size })
track('contact_form_submitted', {})
```

### E-Commerce
```ts
track('view_item', { item_id, item_name, price, category })
track('add_to_cart', { item_id, item_name, price, quantity })
track('begin_checkout', { cart_value, item_count })
track('purchase', { transaction_id, revenue, items })
```

### Service
```ts
track('service_page_view', { service_name })
track('quote_form_started', {})
track('quote_form_submitted', { service_type, lead_source })
track('phone_click', { device_type })
track('appointment_booked', { service_type })
```

## Verification

1. Open GA4 → DebugView
2. Set `gtag('config', 'G-XXXXX', { debug_mode: true })`
3. Navigate site + trigger events
4. Verify each event appears in DebugView within 30 seconds
5. Check custom events table via Supabase dashboard

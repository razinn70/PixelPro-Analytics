# Analytics Setup Guide

## 1. Google Analytics 4 Setup

### Create GA4 Property
1. Go to analytics.google.com
2. Admin → Create Property
3. Enter property name: `[Client Name] - Production`
4. Select timezone: America/Toronto
5. Select currency: CAD
6. Complete setup → note the Measurement ID (G-XXXXXXXXXX)

### Configure Data Streams
1. Data Streams → Add Stream → Web
2. Enter client's website URL
3. Enable Enhanced Measurement (all toggles ON)
4. Copy the gtag snippet — will be embedded in React app

### GA4 Tag Implementation (React)
```tsx
// In index.html or via react-helmet
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    send_page_view: false  // manual page view tracking for SPA
  });
</script>
```

### SPA Page View Tracking
Fire `page_view` on React Router route changes via the `useAnalytics` hook.

## 2. Custom Event Layer

All custom events are sent to both GA4 and the PixelPro custom events table.

### Event Naming Convention
- Snake_case, past tense: `item_added`, `order_completed`
- Include client vertical prefix for vertical-specific events
- Max 40 characters

### Event Data Requirements
All events must include:
- `client_id` (UUID from clients table)
- `session_id` (generated per session, stored in sessionStorage)
- `event_name`
- `page_url` (current URL)
- `timestamp`

Optional contextual data:
- `item_id`, `item_name`, `price`, `category` (for product events)
- `order_value`, `item_count` (for transaction events)
- `form_name`, `form_step` (for form events)

### Custom Event Endpoint
POST `/api/events`
```json
{
  "client_id": "uuid",
  "session_id": "string",
  "event_name": "string",
  "event_data": {},
  "page_url": "string",
  "referrer": "string"
}
```

## 3. Funnel Configuration

Define funnel steps in the `funnels` table during onboarding:
```json
{
  "name": "Purchase Funnel",
  "steps": [
    { "index": 0, "name": "Product View", "event": "view_item" },
    { "index": 1, "name": "Add to Cart", "event": "add_to_cart" },
    { "index": 2, "name": "Checkout Started", "event": "begin_checkout" },
    { "index": 3, "name": "Order Completed", "event": "purchase" }
  ]
}
```

## 4. Verification

Before going live:
- [ ] GA4 DebugView shows events firing
- [ ] Custom events table receiving rows via API
- [ ] Page views tracked on all route changes
- [ ] Funnel events map to correct step indices
- [ ] Session IDs persistent within session, reset on new session

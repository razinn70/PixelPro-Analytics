# Client Spec — PixelPro Analytics

## Business Profile

| Field | Value |
|-------|-------|
| Business name | PixelPro Analytics |
| Tagline | Data-driven growth for local businesses |
| Vertical | ecommerce |
| Client slug | `pixelpro-analytics` |
| Owner | Rajin Uddin |
| Owner email | muddinal@uoguelph.ca |
| GitHub | razinn70 |
| Domain (production) | `pixelpro-analytics.vercel.app` *(custom domain TBD)* |
| GA4 Measurement ID | `G-XXXXXXXXXX` *(replace before deploy)* |
| Brand primary | `#4A90D9` |
| Brand accent | `#FF6B35` |
| Dark background | `#0F172A` |
| DB provider | Supabase (PostgreSQL) |
| Deploy platform | Vercel |
| Analytics provider | Google Analytics 4 |
| Automated reporting | YES |
| Cohort analysis | YES |
| PIPEDA compliance | YES |

---

## Site Map

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 1 | Home | `/` | Hero, featured products, value props, social proof |
| 2 | Shop | `/shop` | Product grid with category + price filter, pagination |
| 3 | Product Detail | `/shop/:id` | Gallery, description, add-to-cart, related products |
| 4 | Cart | `/cart` | Cart item list, subtotal, checkout CTA |
| 5 | Checkout | `/checkout` | Shipping form, payment (placeholder), PIPEDA notice |
| 6 | Order Confirmation | `/confirmation` | Order summary, next steps |
| 7 | About | `/about` | Team, credentials, story |
| 8 | Contact | `/contact` | Quote/contact form |

---

## Features

### Core E-Commerce
- Product catalog with category and price range filters
- Product detail page with image gallery and variant selector
- Cart with add, remove, quantity update
- Checkout flow with shipping form and payment placeholder
- Order confirmation page

### Analytics
- GA4 Enhanced Measurement (page views, scroll, clicks, site search)
- Custom event layer (6 events — see Analytics Plan below)
- Conversion funnel tracking (5-step purchase funnel)
- PIPEDA-compliant cookie consent banner (GA4 suppressed until consent)

### Compliance
- Cookie consent banner (accept / decline)
- Privacy policy link in footer
- No PII stored in analytics events (emails, names, raw IPs)
- Data retention: raw events purged after 13 months

---

## Analytics Plan

### GA4 Setup
- Property name: `PixelPro Analytics — Production`
- Timezone: America/Toronto
- Currency: CAD
- Enhanced Measurement: all toggles ON
- SPA page view tracking: `usePageView()` hook fires on every React Router route change

### Custom Event Plan

| Event Name | Trigger | Key Data |
|------------|---------|----------|
| `view_item` | User clicks product card or lands on Product Detail page | `item_id`, `item_name`, `price`, `category` |
| `add_to_cart` | User clicks "Add to Cart" on Product Detail page | `item_id`, `item_name`, `price`, `quantity` |
| `begin_checkout` | User navigates from Cart to Checkout | `cart_value`, `item_count` |
| `purchase` | Checkout form submitted successfully | `transaction_id`, `revenue`, `item_count` |
| `remove_from_cart` | User removes item from Cart | `item_id`, `item_name`, `price` |
| `contact_form_submitted` | Contact form submitted | *(no PII)* |

All events sent to both GA4 (via gtag) and PixelPro custom events endpoint (`POST /api/v1/events`).

### Session ID
Generated once per browser session using `sessionStorage`. Format: `crypto.randomUUID()`. Resets on new tab/window.

---

## Conversion Funnel

**Funnel name:** Purchase Funnel
**Funnel ID:** *(assigned at DB seed time)*

| Step | Index | Name | Trigger Event |
|------|-------|------|---------------|
| 1 | 0 | Product Listing View | `page_view` on `/shop` |
| 2 | 1 | Product Detail View | `view_item` |
| 3 | 2 | Add to Cart | `add_to_cart` |
| 4 | 3 | Checkout Initiated | `begin_checkout` |
| 5 | 4 | Order Confirmed | `purchase` |

---

## KPIs

| # | KPI | Calculation | Target |
|---|-----|-------------|--------|
| 1 | Add-to-cart rate | Sessions with `add_to_cart` / total sessions | > 15% |
| 2 | Cart-to-checkout rate | Sessions with `begin_checkout` / sessions with `add_to_cart` | > 60% |
| 3 | Checkout completion rate | Sessions with `purchase` / sessions with `begin_checkout` | > 70% |
| 4 | Cart abandonment rate | 1 − checkout completion rate | < 30% |
| 5 | Average Order Value (AOV) | `AVG(event_data->>'revenue')` WHERE `event_name = 'purchase'` | > $85 CAD |
| 6 | Revenue by category | `SUM(revenue)` grouped by `event_data->>'category'` | — |
| 7 | New customer count | Sessions with `purchase` not seen in prior 30 days | > 50/month |
| 8 | 30-day returning customer rate | Sessions with `purchase` WHERE session had prior purchase ≤30d ago | > 25% |

---

## Checkpoint Sign-offs

### Checkpoint 1 — Site Map & Features
- [x] 8-page site map approved
- [x] Feature list confirmed
- [x] PIPEDA cookie consent in scope

### Checkpoint 2 — KPIs & Funnel
- [x] 8 KPIs confirmed with calculation methods
- [x] 5-step purchase funnel confirmed
- [x] 6 custom events cover all funnel steps

---

## Audit

| Check | Result |
|-------|--------|
| Vertical assigned | ✓ ecommerce |
| Funnel defined | ✓ 5 steps with entry/exit events |
| KPIs defined | ✓ 8 KPIs with SQL calculation method |
| Analytics plan | ✓ GA4 property config + 6 custom events covering all funnel steps |
| Slug unique | ✓ `pixelpro-analytics` — no conflicts in client-registry.md |

---

## Handoff to Stage 02

Stage 02 reads:
- **Features section** — to determine which vertical tables are needed (`products`, `orders`)
- **KPIs section** — to validate every KPI is computable from the schema
- **Custom event plan** — to confirm `events` table structure captures all required fields
- **Funnel definition** — to seed the `funnels` table with 5 steps

# Client Documentation — PixelPro Analytics

**Prepared for:** muddinal@uoguelph.ca
**Date:** 2026-03-14
**Support:** support@pixelpro.ca

---

## Dashboard Access

**Dashboard URL:** `https://dashboard.pixelpro.ca/pixelpro-analytics`

**Login:** You'll receive a magic link email from Supabase Auth. Click the link to sign in — no password required. The link expires in 1 hour; request a new one at any time from the login page.

**Sections:**
- **Overview** — 6 KPI cards + Revenue chart + Purchase Funnel (30-day default)
- **Funnels** — Detailed funnel breakdown with step-by-step conversion table
- **Cohorts** — Weekly retention heatmap showing 8 cohorts × 8 weeks
- **Reports** — Past reports with PDF download; generate on-demand

---

## KPI Glossary

All metrics are calculated from your store's event data. "Prior period" means the same-length window immediately before the selected date range.

### 1. Add-to-Cart Rate
**Definition:** Percentage of product detail page views that result in an "Add to Cart" action.
**Formula:** `add_to_cart events ÷ view_item events × 100`
**Why it matters:** A low add-to-cart rate (< 5%) signals that product pages aren't convincing visitors — check pricing, descriptions, and images.
**Target:** 8–15% for digital analytics products.

### 2. Cart-to-Checkout Rate
**Definition:** Percentage of sessions that reach the cart page and then proceed to the checkout page.
**Formula:** `begin_checkout events ÷ sessions with cart view × 100`
**Why it matters:** Drop-off here means cart friction — shipping costs, required account creation, or unclear CTAs.
**Target:** 60–75%.

### 3. Checkout Completion Rate
**Definition:** Percentage of checkout sessions that result in a completed order.
**Formula:** `purchase events ÷ begin_checkout events × 100`
**Why it matters:** Low completion (< 50%) often means form complexity or trust issues at payment. The PIPEDA notice on your checkout page supports trust.
**Target:** 55–70%.

### 4. Cart Abandonment Rate
**Definition:** Percentage of add-to-cart sessions that do NOT result in a purchase.
**Formula:** `100% − (purchase events ÷ add_to_cart events × 100)`
**Why it matters:** Industry average is ~70%. Anything above 80% warrants investigation — consider an email recovery sequence.
**Target:** Below 70%.

### 5. Average Order Value (AOV)
**Definition:** Average revenue per completed order.
**Formula:** `total revenue ÷ total orders`
**Why it matters:** Increasing AOV by 10% has the same revenue impact as a 10% increase in new customers — with no acquisition cost.
**Target:** $300+ CAD (your product mix starts at $149; bundles push this higher).

### 6. Revenue by Category
**Definition:** Total revenue broken down by product category (Starter, Pro, Reports, Audits, Packages).
**Why it matters:** Tells you which product lines drive growth. Use this to decide where to invest in new products or promotions.

### 7. New Customer Count
**Definition:** Number of orders from sessions with no prior purchase in the tracking period.
**Formula:** Sessions with `purchase` event, no prior `purchase` event in `daily_metrics` history.
**Why it matters:** New customer acquisition is expensive; tracking this alongside returning customer rate tells you your growth vs. retention balance.

### 8. 30-Day Returning Customer Rate
**Definition:** Percentage of customers who made a second purchase within 30 days of their first.
**Formula:** Cohort retention at Week 4 (30-day proxy) from the Cohorts heatmap.
**Why it matters:** Repeat buyers have dramatically lower acquisition cost and higher lifetime value. A 5% improvement in retention can increase revenue by 25–95% (Bain & Company).
**Target:** 15–25% for digital analytics products.

---

## Report Schedule

| Report | Schedule | Delivery |
|--------|----------|----------|
| Weekly Performance | Every Monday at 8:00 AM UTC | Email to muddinal@uoguelph.ca with PDF attachment |
| Monthly Summary | 1st of each month at 8:00 AM UTC | Email with PDF attachment |
| On-demand | Any time via Dashboard → Reports → "Generate Weekly" | Available to download within 2–5 minutes |

Reports cover the prior week (Monday–Sunday) or prior month. Each report includes:
- Executive summary (Revenue, Orders, Sessions, AOV vs prior period)
- Daily breakdown table
- Automated recommendations based on metric trends

---

## How to Read the Funnel Chart

The funnel shows your **Purchase Funnel** — 5 steps from first product view to completed order:

```
1. Product Listing View
2. Product Detail View
3. Add to Cart
4. Checkout Initiated
5. Order Confirmed
```

**Bar width** = sessions at that step relative to step 1 (100%).
**"X% from prev"** = conversion rate from the previous step (e.g., 45% of people who viewed a product added it to cart).
**"↓ Y% drop-off"** = percentage of the previous step's sessions that didn't proceed.

**What to look for:**
- The biggest drop-off step is your highest-impact optimization target.
- If drop-off at Step 2→3 (Product Detail → Add to Cart) is high, improve product page copy or pricing.
- If drop-off at Step 4→5 (Checkout → Order Confirmed) is high, simplify the checkout form.

The **Funnels page** includes a detailed table with cumulative conversion rates (what % of original visitors reached each step).

---

## How to Read the Cohort Heatmap

The heatmap shows **weekly retention** — how many customers from each acquisition week returned in subsequent weeks.

**Rows** = cohort weeks (the week a customer first purchased).
**Columns** = weeks after first purchase (Week 0 = first week, Week 4 ≈ 30 days, Week 7 ≈ 2 months).
**Cell value** = percentage of that cohort still active in that week.
**Color intensity** = darker blue = higher retention.

**Week 0 is always 100%** — those are the customers who purchased in their first week.

**What to look for:**
- **Horizontal row** — if a cohort has consistently higher retention across all weeks, investigate what was different about that acquisition period (promotion? referral? content?).
- **Vertical column** — if Week 4 retention is improving over time, your product or onboarding is getting better.
- **Cliff at Week 1** — a sharp drop from Week 0 to Week 1 suggests customers aren't finding enough value to return. Consider a follow-up email sequence.

---

## Support

| Type | Response Time |
|------|---------------|
| Email: support@pixelpro.ca | Within 24 hours |
| Dashboard questions or bugs | Within 24 hours |
| Report revisions (2 per month included) | Within 48 hours |
| Site down / critical issue | Within 4 hours |

**Included in your plan:**
- Automated weekly + monthly reports
- Dashboard access (unlimited)
- 2 report revisions per month
- 13-month data retention
- PIPEDA compliance maintained

For billing, account changes, or additional services, email support@pixelpro.ca with subject line "PixelPro — [your request]".

# Client Verticals

Three supported verticals with starter configurations.

---

## Restaurant

**Goal:** Drive online orders, reservations, foot traffic.

**Key Pages:** Home, Menu, Order Online, Reservations, About, Contact

**KPIs:**
- Online order conversion rate
- Average order value
- Table reservation rate
- Menu page engagement (time on page, scroll depth)
- Repeat visitor rate

**Funnel:** Landing → Menu View → Add to Cart → Checkout → Order Complete

**Custom Events:**
- `menu_view` — user views menu page
- `menu_item_click` — user clicks item for detail
- `add_to_cart` — item added
- `reservation_start` — reservation form opened
- `reservation_complete` — reservation submitted

---

## E-Commerce

**Goal:** Increase revenue, reduce cart abandonment, improve LTV.

**Key Pages:** Home, Category, Product, Cart, Checkout, Order Confirmation, Account

**KPIs:**
- Revenue (daily/weekly/monthly)
- Conversion rate (sessions → orders)
- Cart abandonment rate
- Average order value
- Customer lifetime value (LTV)
- Customer acquisition cost (CAC)
- Cohort retention (repeat purchase by signup week)

**Funnel:** Landing → Product View → Add to Cart → Checkout Start → Payment → Order Complete

**Custom Events:**
- `product_view`
- `add_to_cart`
- `checkout_start`
- `payment_info_entered`
- `order_complete`
- `cart_abandon` (on exit intent or session timeout)

---

## Service Business

**Goal:** Generate leads, drive consultation bookings, improve SEO.

**Key Pages:** Home, Services, About, Portfolio/Case Studies, Contact, Book Appointment

**KPIs:**
- Lead form submission rate
- Contact page conversion
- Appointment booking rate
- Time on site (engagement proxy)
- Organic search traffic

**Funnel:** Landing → Service Page → Contact/Book → Form Submit → Confirmation

**Custom Events:**
- `service_page_view`
- `contact_form_open`
- `contact_form_submit`
- `booking_start`
- `booking_complete`

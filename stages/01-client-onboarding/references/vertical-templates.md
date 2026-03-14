# Vertical Templates

Default configurations for each client vertical. Override as needed per client spec.

---

## Restaurant

### Default Pages
1. Home (hero, features, CTA)
2. Menu (categories, items, prices, dietary tags)
3. Online Ordering (link to ordering system or embedded flow)
4. Gallery (food photography)
5. About (story, team, values)
6. Location & Hours (map embed, hours table)
7. Contact (form, phone, email)

### Default Features
- Menu display with categories and filters
- Online ordering integration (link to Toast, Square, or custom)
- Google Maps embed
- Reservation/booking form (optional: integrate with OpenTable)
- Photo gallery with lazy loading
- Structured data: Restaurant schema (Google Rich Results)

### Default KPIs
1. Table/order conversion rate (visitors → order started)
2. Menu page engagement (time on page, item clicks)
3. Location page visits (intent signal)
4. Contact form submissions
5. Online order completions
6. Repeat visit rate (GA4 returning users)

### Default Funnel
1. Landing (homepage or menu)
2. Menu view (specific item or category)
3. Order initiated (click "Order Now" or add to cart)
4. Order completed (confirmation page)

### Default GA4 Events
- `menu_item_view` (item_name, category, price)
- `order_started` (source_page)
- `order_completed` (order_value, item_count)
- `reservation_submitted` (party_size, date)
- `location_page_view`
- `contact_form_submitted`

---

## E-Commerce

### Default Pages
1. Home (hero, featured products, social proof)
2. Shop / Collection (product grid with filters)
3. Product Detail (images, description, add-to-cart)
4. Cart
5. Checkout
6. Order Confirmation
7. About
8. Contact

### Default Features
- Product catalog with search and filter
- Cart and checkout flow (custom or Shopify embedded)
- Product image gallery with zoom
- Related products
- Customer reviews / ratings
- Wishlist (optional)
- Promo code field

### Default KPIs
1. Add-to-cart rate (PDPs → cart)
2. Cart-to-checkout rate
3. Checkout completion rate
4. Cart abandonment rate
5. Average order value
6. Revenue by product category
7. Customer acquisition cost (CAC)
8. 30-day repeat purchase rate (LTV signal)

### Default Funnel
1. Product listing view
2. Product detail view
3. Add to cart
4. Checkout initiated
5. Payment submitted
6. Order confirmed

### Default GA4 Events
- `view_item` (item_id, item_name, price, category)
- `add_to_cart` (item_id, item_name, price, quantity)
- `begin_checkout` (cart_value, item_count)
- `purchase` (transaction_id, revenue, items)
- `remove_from_cart` (item_id, item_name)
- `view_cart`

---

## Service Business

### Default Pages
1. Home (hero, value prop, social proof)
2. Services (list with descriptions and pricing tiers)
3. Service Detail (individual service page)
4. About (team, credentials, story)
5. Contact / Quote Request
6. Blog (optional, for SEO)
7. FAQ

### Default Features
- Service listing with pricing
- Quote request / contact form
- Appointment booking (Calendly embed or custom)
- Testimonials section
- Service area map or description
- Credentials / certifications display

### Default KPIs
1. Contact form submission rate
2. Quote request conversion rate
3. Phone click rate (mobile)
4. Service page depth (how many services viewed per session)
5. Returning visitor rate
6. Lead source breakdown (organic, direct, referral)

### Default Funnel
1. Landing (homepage or service page)
2. Services page view
3. Contact / Quote page view
4. Form submitted

### Default GA4 Events
- `service_page_view` (service_name)
- `quote_form_started`
- `quote_form_submitted` (service_type, lead_source)
- `phone_click` (device_type)
- `appointment_booked` (service_type)
- `faq_expanded` (question_text)

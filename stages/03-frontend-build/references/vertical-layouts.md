# Vertical Layouts

Page structure templates per vertical. Override sections as needed.

## Restaurant Layout

### Home Page
```
<Hero>
  Background: full-bleed food photo
  Headline: restaurant name + tagline
  CTA: "Order Now" (primary) | "View Menu" (secondary)
</Hero>
<FeaturedSection>
  3 signature dishes with photo, name, price
</FeaturedSection>
<SocialProof>
  Google reviews badge + 3 customer testimonials
</SocialProof>
<LocationCTA>
  Address, hours, embedded Google Map
  CTA: "Get Directions"
</LocationCTA>
<Footer />
```

### Menu Page
```
<CategoryNav> (sticky, scrolls to section)
<MenuCategory v-for category>
  <MenuItemCard v-for item> (photo, name, description, price, dietary tags)
</MenuCategory>
<OrderCTA> (floating or bottom-fixed "Order Now" button)
```

## E-Commerce Layout

### Home Page
```
<Hero>
  Background: product lifestyle photo
  Headline + value prop
  CTA: "Shop Now" → /shop
</Hero>
<FeaturedProducts>
  4-6 product cards (image, name, price, add-to-cart)
</FeaturedProducts>
<ValueProps>
  3 icons: Free Shipping / Easy Returns / Secure Checkout
</ValueProps>
<SocialProof>
  Reviews count + average rating + 3 testimonials
</SocialProof>
<Newsletter>
  Email capture for promotions
</Newsletter>
```

### Product Listing Page
```
<FilterBar> (category, price range, sort)
<ProductGrid>
  <ProductCard v-for product> (image, name, price, quick-add)
</ProductGrid>
<Pagination />
```

### Product Detail Page
```
<ProductGallery> (main image + thumbnails, zoom on hover)
<ProductInfo>
  Name, price, description
  Variant selector (size/color if applicable)
  Quantity picker
  "Add to Cart" button (primary, full-width on mobile)
  "Add to Wishlist" (secondary)
</ProductInfo>
<ProductMeta>
  SKU, category, tags
  Shipping estimate
</ProductMeta>
<RelatedProducts> (4 cards)
```

## Service Business Layout

### Home Page
```
<Hero>
  Headline: primary value proposition
  Subhead: who you serve + location
  CTA: "Get a Free Quote" → /contact
  Secondary: "View Services" → /services
</Hero>
<Services>
  3 service cards: icon, name, 1-line description
  CTA: "Learn More" on each
</Services>
<SocialProof>
  Client logos or testimonials
  Credentials/certifications badges
</SocialProof>
<Process>
  3-step "How It Works" section
</Process>
<CTA>
  "Ready to get started?" → contact form
</CTA>
```

### Contact / Quote Page
```
<QuoteForm>
  Name (text)
  Email (email)
  Phone (tel)
  Service type (select)
  Project description (textarea)
  Preferred contact time (select)
  Submit button
</QuoteForm>
<ContactInfo>
  Phone, email, address
  Map embed (if physical location)
  Business hours
</ContactInfo>
```

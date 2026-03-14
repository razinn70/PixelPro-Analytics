// PixelPro Analytics — All copy lives here. Never hardcode strings in JSX.

export const content = {
  brand: {
    name: 'PixelPro Analytics',
    tagline: 'Data-driven growth for local businesses',
  },

  nav: {
    links: [
      { label: 'Shop',    href: '/shop' },
      { label: 'About',   href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: { label: 'View Cart', href: '/cart' },
  },

  home: {
    hero: {
      headline: 'Analytics solutions built for local businesses',
      subhead:  'Stop guessing. Start growing. Enterprise-grade analytics at SMB pricing.',
      cta:      { label: 'Browse Services', href: '/shop' },
      secondary: { label: 'Learn More', href: '/about' },
    },
    featuredHeadline: 'Our most popular services',
    valueProps: [
      {
        icon: '📊',
        title: 'Real Data, Real Decisions',
        description: 'Track every customer touchpoint from first click to final sale.',
      },
      {
        icon: '⚡',
        title: 'Up and Running Fast',
        description: 'Full setup in under a week. No long agency contracts.',
      },
      {
        icon: '🔒',
        title: 'Privacy-First',
        description: 'PIPEDA-compliant. Your customers\' data is protected.',
      },
    ],
    socialProof: {
      headline: 'Trusted by Guelph/GTA businesses',
      stats: [
        { value: '35%', label: 'avg. revenue increase' },
        { value: '22%', label: 'cart abandonment reduction' },
        { value: '< 1 week', label: 'time to launch' },
      ],
    },
    newsletter: {
      headline: 'Get monthly analytics tips',
      subhead: 'Free insights for local business owners.',
      placeholder: 'your@email.com',
      cta: 'Subscribe',
    },
  },

  shop: {
    headline: 'Analytics Services',
    subhead:  'Choose the package that fits your business.',
    filters: {
      categories: ['All', 'services', 'subscriptions'],
      priceRanges: [
        { label: 'All prices', min: 0, max: Infinity },
        { label: 'Under $200',  min: 0,   max: 200 },
        { label: '$200–$500',   min: 200, max: 500 },
        { label: 'Over $500',   min: 500, max: Infinity },
      ],
    },
  },

  product: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    relatedHeadline: 'You might also like',
  },

  cart: {
    headline: 'Your Cart',
    emptyMessage: 'Your cart is empty.',
    emptyCtaLabel: 'Browse Services',
    emptyCtaHref: '/shop',
    checkoutCta: 'Proceed to Checkout',
    subtotalLabel: 'Subtotal',
  },

  checkout: {
    headline: 'Checkout',
    sections: {
      shipping: 'Contact Information',
      payment:  'Payment Details',
    },
    fields: {
      firstName: 'First Name',
      lastName:  'Last Name',
      email:     'Email Address',
      phone:     'Phone Number',
      company:   'Company Name (optional)',
      cardNumber: 'Card Number',
      expiry:     'Expiry (MM/YY)',
      cvv:        'CVV',
    },
    pipedaNotice: 'Your information is used only to process this transaction and is never sold to third parties. See our Privacy Policy.',
    submitCta: 'Place Order',
  },

  confirmation: {
    headline: '🎉 Order Confirmed!',
    subhead:  'Thanks for your purchase. You\'ll receive a confirmation email shortly.',
    nextSteps: [
      'Check your inbox for a confirmation email.',
      'Our team will reach out within 1 business day to schedule onboarding.',
      'Questions? Email support@pixelpro.ca',
    ],
    cta: { label: 'Back to Shop', href: '/shop' },
  },

  about: {
    headline: 'Built for local business owners',
    subhead:  'PixelPro Analytics was founded to give Guelph/GTA businesses the same data insights that enterprise companies use — without the enterprise price tag.',
    owner: {
      name:  'Rajin Uddin',
      title: 'Founder & Lead Developer',
      bio:   'Full-stack developer with a focus on analytics and conversion optimization. Based in Guelph, Ontario.',
    },
    values: [
      { title: 'Transparency', description: 'You own your data. We help you read it.' },
      { title: 'Speed',        description: 'Fully operational in under a week.' },
      { title: 'Privacy',      description: 'PIPEDA compliant by default.' },
    ],
  },

  contact: {
    headline: 'Let\'s talk about your business',
    subhead:  'Tell us about your goals and we\'ll put together a custom analytics plan.',
    fields: {
      name:        'Your Name',
      email:       'Email Address',
      phone:       'Phone (optional)',
      serviceType: 'What are you interested in?',
      message:     'Tell us about your business and goals',
    },
    serviceOptions: [
      'Analytics Setup',
      'Dashboard Build',
      'Monthly Reporting',
      'Funnel Audit',
      'Full Package',
      'Other',
    ],
    submitCta:      'Send Message',
    successMessage: 'Thanks! We\'ll be in touch within 1 business day.',
  },

  footer: {
    tagline: 'Data-driven growth for local businesses.',
    links: [
      { label: 'Shop',          href: '/shop' },
      { label: 'About',         href: '/about' },
      { label: 'Contact',       href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    contact: {
      email: 'support@pixelpro.ca',
      location: 'Guelph, Ontario, Canada',
    },
    copyright: `© ${new Date().getFullYear()} PixelPro Analytics. All rights reserved.`,
  },

  cookieConsent: {
    message: 'We use analytics cookies to understand how visitors use our site and improve your experience. Your data is never sold.',
    accept:  'Accept',
    decline: 'Decline',
    learnMore: { label: 'Privacy Policy', href: '/privacy' },
  },
}

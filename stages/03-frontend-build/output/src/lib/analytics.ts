// PixelPro Analytics — Custom Event Tracker
// Sends events to both GA4 (via gtag) and the PixelPro custom events API.
// GA4 is suppressed until cookie consent is granted (PIPEDA compliance).

import type { AnalyticsEvent } from '@/types'

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string
const GA4_ID    = import.meta.env.VITE_GA4_MEASUREMENT_ID as string
const API_URL   = import.meta.env.VITE_API_URL as string

// ─── Session ID ─────────────────────────────────────────────────────────────

export function getSessionId(): string {
  const key = 'pp_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

// ─── Consent ────────────────────────────────────────────────────────────────

export function hasConsent(): boolean {
  return localStorage.getItem('pp_cookie_consent') === 'accepted'
}

export function setConsent(accepted: boolean): void {
  localStorage.setItem('pp_cookie_consent', accepted ? 'accepted' : 'declined')
  if (accepted && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    })
  }
}

// ─── Core dispatcher ────────────────────────────────────────────────────────

async function dispatch(eventName: string, eventData: Record<string, unknown> = {}): Promise<void> {
  const sessionId = getSessionId()
  const payload: AnalyticsEvent = {
    client_id:  CLIENT_ID,
    session_id: sessionId,
    event_name: eventName,
    event_data: eventData,
    page_url:   window.location.href,
    referrer:   document.referrer || undefined,
  }

  // 1. Send to PixelPro custom events API (always — no PII, no consent required)
  fetch(`${API_URL}/api/v1/events`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  }).catch(() => {
    // Silently fail — analytics must never break the user experience
  })

  // 2. Send to GA4 only if consent granted
  if (hasConsent() && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData)
  }
}

// ─── Page view (SPA) ────────────────────────────────────────────────────────

export function trackPageView(path: string): void {
  dispatch('page_view', { page_path: path })
  if (hasConsent() && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title:    document.title,
      page_location: window.location.href,
      page_path:     path,
    })
  }
}

// ─── E-Commerce Events ───────────────────────────────────────────────────────

export function trackViewItem(item: {
  item_id:   string
  item_name: string
  price:     number
  category?: string
}): void {
  dispatch('view_item', item)
}

export function trackAddToCart(item: {
  item_id:   string
  item_name: string
  price:     number
  quantity:  number
}): void {
  dispatch('add_to_cart', item)
}

export function trackRemoveFromCart(item: {
  item_id:   string
  item_name: string
  price:     number
}): void {
  dispatch('remove_from_cart', item)
}

export function trackBeginCheckout(cart: {
  cart_value: number
  item_count: number
}): void {
  dispatch('begin_checkout', cart)
}

export function trackPurchase(order: {
  transaction_id: string
  revenue:        number
  item_count:     number
}): void {
  dispatch('purchase', order)
}

export function trackContactFormSubmitted(): void {
  dispatch('contact_form_submitted', {})
}

// ─── Window type augmentation ────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

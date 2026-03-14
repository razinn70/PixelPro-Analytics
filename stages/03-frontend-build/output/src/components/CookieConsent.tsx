// PIPEDA-compliant cookie consent banner.
// GA4 tracking is suppressed until the user explicitly accepts.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { setConsent } from '@/lib/analytics'
import { content } from '@/data/content'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('pp_cookie_consent')
    if (!stored) setVisible(true)
  }, [])

  function handleAccept() {
    setConsent(true)
    setVisible(false)
  }

  function handleDecline() {
    setConsent(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-text-secondary text-sm flex-1">
          {content.cookieConsent.message}{' '}
          <Link to={content.cookieConsent.learnMore.href} className="text-primary underline">
            {content.cookieConsent.learnMore.label}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {content.cookieConsent.decline}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            {content.cookieConsent.accept}
          </button>
        </div>
      </div>
    </div>
  )
}

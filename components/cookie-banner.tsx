'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-lg"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Accept
          </button>
          <button
            onClick={declineCookies}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

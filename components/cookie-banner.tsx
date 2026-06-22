// components/cookie-banner.tsx
'use client'

import { useState, useEffect } from 'react'

interface CookiePrefs {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: 0
  })

  useEffect(() => {
    // Check if consent already given (valid for 6 months)
    const saved = localStorage.getItem('wb_cookie_consent_v2')
    if (saved) {
      const parsed = JSON.parse(saved)
      const sixMonths = 180 * 24 * 60 * 60 * 1000
      if (Date.now() - parsed.timestamp < sixMonths) {
        applyPreferences(parsed)
        return
      }
    }
    // Show after 1.5s delay for better UX
    const timer = setTimeout(() => setShowBanner(true), 1500)
    return () => clearTimeout(timer)
  }, [])

    const applyPreferences = (p: CookiePrefs) => {
    // Initialize GA if analytics accepted
    if (p.analytics && typeof (window as any).gtag !== 'undefined') {
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: p.marketing ? 'granted' : 'denied'
      })
    }
  }

  const handleAccept = (type: 'all' | 'essential' | 'custom') => {
    const newPrefs: CookiePrefs = {
      essential: true,
      analytics: type === 'all' || (type === 'custom' && prefs.analytics),
      marketing: type === 'all' || (type === 'custom' && prefs.marketing),
      timestamp: Date.now()
    }

    localStorage.setItem('wb_cookie_consent_v2', JSON.stringify(newPrefs))
    applyPreferences(newPrefs)
    setShowBanner(false)
    
    // Track consent event
    if (typeof (window as any).gtag !== 'undefined') {
      ;(window as any).gtag('event', 'cookie_consent', {
        event_label: type
      })
    }
  }

  const reopenConsent = () => {
    setShowBanner(true)
    setShowDetails(true)
  }

  // Make reopen function globally available
  useEffect(() => {
    ;(window as any).reopenCookieConsent = reopenConsent
  }, [])

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
        onClick={() => handleAccept('essential')}
      />
      
      {/* Side Popup - Bottom Right */}
      <div 
        className="fixed bottom-4 right-4 z-[9999] w-[380px] max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl border overflow-hidden"
        style={{ 
          backgroundColor: 'var(--surface, #ffffff)', 
          borderColor: 'var(--border, #e5e5e5)',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div 
          className="p-4 text-white"
          style={{ 
            background: 'linear-gradient(135deg, #FF9900 0%, #ff8c00 100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
              🍪
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">We value your privacy</h3>
              <p className="text-xs text-white/90">wholesalebaazar.in</p>
            </div>
            <button 
              onClick={() => handleAccept('essential')}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {!showDetails ? (
            // Simple View
            <div className="space-y-4">
              <p className="text-sm" style={{ color: 'var(--text-secondary, #666)' }}>
                We use cookies to remember your cart, login, and improve your experience. 
                By continuing, you agree to our{' '}
                <button 
                  onClick={() => (window as any).openPolicy?.('privacy')}
                  className="underline font-medium hover:text-orange-600"
                  style={{ color: 'var(--primary, #FF9900)' }}
                >
                  Privacy Policy
                </button>.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept('essential')}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition hover:opacity-80"
                  style={{ 
                    borderColor: 'var(--border, #ddd)', 
                    color: 'var(--text-primary, #111)' 
                  }}
                >
                  Essential Only
                </button>
                <button
                  onClick={() => handleAccept('all')}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary, #FF9900)' }}
                >
                  Accept All ✓
                </button>
              </div>
              <button
                onClick={() => setShowDetails(true)}
                className="w-full text-center text-xs underline"
                style={{ color: 'var(--text-secondary, #666)' }}
              >
                Manage Preferences
              </button>
            </div>
          ) : (
            // Detailed View
            <div className="space-y-3">
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary, #666)' }}>
                Choose which cookies you allow. Essential cookies are required for the site to function.
              </p>

              {/* Essential (Locked) */}
              <div 
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ 
                  backgroundColor: 'rgba(255, 153, 0, 0.1)', 
                  borderColor: 'rgba(255, 153, 0, 0.3)' 
                }}
              >
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary, #111)' }}>
                    ✅ Essential
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary, #666)' }}>
                    Cart, login, security — required
                  </div>
                </div>
                <div 
                  className="w-10 h-5 rounded-full relative opacity-60"
                  style={{ backgroundColor: 'var(--primary, #FF9900)' }}
                >
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>

              {/* Analytics Toggle */}
              <div 
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:opacity-80 transition"
                style={{ 
                  backgroundColor: 'var(--surface, #f7f7f7)', 
                  borderColor: 'var(--border, #e5e5e5)' 
                }}
                onClick={() => setPrefs(p => ({...p, analytics: !p.analytics}))}
              >
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary, #111)' }}>
                    📊 Analytics
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary, #666)' }}>
                    Google Analytics — helps us improve
                  </div>
                </div>
                <div 
                  className={`w-10 h-5 rounded-full relative transition-colors ${prefs.analytics ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div 
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.analytics ? 'right-1' : 'left-1'}`} 
                  />
                </div>
              </div>

              {/* Marketing Toggle */}
              <div 
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:opacity-80 transition"
                style={{ 
                  backgroundColor: 'var(--surface, #f7f7f7)', 
                  borderColor: 'var(--border, #e5e5e5)' 
                }}
                onClick={() => setPrefs(p => ({...p, marketing: !p.marketing}))}
              >
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary, #111)' }}>
                    🎯 Marketing
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary, #666)' }}>
                    Personalized offers & promotions
                  </div>
                </div>
                <div 
                  className={`w-10 h-5 rounded-full relative transition-colors ${prefs.marketing ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div 
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.marketing ? 'right-1' : 'left-1'}`} 
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-2 text-sm transition hover:opacity-80"
                  style={{ color: 'var(--text-secondary, #666)' }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => handleAccept('custom')}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary, #FF9900)' }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

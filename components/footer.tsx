// components/footer.tsx
export default function Footer() {
  return (
    <footer 
      className="border-t py-8 mt-16"
      style={{ borderColor: 'var(--border, #e5e5e5)', backgroundColor: 'var(--surface, #f7f7f7)' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <p className="text-sm" style={{ color: 'var(--muted, #666)' }}>
            © 2026 Wholesale Baazar. All rights reserved.
          </p>
          
          {/* Links */}
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <button 
              onClick={() => (window as any).openPolicy?.('privacy')}
              className="text-sm hover:underline transition"
              style={{ color: 'var(--muted, #666)' }}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => (window as any).openPolicy?.('terms')}
              className="text-sm hover:underline transition"
              style={{ color: 'var(--muted, #666)' }}
            >
              Terms of Service
            </button>
            
            {/* COOKIE SETTINGS BUTTON */}
            <button 
              onClick={() => (window as any).reopenCookieConsent?.()}
              className="text-sm hover:underline transition flex items-center gap-1"
              style={{ color: 'var(--muted, #666)' }}
            >
              🍪 Cookie Settings
            </button>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

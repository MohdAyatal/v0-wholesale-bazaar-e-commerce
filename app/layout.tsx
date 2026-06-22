// app/layout.tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import CookieBanner from '@/components/cookie-banner'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wholesale Baazar - Premium Fashion Marketplace',
  description: 'Discover premium Mens Womens and Kids wear, Home decor & accessories from verified suppliers all over India.',
}

// Add this for TypeScript
declare global {
  interface Window {
    reopenCookieConsent?: () => void
    openPolicy?: (key: string) => void
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          <CookieBanner />
        </CartProvider>
      </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

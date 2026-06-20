'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Link from 'next/link'
import { CheckCircle, Package, Phone } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const order = params.get('order')

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} style={{ color: '#059669' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Order Placed! 🎉
        </h1>
        <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
          Thank you for shopping with Wholesale Baazar
        </p>
        {order && (
          <div className="my-6 px-6 py-4 rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Your Order Number</p>
            <p className="text-xl font-bold tracking-wider" style={{ color: 'var(--primary)' }}>{order}</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Save this for tracking</p>
          </div>
        )}

        <div className="space-y-3 mb-8 text-left rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="flex items-center gap-3">
            <Package size={20} style={{ color: 'var(--primary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Expected delivery in <strong>3–5 business days</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} style={{ color: 'var(--primary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>We'll call you on your phone to confirm</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <button className="px-8 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}>
              Continue Shopping
            </button>
          </Link>
          <Link href="/orders">
            <button className="px-8 py-3 rounded-xl font-semibold border transition hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              View My Orders
            </button>
          </Link>
        </div>

        <div className="mt-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/918840130533" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
            +91 88401 30533
          </a>
        </div>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}

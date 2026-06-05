'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { ShoppingBag, Lock, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [name,    setName]    = useState(user?.user_metadata?.full_name || '')
  const [email,   setEmail]   = useState(user?.email || '')
  const [phone,   setPhone]   = useState('')
  const [address, setAddress] = useState('')
  const [city,    setCity]    = useState('')
  const [pin,     setPin]     = useState('')
  const [payment, setPayment] = useState<'cod' | 'online'>('cod')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const shipping = totalPrice > 999 ? 0 : 99
  const gst      = Math.round(totalPrice * 0.05)
  const grandTotal = totalPrice + shipping + gst

  const validate = () => {
    if (!name.trim())    { setError('Please enter your name'); return false }
    if (!email.trim())   { setError('Please enter your email'); return false }
    if (!phone.trim())   { setError('Please enter your phone'); return false }
    if (!address.trim()) { setError('Please enter your address'); return false }
    if (!city.trim())    { setError('Please enter your city'); return false }
    if (!/^\d{6}$/.test(pin)) { setError('Please enter a valid 6-digit pincode'); return false }
    return true
  }

  const handleCOD = async () => {
    if (!validate()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: `${address}, ${city} - ${pin}`,
          items: items.map(i => ({
            product_id: i.id,
            product_name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal: totalPrice,
          shipping_fee: shipping,
          tax: gst,
          total_amount: grandTotal,
          payment_method: 'cod',
          payment_status: 'pending',
          user_id: user?.id || null,
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      const { order_number } = await res.json()
      clearCart()
      router.push(`/orders/success?order=${order_number}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpay = async () => {
    if (!validate()) return
    setLoading(true)
    setError('')

    try {
      // 1. Create Razorpay order on server
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      })
      if (!res.ok) throw new Error('Could not initiate payment')
      const { id: razorpay_order_id } = await res.json()

      // 2. Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Razorpay script failed to load'))
          document.body.appendChild(script)
        })
      }

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'Wholesale Baazar',
        description: `Order for ${items.length} item${items.length > 1 ? 's' : ''}`,
        order_id: razorpay_order_id,
        prefill: { name, email, contact: phone },
        theme: { color: '#0F766E' },
        handler: async (response: any) => {
          // 4. Save order after payment success
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name: name,
              customer_email: email,
              customer_phone: phone,
              shipping_address: `${address}, ${city} - ${pin}`,
              items: items.map(i => ({
                product_id: i.id,
                product_name: i.name,
                quantity: i.quantity,
                price: i.price,
              })),
              subtotal: totalPrice,
              shipping_fee: shipping,
              tax: gst,
              total_amount: grandTotal,
              payment_method: 'razorpay',
              payment_status: 'paid',
              razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              user_id: user?.id || null,
            }),
          })
          const { order_number } = await orderRes.json()
          clearCart()
          router.push(`/orders/success?order=${order_number}`)
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled.')
          }
        }
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Payment failed. Try COD instead.')
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <ShoppingBag size={64} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h2>
          <Link href="/products">
            <button className="mt-4 px-8 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: 'var(--primary)' }}>
              Browse Products
            </button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery details */}
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Truck size={20} style={{ color: 'var(--primary)' }} />
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', value: name, set: setName, type: 'text', placeholder: 'Rahul Sharma' },
                  { label: 'Email *', value: email, set: setEmail, type: 'email', placeholder: 'rahul@email.com' },
                  { label: 'Phone *', value: phone, set: setPhone, type: 'tel', placeholder: '+91 9876543210' },
                  { label: 'City *', value: city, set: setCity, type: 'text', placeholder: 'Mumbai' },
                ].map(({ label, value, set, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => { set(e.target.value); setError('') }}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setError('') }}
                    placeholder="House/Flat No, Street, Area"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Pincode *</label>
                  <input
                    type="tel"
                    maxLength={6}
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="400001"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', sub: 'Pay when you receive' },
                  { value: 'online', label: '💳 Pay Online', sub: 'UPI, Cards via Razorpay' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPayment(opt.value as 'cod' | 'online')}
                    className="p-4 rounded-xl border-2 text-left transition"
                    style={{
                      borderColor: payment === opt.value ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: payment === opt.value ? '#E0F2F0' : 'white',
                    }}
                  >
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{opt.sub}</p>
                  </button>
                ))}
              </div>

              {payment === 'online' && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                  <Lock size={14} />
                  Secured by Razorpay — 100% safe & encrypted
                </div>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:sticky lg:top-24 h-fit rounded-2xl border p-6"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>

            <div className="space-y-3 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-primary)' }} className="line-clamp-1 flex-1 mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
              {[
                ['Subtotal', `₹${totalPrice.toLocaleString('en-IN')}`],
                ['Shipping', shipping === 0 ? 'Free 🎉' : `₹${shipping}`],
                ['GST (5%)', `₹${gst.toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {shipping === 0 && (
              <p className="text-xs text-center mb-4" style={{ color: '#059669' }}>
                🎉 You saved ₹99 on shipping!
              </p>
            )}

            <button
              onClick={payment === 'cod' ? handleCOD : handleRazorpay}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing...
                </>
              ) : payment === 'online' ? (
                <>💳 Pay ₹{grandTotal.toLocaleString('en-IN')}</>
              ) : (
                <>✓ Place Order (COD)</>
              )}
            </button>

            <Link href="/cart">
              <button className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                ← Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

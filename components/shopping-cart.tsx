'use client'

import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
export default function ShoppingCart() {
  const { items, removeItem, updateQuantity } = useCart()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Shopping Cart
        {items.length > 0 && <span className="text-lg font-normal ml-3" style={{ color: 'var(--text-secondary)' }}>({items.length} items)</span>}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="rounded-lg p-12 text-center border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Start shopping to add items to your cart</p>
              <Link href="/products" className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: 'var(--primary)' }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg p-4 flex items-center gap-4 border"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      ₹{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center transition hover:opacity-80"
                      style={{ borderColor: 'var(--border)' }}>
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center transition hover:opacity-80"
                      style={{ borderColor: 'var(--border)' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="p-2 rounded transition hover:opacity-80"
                    style={{ color: 'var(--error)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit rounded-lg p-6 border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>
          <div className="space-y-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            {[['Subtotal', `₹${total.toLocaleString()}`], ['Shipping', total > 999 ? 'Free' : '₹99'], ['GST (18%)', `₹${Math.round(total * 0.18).toLocaleString()}`]].map(([label, value]) => (
              <div key={label} className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>{label}</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mb-6">
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span style={{ color: 'var(--primary)' }}>
              ₹{(total + Math.round(total * 0.18) + (total > 999 ? 0 : 99)).toLocaleString()}
            </span>
          </div>
         <Link href="/checkout">
            <button disabled={items.length === 0}
              className="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}>
              Proceed to Checkout
            </button>
          </Link>
          <Link href="/products"
            className="block w-full text-center mt-3 py-3 border rounded-lg font-semibold transition hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useCart } from '@/lib/cart-context'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 flex flex-col shadow-lg" style={{ backgroundColor: 'var(--surface)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty</p>
              <Link href="/products" className="mt-4 inline-block px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--primary)' }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                {item.image && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-sm line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--primary)' }}>
                    ₹{item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-gray-200 transition"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <Minus size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <span className="w-8 text-center font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-gray-200 transition"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <Plus size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-red-100 transition ml-auto"
                    >
                      <Trash2 size={16} style={{ color: 'var(--secondary)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Subtotal:</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="w-full block py-3 rounded-lg font-bold text-white text-center transition hover:opacity-90 mb-2" style={{ backgroundColor: 'var(--primary)' }}>
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-lg font-bold border transition hover:opacity-90"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}

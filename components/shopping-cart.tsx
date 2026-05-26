'use client'

import { motion } from 'framer-motion'
import { Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function ShoppingCart() {
  // Demo cart - in real app, use Zustand store
  const cartItems = []
  const total = 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800 rounded-lg p-12 text-center"
            >
              <ShoppingBag size={48} className="text-slate-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-slate-400 mb-6">Start shopping to add items to your cart</p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="p-2 hover:bg-red-600/20 rounded transition-colors text-slate-400 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-24 h-fit bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
          </div>

          <div className="flex justify-between text-white text-lg font-bold mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            disabled={cartItems.length === 0}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>

          <Link
            href="/products"
            className="block w-full text-center mt-3 py-3 border-2 border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-400 hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

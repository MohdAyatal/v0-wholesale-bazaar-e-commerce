'use client'

import Header from '@/components/header'
import ShoppingCart from '@/components/shopping-cart'

export default function CartPage() {
  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />
      <ShoppingCart />
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

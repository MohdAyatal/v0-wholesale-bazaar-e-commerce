'use client'

import Header from '@/components/header'
import ProductDetail from '@/components/product-detail'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetail productId={id} />
      </div>
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

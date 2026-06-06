'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

export default function ProductsGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    createClient()
      .from('products')
      .select('id, name, price, base_price, image_url, image_urls, rating, review_count')
      .order('id', { ascending: false })
      .then(({ data, error }) => {
        console.log('Products:', data, 'Error:', error)
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-8 text-center">Loading products...</p>
  if (!products.length) return <p className="p-8 text-center">No products found.</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map(p => (
        <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
          onClick={() => router.push(`/products/${p.id}`)}>
          <img
            src={p.image_urls?.[0] || p.image_url || '/placeholder.jpg'}
            alt={p.name}
            className="w-full object-cover"
            style={{ aspectRatio: '3/4' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
          />
          <div className="p-3">
            <p className="font-semibold text-sm mb-2 line-clamp-2">{p.name}</p>
            <p className="font-bold" style={{ color: 'var(--primary)' }}>
              ₹{p.price?.toLocaleString('en-IN')}
            </p>
            {p.base_price > p.price && (
              <p className="text-xs line-through text-gray-400">₹{p.base_price?.toLocaleString('en-IN')}</p>
            )}
            <div className="flex gap-1 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); addItem({ id: p.id, name: p.name, price: p.price, image_urls: p.image_urls || [] }) }}
                className="flex-1 py-1.5 text-xs font-semibold text-white rounded-lg"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                Add to Cart
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addItem({ id: p.id, name: p.name, price: p.price, image_urls: p.image_urls || [] }); router.push('/cart') }}
                className="flex-1 py-1.5 text-xs font-semibold text-white rounded-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

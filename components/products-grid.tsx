'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap, Star } from 'lucide-react'
import Image from 'next/image'

function ProductSkeleton() {
  return (
    <div
      className="border rounded-xl overflow-hidden animate-pulse"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
    >
      <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--border)' }} />
      <div className="p-3 space-y-2">
        <div className="h-3.5 rounded" style={{ backgroundColor: 'var(--border)', width: '85%' }} />
        <div className="h-3.5 rounded" style={{ backgroundColor: 'var(--border)', width: '55%' }} />
        <div className="h-3 rounded" style={{ backgroundColor: 'var(--border)', width: '40%' }} />
        <div className="flex gap-1.5 pt-1">
          <div className="h-7 rounded-lg flex-1" style={{ backgroundColor: 'var(--border)' }} />
          <div className="h-7 rounded-lg flex-1" style={{ backgroundColor: 'var(--border)' }} />
        </div>
      </div>
    </div>
  )
}

export default function ProductsGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, base_price, image_url, image_urls, rating, review_count')
          .order('id', { ascending: false })
        if (error) throw error
        setProducts(data || [])
      } catch (e) {
        console.error('Products error:', e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleAddToCart = (e: React.MouseEvent, p: any) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({ id: p.id, name: p.name, price: p.price, image_urls: p.image_urls || [] })
    setAddedIds(prev => new Set(prev).add(p.id))
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n })
    }, 1500)
  }

  const handleBuyNow = (e: React.MouseEvent, p: any) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({ id: p.id, name: p.name, price: p.price, image_urls: p.image_urls || [] })
    router.push('/cart')
  }

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  )

  if (!products.length) return (
    <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
      No products found.
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map(p => {
        const img = p.image_urls?.[0] || p.image_url || '/placeholder.jpg'
        const inCart = addedIds.has(p.id)

        return (
          <div
            key={p.id}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            onClick={() => router.push(`/products/${p.id}`)}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image
                src={img}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
              />
            </div>

            <div className="p-3">
              <p className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                {p.name}
              </p>

              {p.rating && (
                <div className="flex items-center gap-1 mb-1">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {p.rating} ({p.review_count || 0})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                  ₹{p.price?.toLocaleString('en-IN')}
                </span>
                {p.base_price && p.base_price > p.price && (
                  <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                    ₹{p.base_price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={(e) => handleAddToCart(e, p)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90"
                  style={{ backgroundColor: inCart ? '#059669' : 'var(--secondary)' }}
                >
                  <ShoppingCart size={12} />
                  {inCart ? '✓ Added' : 'Add to Cart'}
                </button>
                <button
                  onClick={(e) => handleBuyNow(e, p)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Zap size={12} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

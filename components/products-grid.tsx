'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap, Star } from 'lucide-react'
import Image from 'next/image'

function SkeletonCard() {
  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
    >
      {/* Image skeleton */}
      <div
        className="animate-pulse"
        style={{ aspectRatio: '3/4', backgroundColor: '#E5E7EB' }}
      />
      <div className="p-3 space-y-2">
        {/* Title lines */}
        <div className="animate-pulse h-3.5 rounded-full" style={{ backgroundColor: '#E5E7EB', width: '80%' }} />
        <div className="animate-pulse h-3.5 rounded-full" style={{ backgroundColor: '#E5E7EB', width: '55%' }} />
        {/* Rating */}
        <div className="animate-pulse h-3 rounded-full" style={{ backgroundColor: '#E5E7EB', width: '40%' }} />
        {/* Price */}
        <div className="animate-pulse h-4 rounded-full" style={{ backgroundColor: '#E5E7EB', width: '45%' }} />
        {/* Buttons */}
        <div className="flex gap-1.5 pt-1">
          <div className="animate-pulse flex-1 h-7 rounded-lg" style={{ backgroundColor: '#E5E7EB' }} />
          <div className="animate-pulse flex-1 h-7 rounded-lg" style={{ backgroundColor: '#E5E7EB' }} />
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
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : [])
    })
    setAddedIds(prev => new Set(prev).add(p.id))
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n })
    }, 1500)
  }

  const handleBuyNow = (e: React.MouseEvent, p: any) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : [])
    })
    router.push('/cart')
  }

  // Show 8 skeleton cards while loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="p-12 text-center">
        <div className="text-5xl mb-3">🛍️</div>
        <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
          No products yet
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Check back soon — we're adding new items daily
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map(p => {
        const img = p.image_urls?.[0] || p.image_url || '/placeholder.jpg'
        const inCart = addedIds.has(p.id)

        return (
          <div
            key={p.id}
            className="border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            onClick={() => router.push(`/products/${p.id}`)}
          >
            {/* Product Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image
                src={img}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
              />
            </div>

            {/* Product Info */}
            <div className="p-3">
              <p
                className="font-semibold text-sm mb-1 line-clamp-2"
                style={{ color: 'var(--text-primary)' }}
              >
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
                  {inCart ? '✓ Added' : 'Cart'}
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

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  base_price?: number
  image_url?: string
  image_urls?: string[]
  rating?: number
  review_count?: number
  discount_percent?: number
  stock_quantity?: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('*')
      .limit(8)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Timeout fallback
    const t = setTimeout(() => setLoading(false), 6000)
    return () => clearTimeout(t)
  }, [])

  const getImage = (p: Product) =>
    p.image_urls?.[0] || p.image_url || '/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : []),
    })
    setAddedIds(prev => new Set(prev).add(p.id))
    setTimeout(() => setAddedIds(prev => {
      const next = new Set(prev); next.delete(p.id); return next
    }), 1500)
  }

  const handleBuyNow = (e: React.MouseEvent, p: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : []),
    })
    router.push('/cart')
  }

  if (loading) return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Best Deals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--surface)', height: 300 }} />
        ))}
      </div>
    </section>
  )

  if (!products.length) return null

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Best Deals</h2>
        <Link href="/products" className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => {
          const img       = getImage(p)
          const inCart    = addedIds.has(p.id)
          const discount  = p.discount_percent || 0

          return (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div
                className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={img}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
                  />
                  {discount > 0 && (
                    <span
                      className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </p>

                  {p.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {p.rating} ({p.review_count || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.base_price && p.base_price > p.price && (
                      <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                        ₹{p.base_price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90"
                      style={{ backgroundColor: inCart ? '#059669' : 'var(--secondary)' }}
                    >
                      <ShoppingCart size={12} />
                      {inCart ? '✓' : 'Cart'}
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
            </Link>
          )
        })}
      </div>
    </section>
  )
}

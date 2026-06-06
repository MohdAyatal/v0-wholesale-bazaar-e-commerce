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
  category?: string
}

interface Props {
  searchQuery?: string
  sortBy?: string
  maxPrice?: number
  selectedCategories?: string[]
}

export default function ProductsGrid({ searchQuery, sortBy, maxPrice, selectedCategories }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, sortBy, maxPrice, selectedCategories])

  const fetchProducts = async () => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 8000)
    try {
      const supabase = createClient()
      let q = supabase.from('products').select('*', { count: 'exact' })

      if (searchQuery) q = q.ilike('name', `%${searchQuery}%`)
      if (maxPrice)    q = q.lte('price', maxPrice)
      if (selectedCategories?.length) q = q.in('category', selectedCategories)

      if (sortBy === 'price_asc')  q = q.order('price', { ascending: true })
      else if (sortBy === 'price_desc') q = q.order('price', { ascending: false })
      else if (sortBy === 'rating')     q = q.order('rating', { ascending: false })
      else q = q.order('id', { ascending: false })

      const { data, count } = await q
      setProducts(data || [])
      setTotal(count || 0)
    } catch (err) {
      console.error(err)
      setProducts([])
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const getImage = (p: Product) =>
    p.image_urls?.[0] || p.image_url || '/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.preventDefault(); e.stopPropagation()
    addItem({ id: p.id, name: p.name, price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : []) })
    setAddedIds(prev => new Set(prev).add(p.id))
    setTimeout(() => setAddedIds(prev => {
      const n = new Set(prev); n.delete(p.id); return n
    }), 1500)
  }

  const handleBuyNow = (e: React.MouseEvent, p: Product) => {
    e.preventDefault(); e.stopPropagation()
    addItem({ id: p.id, name: p.name, price: p.price,
      image_urls: p.image_urls || (p.image_url ? [p.image_url] : []) })
    router.push('/cart')
  }

  if (loading) return (
    <div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--surface)', height: 340 }} />
        ))}
      </div>
    </div>
  )

  if (!products.length) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🔍</div>
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No products found</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
    </div>
  )

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Showing 1 – {products.length} of {total} products
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => {
          const img      = getImage(p)
          const inCart   = addedIds.has(p.id)
          const discount = p.discount_percent || 0

          return (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div
                className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={img} alt={p.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--secondary)' }}>
                      {discount}% OFF
                    </span>
                  )}
                  {p.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-bold bg-black/60 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </p>
                  {p.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11}
                          className={i < Math.round(p.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        ({p.review_count || 0})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.base_price && p.base_price > p.price && (
                      <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                        ₹{p.base_price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={p.stock_quantity === 0}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: inCart ? '#059669' : 'var(--secondary)' }}
                    >
                      <ShoppingCart size={12} />
                      {inCart ? '✓ Added' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, p)}
                      disabled={p.stock_quantity === 0}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90 disabled:opacity-40"
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
    </div>
  )
}

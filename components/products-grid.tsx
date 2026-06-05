'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'

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
  featured?: boolean
  stock_quantity?: number
}

interface ProductsGridProps {
  categoryFilter?: string
  searchQuery?: string
  sortBy?: string
  limit?: number
  showOnlyFeatured?: boolean
}

export default function ProductsGrid({
  categoryFilter,
  searchQuery,
  sortBy,
  limit,
  showOnlyFeatured = false,
}: ProductsGridProps) {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [wishlist, setWishlist]   = useState<Set<string>>(new Set())
  const [addedIds, setAddedIds]   = useState<Set<string>>(new Set())

  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [categoryFilter, searchQuery, sortBy, showOnlyFeatured])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      let query = supabase.from('products').select('*')

      if (showOnlyFeatured) query = query.eq('featured', true)
      if (searchQuery)      query = query.ilike('name', `%${searchQuery}%`)

      if (sortBy === 'price_asc')  query = query.order('price', { ascending: true })
      else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
      else if (sortBy === 'rating') query = query.order('rating', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      if (limit) query = query.limit(limit)

      const { data, error } = await query
      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
      discount_percent: product.discount_percent,
    })

    // Flash "Added" state for 1.5s
    setAddedIds(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 1500)
  }

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const getImage = (p: Product) =>
    p.image_urls?.[0] || p.image_url || '/products/placeholder.jpg'

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl animate-pulse"
            style={{ backgroundColor: 'var(--surface)', height: 320 }} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No products found</p>
        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => {
        const img = getImage(product)
        const discount = product.discount_percent || 0
        const inCart = addedIds.has(product.id)
        const inWishlist = wishlist.has(product.id)

        return (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div
              className="rounded-2xl border overflow-hidden transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              {/* Image */}
              <div className="relative" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/products/placeholder.jpg'
                  }}
                />

                {/* Discount badge */}
                {discount > 0 && (
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: 'var(--secondary)' }}
                  >
                    {discount}% OFF
                  </div>
                )}

                {/* Wishlist button */}
                <button
                  onClick={(e) => toggleWishlist(e, product.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition"
                  style={{ backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                >
                  <Heart
                    size={16}
                    fill={inWishlist ? 'var(--secondary)' : 'none'}
                    style={{ color: inWishlist ? 'var(--secondary)' : 'var(--text-secondary)' }}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                  {product.name}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {product.rating} ({product.review_count || 0})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold" style={{ color: 'var(--primary)' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.base_price && product.base_price > product.price && (
                    <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                      ₹{product.base_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1 transition hover:opacity-90"
                  style={{ backgroundColor: inCart ? '#059669' : 'var(--secondary)' }}
                >
                  <ShoppingCart size={14} />
                  {inCart ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

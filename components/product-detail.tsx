'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  description: string
  price: number
  base_price?: number
  image_url?: string
  image_urls?: string[]
  rating: number
  review_count: number
  stock_quantity: number
  min_order_quantity: number
  supplier_id: string
  discount_percent?: number
  material?: string
  care_instructions?: string
  sizes?: string[]
}

interface Supplier {
  name: string
  verified: boolean
  country: string
  email: string
}

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct]   = useState<Product | null>(null)
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading]   = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [added, setAdded]       = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const { addItem, items } = useCart()
  const isInCart = product ? items.some(i => i.id === product.id) : false

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) throw error
        setProduct(data)

        if (data.supplier_id) {
          const { data: sup } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', data.supplier_id)
            .single()
          setSupplier(sup)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
      discount_percent: product.discount_percent,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
        <div className="rounded-2xl h-96 animate-pulse" style={{ backgroundColor: 'var(--surface)' }} />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 rounded animate-pulse" style={{ backgroundColor: 'var(--surface)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
        Product not found.
      </div>
    )
  }

  const sizes      = product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const discount   = product.discount_percent || 0
  const basePrice  = product.base_price || product.price
  const imageUrl   = product.image_urls?.[0] || product.image_url || null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12"
    >
      {/* ── Image ── */}
      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative rounded-2xl overflow-hidden border"
          style={{ borderColor: 'var(--border)', height: 420 }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface)', fontSize: 80 }}
            >
              👗
            </div>
          )}
          {discount > 0 && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              {discount}% OFF
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Details ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {product.rating}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            ({product.review_count} reviews)
          </span>
        </div>

        {/* Price */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
              ₹{product.price.toLocaleString()}
            </span>
            {basePrice > product.price && (
              <span className="text-xl line-through" style={{ color: 'var(--text-secondary)' }}>
                ₹{basePrice.toLocaleString()}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--success)' }}>
              You save ₹{(basePrice - product.price).toLocaleString()}
            </p>
          )}
        </div>

        {/* Size */}
        <div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="px-4 py-2 rounded-lg border-2 font-semibold text-sm transition"
                style={{
                  borderColor: selectedSize === size ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: selectedSize === size ? '#E0F2F0' : 'white',
                  color: selectedSize === size ? 'var(--primary)' : 'var(--text-primary)',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-lg border-2 font-bold text-lg transition hover:opacity-80"
              style={{ borderColor: 'var(--border)' }}
            >−</button>
            <span className="text-lg font-bold w-8 text-center" style={{ color: 'var(--text-primary)' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 rounded-lg border-2 font-bold text-lg transition hover:opacity-80"
              style={{ borderColor: 'var(--border)' }}
            >+</button>
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: product.stock_quantity > 0 ? 'var(--success)' : 'var(--error)' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Supplier */}
        {supplier && (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Supplied by</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {supplier.name}
              </span>
              {supplier.verified && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        )}

        {/* Product info grid */}
        <div
          className="rounded-xl p-4 grid grid-cols-2 gap-3"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {[
            ['🧵', 'Material', product.material || 'N/A'],
            ['🧺', 'Care', product.care_instructions || 'N/A'],
            ['✅', 'Verified Seller', '100% Authentic'],
            ['🚚', 'Free Shipping', 'Above ₹999'],
          ].map(([icon, label, value]) => (
            <div key={label}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{icon} {label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: added || isInCart ? '#059669' : 'var(--secondary)',
            }}
          >
            <ShoppingCart size={20} />
            {added ? '✓ Added!' : isInCart ? '✓ In Cart' : 'Add to Cart'}
          </button>

          <button
            onClick={() => setWishlisted(w => !w)}
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition hover:opacity-80"
            style={{
              borderColor: wishlisted ? 'var(--secondary)' : 'var(--border)',
              backgroundColor: wishlisted ? '#FFF0F0' : 'white',
            }}
          >
            <Heart
              size={20}
              style={{ color: wishlisted ? 'var(--secondary)' : 'var(--text-secondary)' }}
              fill={wishlisted ? 'var(--secondary)' : 'none'}
            />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href })
              } else {
                navigator.clipboard?.writeText(window.location.href)
                alert('Link copied!')
              }
            }}
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition hover:opacity-80"
            style={{ borderColor: 'var(--border)' }}
          >
            <Share2 size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

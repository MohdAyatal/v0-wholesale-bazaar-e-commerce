'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Product3DViewer from './product-3d-viewer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  rating: number
  review_count: number
  stock_quantity: number
  min_order_quantity: number
  supplier_id: string
  model_url?: string
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
  const [product, setProduct] = useState<Product | null>(null)
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [view3D, setView3D] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient()
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (productError) throw productError

        setProduct(productData)

        // Fetch supplier
        if (productData.supplier_id) {
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', productData.supplier_id)
            .single()

          setSupplier(supplierData)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
        <div className="bg-slate-800 rounded-lg h-96 animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!product) {
    return <div className="text-center py-12 text-slate-400">Product not found</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12"
    >
      {/* Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative h-96 bg-slate-800 rounded-lg overflow-hidden group"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <div className="text-slate-400">No Image</div>
            </div>
          )}
        </motion.div>

        {/* 3D Viewer Toggle */}
        {product.model_url && (
          <button
            onClick={() => setView3D(!view3D)}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            {view3D ? 'View 2D Image' : 'View 3D Model'}
          </button>
        )}

        {view3D && product.model_url && (
          <div className="bg-slate-800 rounded-lg overflow-hidden h-96">
            <Product3DViewer modelUrl={product.model_url} />
          </div>
        )}
      </div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-slate-400 text-lg">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
              />
            ))}
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{product.rating}/5.0</div>
            <div className="text-sm text-slate-400">({product.review_count} reviews)</div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-lg p-6">
          <div className="text-sm text-slate-400 mb-2">Price per Unit</div>
          <div className="text-5xl font-bold text-blue-400 mb-2">${product.price.toFixed(2)}</div>
          <div className="text-sm text-slate-400">
            Minimum Order: <span className="text-white font-semibold">{product.min_order_quantity} units</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-semibold text-white">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Supplier Info */}
        {supplier && (
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Supplied by</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  {supplier.name}
                  {supplier.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{supplier.country}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="text-sm font-semibold text-slate-400 mb-2 block">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
              className="w-10 h-10 border border-slate-600 rounded hover:border-slate-400 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <input
              type="number"
              min={product.min_order_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.min_order_quantity, parseInt(e.target.value) || product.min_order_quantity))}
              className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-2 text-white"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-slate-600 rounded hover:border-slate-400 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
            <ShoppingCart size={20} />
            Add to Cart
          </button>
          <button className="p-4 border-2 border-slate-600 text-slate-400 rounded-lg hover:border-slate-400 hover:text-white transition-colors">
            <Heart size={20} />
          </button>
          <button className="p-4 border-2 border-slate-600 text-slate-400 rounded-lg hover:border-slate-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

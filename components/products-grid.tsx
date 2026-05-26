'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  rating: number
  review_count: number
  supplier_id: string
}

interface ProductsGridProps {
  searchParams?: {
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default function ProductsGrid({ searchParams }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        let query = supabase.from('products').select('*')

        if (searchParams?.category) {
          query = query.eq('category_id', searchParams.category)
        }

        if (searchParams?.minPrice) {
          query = query.gte('price', parseFloat(searchParams.minPrice))
        }

        if (searchParams?.maxPrice) {
          query = query.lte('price', parseFloat(searchParams.maxPrice))
        }

        if (searchParams?.search) {
          query = query.ilike('name', `%${searchParams.search}%`)
        }

        // Sort
        if (searchParams?.sort === 'price-asc') {
          query = query.order('price', { ascending: true })
        } else if (searchParams?.sort === 'price-desc') {
          query = query.order('price', { ascending: false })
        } else if (searchParams?.sort === 'rating') {
          query = query.order('rating', { ascending: false })
        } else {
          query = query.order('created_at', { ascending: false })
        }

        const { data, error } = await query.limit(48)

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg mb-4">No products found</p>
        <Link href="/products" className="text-blue-400 hover:text-blue-300">
          View all products →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -10 }}
          className="bg-slate-800 rounded-lg overflow-hidden group"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative h-48 bg-slate-700 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <div className="text-slate-400 text-center text-sm">No Image</div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">({product.review_count})</span>
              </div>

              {/* Price and Button */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-400">
                  ${product.price.toFixed(2)}
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

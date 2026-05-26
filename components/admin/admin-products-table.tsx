'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  rating: number
  review_count: number
  featured: boolean
}

export default function AdminProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-800 rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Featured</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white line-clamp-1">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <span className={product.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                      <span>★</span>
                      <span className="font-semibold">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">({product.review_count})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      product.featured ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-400 hover:text-white">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-400 hover:text-white">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-600/20 rounded transition-colors text-slate-400 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

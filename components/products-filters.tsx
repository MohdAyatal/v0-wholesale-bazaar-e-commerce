'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
}

interface Supplier {
  id: string
  name: string
}

export default function ProductsFilters() {
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const supabase = createClient()
        const [categoriesData, suppliersData] = await Promise.all([
          supabase.from('categories').select('id, name').limit(10),
          supabase.from('suppliers').select('id, name').limit(10),
        ])

        if (categoriesData.data) setCategories(categoriesData.data)
        if (suppliersData.data) setSuppliers(suppliersData.data)
      } catch (err) {
        console.error('Error fetching filters:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFilters()
  }, [])

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="font-semibold text-white mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Min Price ($)</label>
            <input
              type="number"
              min="0"
              defaultValue="0"
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Max Price ($)</label>
            <input
              type="number"
              min="0"
              defaultValue="1000"
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="font-semibold text-white mb-4">Categories</h3>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"
                />
                <span className="text-sm text-slate-300 hover:text-white transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </motion.div>

      {/* Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="font-semibold text-white mb-4">Suppliers</h3>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {suppliers.map((sup) => (
              <label key={sup.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"
                />
                <span className="text-sm text-slate-300 hover:text-white transition-colors">{sup.name}</span>
              </label>
            ))}
          </div>
        )}
      </motion.div>

      {/* Rating */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="font-semibold text-white mb-4">Rating</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"
              />
              <span className="text-sm text-slate-300">★ {rating}+ Stars</span>
            </label>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

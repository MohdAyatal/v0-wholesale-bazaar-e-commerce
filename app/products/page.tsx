'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ShoppingBag, Filter } from 'lucide-react'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState([0, 20000])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('*')
      setCategories(cats || [])
      
      // Fetch products
      let query = supabase.from('products').select('*')
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }
      
      const { data: prods } = await query
      setProducts(prods || [])
      setLoading(false)
    }

    fetchData()
  }, [selectedCategory])

  const filtered = useMemo(() => {
    let result = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'newest') result.reverse()
    
    return result
  }, [products, sortBy, priceRange])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Fashion Products</h1>
        <p className="text-gray-600 mb-8">Discover premium clothing and accessories from verified sellers</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white sticky top-20">
              <h3 className="font-bold text-lg mb-6">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-900">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-gray-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-900">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <Filter size={20} />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2 mb-4">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-200"
                  >
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-48 flex items-center justify-center relative">
                      {product.discount_percent > 0 && (
                        <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{product.discount_percent}%
                        </div>
                      )}
                      <span className="text-4xl">👗</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.review_count})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                          {product.base_price > product.price && (
                            <p className="text-xs text-gray-500 line-through">₹{product.base_price}</p>
                          )}
                        </div>
                        <ShoppingBag size={18} className="text-pink-600" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}


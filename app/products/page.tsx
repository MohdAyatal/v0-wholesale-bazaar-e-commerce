'use client'
export const dynamic = 'force-dynamic'
import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [currentPage, setCurrentPage] = useState(1)

useEffect(() => {
  const fetchData = async () => {
    const supabase = createClient()

    const { data: cats } = await supabase
      .from('categories')
      .select('*')

    setCategories(cats || [])

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    const { data: prods } = await query

    setProducts(prods || [])
    setCurrentPage(1)
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Fashion Products</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-8">Discover premium clothing and accessories from verified sellers</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-20 p-4 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4"
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                        className="w-4 h-4"
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>₹{priceRange[0]}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                    style={{ accentColor: 'var(--primary)' }}
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
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              >
                <Filter size={20} />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Categories</h4>
                <div className="space-y-2 mb-4">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                        className="w-4 h-4"
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Product Count */}
            <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
            </p>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <p style={{ color: 'var(--text-secondary)' }}>No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="rounded-xl overflow-hidden hover:shadow-xl transition border"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    >
                      <div className="relative h-48 flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                        {product.image_urls && product.image_urls[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag size={40} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                        )}
                        {product.discount_percent > 0 && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: 'var(--secondary)' }}>
                            -{product.discount_percent}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2 text-sm" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>({product.review_count})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>₹{product.price}</p>
                            {product.base_price > product.price && (
                              <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>₹{product.base_price}</p>
                            )}
                          </div>
                          <ShoppingBag size={18} style={{ color: 'var(--secondary)' }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border transition disabled:opacity-50"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition ${
                            currentPage === idx + 1
                              ? 'text-white'
                              : ''
                          }`}
                          style={{
                            backgroundColor: currentPage === idx + 1 ? 'var(--primary)' : 'var(--surface)',
                            borderColor: currentPage === idx + 1 ? 'var(--primary)' : 'var(--border)',
                            border: '1px solid',
                            color: currentPage === idx + 1 ? 'white' : 'var(--text-primary)'
                          }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border transition disabled:opacity-50"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}


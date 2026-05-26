'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('*').limit(6)
      setCategories(cats || [])
      
      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(8)
      setFeatured(products || [])
      
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Wholesale <span className="text-pink-600">Fashion</span> Marketplace
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover premium ethnic wear, casual fashion, bridal collections and more from verified suppliers in Prayagraj.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/products"
                  className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
                >
                  Shop Now
                </Link>
                <Link 
                  href="/about"
                  className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">👗</div>
                <p className="text-xl font-semibold">Premium Fashion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6 text-center hover:shadow-lg transition font-semibold text-gray-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Featured Products</h2>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                  <div className="bg-gray-200 h-48 flex items-center justify-center relative">
                    <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount_percent}%
                    </div>
                    <span className="text-4xl">👗</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                        <p className="text-sm text-gray-500 line-through">₹{product.base_price}</p>
                      </div>
                      <ShoppingBag size={20} className="text-pink-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <p className="text-gray-400">Wholesale Baazar - Premium fashion marketplace from Prayagraj</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2 text-gray-400">
                <p><Link href="/products" className="hover:text-white">Products</Link></p>
                <p><Link href="/about" className="hover:text-white">About Us</Link></p>
                <p><Link href="#" className="hover:text-white">Contact</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <p><Link href="#" className="hover:text-white">FAQ</Link></p>
                <p><Link href="#" className="hover:text-white">Shipping</Link></p>
                <p><Link href="#" className="hover:text-white">Returns</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="text-gray-400 space-y-2">
                <p>Email: info@wholesalebaazar.com</p>
                <p>Phone: +91-XXXX-XXXX</p>
                <p>Prayagraj, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


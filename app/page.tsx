'use client'

import Header from '@/components/header'
import FloatingChatbot from '@/components/floating-chatbot'
import HomeCarousel from '@/components/home-carousel'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, TrendingUp } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('*')
      setCategories(cats || [])
      
      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(12)
      setFeatured(products || [])
      
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <FloatingChatbot />

      {/* Carousel Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeCarousel />
        </div>
      </section>

      {/* Categories - Horizontal Scroll (Flipkart Style) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-min pb-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="flex-shrink-0 text-center hover:shadow-lg transition"
                >
                  <div 
                    className="w-24 h-24 rounded-lg flex items-center justify-center mb-2 hover:opacity-80 transition"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <ShoppingBag size={32} style={{ color: 'var(--primary)' }} />
                  </div>
                  <p className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Best Deals</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
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
                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: 'var(--secondary)' }}>
                        -{product.discount_percent}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>({product.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>₹{product.price}</p>
                      {product.base_price > product.price && (
                        <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>₹{product.base_price}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* View All Products CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            href="/products"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About Wholesale Baazar</h3>
              <p className="text-gray-400">Premium fashion marketplace connecting buyers with quality products.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <p><Link href="/products" className="text-gray-400 hover:text-white transition">Products</Link></p>
                <p><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <div className="space-y-2">
                <p><Link href="#" className="text-gray-400 hover:text-white transition">FAQ</Link></p>
                <p><Link href="#" className="text-gray-400 hover:text-white transition">Contact</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>WhatsApp: 8840130533</p>
                <p>Email: info@wholesalebaazar.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


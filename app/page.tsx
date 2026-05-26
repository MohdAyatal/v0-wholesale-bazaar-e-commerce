'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, TrendingUp, Zap } from 'lucide-react'

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
        .limit(12)
      setFeatured(products || [])
      
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div style={{ backgroundColor: 'var(--surface)' }} className="absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Zap size={16} />
                <span className="text-sm font-semibold">Premium Collections Available</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Wholesale <span style={{ color: 'var(--secondary)' }}>Fashion</span> Hub
              </h1>
              <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                Discover thousands of premium ethnic wear, casual fashion, bridal collections, and accessories from verified suppliers across India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products"
                  className="px-8 py-4 rounded-lg font-semibold transition hover:shadow-lg text-white flex items-center gap-2"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <ShoppingBag size={20} />
                  Shop Now
                </Link>
                <Link 
                  href="/about"
                  className="px-8 py-4 rounded-lg font-semibold transition border-2"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-96">
              {featured.length > 0 && featured[0].image_urls && featured[0].image_urls[0] ? (
                <div className="relative w-full h-full">
                  <Image
                    src={featured[0].image_urls[0]}
                    alt="Featured"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              ) : (
                <div className="rounded-2xl h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <TrendingUp size={80} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>30+</p>
              <p style={{ color: 'var(--text-secondary)' }}>Premium Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--secondary)' }}>6</p>
              <p style={{ color: 'var(--text-secondary)' }}>Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>100%</p>
              <p style={{ color: 'var(--text-secondary)' }}>Verified Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>₹</p>
              <p style={{ color: 'var(--text-secondary)' }}>Best Prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Shop by Category</h2>
          <p className="mb-12" style={{ color: 'var(--text-secondary)' }}>Explore our vast selection of fashion categories</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="p-6 rounded-xl text-center hover:shadow-lg transition font-semibold"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <p style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Featured Products</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Premium selection curated just for you</p>
            </div>
            <Link href="/products" className="font-semibold" style={{ color: 'var(--primary)' }}>
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <p style={{ color: 'var(--text-secondary)' }}>Loading premium products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition border"
                  style={{ borderColor: 'var(--border)' }}
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
                    <h3 className="font-bold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>({product.review_count})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>₹{product.price}</p>
                        {product.base_price > product.price && (
                          <p className="text-sm line-through" style={{ color: 'var(--text-secondary)' }}>₹{product.base_price}</p>
                        )}
                      </div>
                      <ShoppingBag size={20} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Wardrobe?</h2>
          <p className="text-lg mb-8 opacity-90">Browse our complete collection of premium fashion items</p>
          <Link href="/products" className="inline-block px-8 py-3 rounded-lg font-semibold transition" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About Wholesale Baazar</h3>
              <p className="text-gray-400">Premium fashion marketplace connecting verified suppliers with wholesale buyers across India. Authentic quality, competitive pricing.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <p><Link href="/products" className="text-gray-400 hover:text-white transition">Products</Link></p>
                <p><Link href="/suppliers" className="text-gray-400 hover:text-white transition">Suppliers</Link></p>
                <p><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <div className="space-y-2">
                <p><Link href="#" className="text-gray-400 hover:text-white transition">FAQ</Link></p>
                <p><Link href="#" className="text-gray-400 hover:text-white transition">Shipping Info</Link></p>
                <p><Link href="#" className="text-gray-400 hover:text-white transition">Return Policy</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@wholesalebaazar.com</p>
                <p>Phone: +91-XXXX-XXXX</p>
                <p>Prayagraj, Uttar Pradesh</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wholesale Baazar. All rights reserved. | <Link href="#" className="hover:text-white">Privacy Policy</Link> | <Link href="#" className="hover:text-white">Terms of Service</Link></p>
          </div>
        </div>
      </footer>
    </main>
  )
}


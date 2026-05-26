'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ShoppingBag, Heart, Share2, ChevronDown } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Fetch product
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(prod)
      
      // Fetch reviews
      const { data: revs } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false })
      setReviews(revs || [])
      
      setLoading(false)
    }

    if (id) fetchData()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-gray-500">Product not found</p>
        </div>
      </main>
    )
  }

  const ratingDistribution = [
    { stars: 5, count: Math.round(reviews.filter(r => r.rating === 5).length) },
    { stars: 4, count: Math.round(reviews.filter(r => r.rating === 4).length) },
    { stars: 3, count: Math.round(reviews.filter(r => r.rating === 3).length) },
    { stars: 2, count: Math.round(reviews.filter(r => r.rating === 2).length) },
    { stars: 1, count: Math.round(reviews.filter(r => r.rating === 1).length) },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl h-96 flex items-center justify-center mb-4">
              <span className="text-7xl">👗</span>
            </div>
            {product.discount_percent > 0 && (
              <div className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg font-bold mb-4">
                {product.discount_percent}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-600">({product.review_count} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-600 text-sm mb-2">Price</p>
                <div className="flex items-center gap-4">
                  <p className="text-4xl font-bold text-gray-900">₹{product.price}</p>
                  {product.base_price > product.price && (
                    <p className="text-xl text-gray-500 line-through">₹{product.base_price}</p>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-semibold transition ${
                        selectedSize === size
                          ? 'border-pink-600 bg-pink-50 text-pink-600'
                          : 'border-gray-300 text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center gap-2">
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition">
                  <Heart size={20} />
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Material</p>
                <p className="font-semibold text-gray-900">{product.material}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Care Instructions</p>
                <p className="font-semibold text-gray-900">{product.care_instructions}</p>
              </div>
              {product.verified_seller && (
                <div className="flex items-center gap-2 text-green-600">
                  <span>✓</span>
                  <span className="font-semibold">Verified Seller</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Summary */}
            <div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600">{product.review_count} verified reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 w-12">{dist.stars} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(dist.count / Math.max(...ratingDistribution.map(d => d.count), 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{dist.count}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="mt-6 w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.author_name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        {review.verified_purchase && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">Verified</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
                      <p className="text-gray-600">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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


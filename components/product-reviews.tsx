'use client'

import { useEffect, useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  author_name: string
  verified: boolean
  helpful_count: number
  created_at: string
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({})
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error

        setReviews(data || [])

        // Calculate rating distribution
        const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        data?.forEach((review) => {
          distribution[review.rating]++
        })
        setRatingDistribution(distribution)
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  if (loading) {
    return <div className="py-12 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse" />
      ))}
    </div>
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Rating Summary */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2">{avgRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(parseFloat(avgRating as string)) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                />
              ))}
            </div>
            <div className="text-sm text-slate-400">{totalReviews} reviews</div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-slate-400 w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{ratingDistribution[rating] || 0}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white">{review.title}</h3>
                  </div>
                </div>

                <p className="text-slate-300 mb-4">{review.content}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-500">
                    By <span className="font-semibold text-slate-300">{review.author_name}</span>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-300">
                    <ThumbsUp size={16} />
                    <span className="text-xs">{review.helpful_count}</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

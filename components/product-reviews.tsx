'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-context'
import { Star, User, ThumbsUp, MessageSquare, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
  profiles: {
    full_name: string
    avatar_url?: string
  }
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const { user, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }

    if (!newReview.comment.trim()) {
      alert('Please write a review comment')
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      
      // Check if user already reviewed
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (existing) {
        alert('You have already reviewed this product!')
        setSubmitting(false)
        return
      }

      // Insert review
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating: newReview.rating,
          comment: newReview.comment,
          helpful_count: 0,
        })

      if (error) throw error

      // Update product rating
      const newTotalReviews = reviews.length + 1
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / newTotalReviews + (newReview.rating / newTotalReviews)
      
      await supabase
        .from('products')
        .update({ 
          rating: Number(avgRating.toFixed(1)),
          review_count: newTotalReviews
        })
        .eq('id', productId)

      setNewReview({ rating: 5, comment: '' })
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const getStarDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => dist[r.rating as keyof typeof dist]++)
    return dist
  }

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const distribution = getStarDistribution()

  if (loading) {
    return (
      <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded w-48" style={{ backgroundColor: 'var(--surface)' }} />
          <div className="h-32 rounded" style={{ backgroundColor: 'var(--surface)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= Math.round(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Based on {reviews.length} reviews</p>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className="w-full flex items-center gap-3 group"
                >
                  <span className="text-sm w-8" style={{ color: 'var(--text-secondary)' }}>{star}★</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${reviews.length ? (distribution[star as keyof typeof distribution] / reviews.length) * 100 : 0}%`,
                        backgroundColor: filterRating === star ? 'var(--primary)' : '#FBBF24'
                      }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right" style={{ color: 'var(--text-secondary)' }}>
                    {distribution[star as keyof typeof distribution]}
                  </span>
                </button>
              ))}
            </div>

            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="w-full mt-4 py-2 rounded-lg text-sm font-medium transition"
                style={{ backgroundColor: 'var(--background)', color: 'var(--primary)' }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Write Review */}
          {user && (
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    className="w-full p-4 rounded-xl border outline-none focus:ring-2 resize-none"
                    style={{ 
                      borderColor: 'var(--border)', 
                      backgroundColor: 'var(--background)',
                      color: 'var(--text-primary)',
                      minHeight: 100
                    }}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white transition disabled:opacity-50"
                    style={{ backgroundColor: submitting ? 'var(--text-secondary)' : 'var(--primary)' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="rounded-2xl border p-6 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Please <button onClick={() => router.push('/login')} style={{ color: 'var(--primary)' }} className="font-semibold hover:underline">sign in</button> to write a review</p>
            </div>
          )}

          {/* Reviews */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                {filterRating ? `No ${filterRating}-star reviews yet` : 'No reviews yet. Be the first to review!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border p-6"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {review.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {review.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.75 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

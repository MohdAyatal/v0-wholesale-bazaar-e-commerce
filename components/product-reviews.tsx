'use client'

import { useEffect, useState } from 'react'
import { Star, ThumbsUp, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [reviews, setReviews]         = useState<Review[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [distribution, setDistribution] = useState<Record<number, number>>({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  })

  // Form state
  const [formRating, setFormRating]       = useState(5)
  const [hoverRating, setHoverRating]     = useState(0)
  const [formTitle, setFormTitle]         = useState('')
  const [formContent, setFormContent]     = useState('')
  const [formName, setFormName]           = useState('')
  const [formError, setFormError]         = useState('')

  useEffect(() => {
    fetchReviews()
  }, [productId])

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

      const revs = data || []
      setReviews(revs)

      // Calculate distribution
      const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      revs.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
      setDistribution(dist)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!formName.trim()) { setFormError('Please enter your name.'); return }
    if (!formContent.trim()) { setFormError('Please write your review.'); return }
    if (formContent.trim().length < 10) { setFormError('Review must be at least 10 characters.'); return }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('reviews').insert([{
        product_id: productId,
        rating: formRating,
        title: formTitle.trim() || null,
        content: formContent.trim(),
        author_name: formName.trim(),
        verified: false,
        helpful_count: 0,
      }])

      if (error) throw error

      // Reset form
      setFormRating(5)
      setFormTitle('')
      setFormContent('')
      setFormName('')
      setFormError('')
      setShowForm(false)
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 4000)

      // Refresh reviews
      fetchReviews()
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Customer Reviews
      </h2>

      {/* Success banner */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 px-5 py-4 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' }}
          >
            ✅ Thank you! Your review has been submitted successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* Rating Summary */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="text-center mb-6">
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {avgRating}
            </div>
            <div className="flex justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(parseFloat(avgRating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs w-6 text-right" style={{ color: 'var(--text-secondary)' }}>
                  {star}★
                </span>
                <div
                  className="flex-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--border)', height: 7 }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: totalReviews > 0
                        ? `${(distribution[star] / totalReviews) * 100}%`
                        : '0%',
                      backgroundColor: 'var(--accent)',
                    }}
                  />
                </div>
                <span className="text-xs w-4" style={{ color: 'var(--text-secondary)' }}>
                  {distribution[star] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* Write review button */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            Write a Review
          </button>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface)' }} />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>
                No reviews yet. Be the first to review this product!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-6 py-2 rounded-xl font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                Write the First Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={15}
                              className={i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {review.title}
                        </h4>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-sm mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}>
                    {review.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      By <span style={{ color: 'var(--text-primary)' }}>{review.author_name}</span>
                    </span>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-lg transition hover:opacity-80 text-xs"
                      style={{ backgroundColor: 'var(--background)', color: 'var(--text-secondary)' }}
                    >
                      <ThumbsUp size={13} />
                      Helpful ({review.helpful_count})
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Write Review Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-7"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-lg transition hover:opacity-70"
                >
                  <X size={22} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">

                {/* Star rating picker */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Your Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormRating(star)}
                        className="transition"
                      >
                        <Star
                          size={32}
                          className={star <= (hoverRating || formRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm self-center" style={{ color: 'var(--text-secondary)' }}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoverRating || formRating]}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Review title */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="Summarise your review (optional)"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Review content */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Your Review *
                  </label>
                  <textarea
                    value={formContent}
                    onChange={e => setFormContent(e.target.value)}
                    placeholder="Tell others about your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {formContent.length}/500 characters
                  </p>
                </div>

                {/* Error */}
                {formError && (
                  <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                  >
                    ⚠️ {formError}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl font-semibold border transition hover:opacity-80"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

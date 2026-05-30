'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // In production, save to database or email service
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-lg p-12 text-white text-center"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Mail size={48} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get exclusive deals, product updates, and wholesale tips delivered to your inbox
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-black"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-lg font-bold transition hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: 'var(--secondary)', color: 'white' }}
            >
              <Send size={20} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-sm opacity-90">
              Thank you for subscribing!
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-sm opacity-90">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

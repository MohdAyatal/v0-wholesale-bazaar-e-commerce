'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message || 'Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

      {/* Simple top bar */}
      <div
        className="w-full flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">
            <span style={{ color: 'var(--primary)' }}>Wholesale</span>
            <span style={{ color: 'var(--secondary)' }}> Baazar</span>
          </span>
        </Link>
        <Link href="/" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          ← Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="flex items-center justify-center py-16 px-4">
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your Wholesale Baazar account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Password
                </label>
                <span
                  className="text-sm cursor-pointer hover:underline"
                  style={{ color: 'var(--primary)' }}
                  onClick={async () => {
                    if (!email) { setError('Enter your email first to reset password.'); return }
                    const supabase = createClient()
                    await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`
                    })
                    alert('Password reset email sent! Check your inbox.')
                  }}
                >
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw
                    ? <EyeOff size={18} style={{ color: 'var(--text-secondary)' }} />
                    : <Eye size={18} style={{ color: 'var(--text-secondary)' }} />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition"
              style={{
                backgroundColor: loading ? 'var(--text-secondary)' : 'var(--primary)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          </div>

          {/* Guest */}
          <Link href="/products">
            <button
              className="w-full py-3 rounded-xl font-semibold text-sm border transition hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--background)' }}
            >
              Continue as Guest
            </button>
          </Link>

          {/* Sign up link */}
          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

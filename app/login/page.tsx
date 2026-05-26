'use client'

import Header from '@/components/header'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      console.log('Login attempt:', formData)
      alert('Login functionality would connect to backend auth. For now, this is a placeholder.')
      setLoading(false)
    }, 1000)
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sign in to your Wholesale Baazar account
            </p>
          </div>

          {/* Form */}
          <div
            className="rounded-xl border p-8"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    style={{ color: 'var(--text-secondary)' }}
                    className="absolute left-3 top-3"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Password
                  </label>
                  <Link href="#" className="text-sm" style={{ color: 'var(--primary)' }}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={20}
                    style={{ color: 'var(--text-secondary)' }}
                    className="absolute left-3 top-3"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff size={20} style={{ color: 'var(--text-secondary)' }} />
                    ) : (
                      <Eye size={20} style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t" style={{ borderColor: 'var(--border)' }} />
              <span className="px-4" style={{ color: 'var(--text-secondary)' }}>
                OR
              </span>
              <div className="flex-1 border-t" style={{ borderColor: 'var(--border)' }} />
            </div>

            {/* Guest Button */}
            <button
              type="button"
              className="w-full py-3 rounded-lg font-semibold border transition hover:opacity-90"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--background)'
              }}
            >
              Continue as Guest
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p style={{ color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold"
                style={{ color: 'var(--primary)' }}
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Info Box */}
          <div
            className="mt-8 p-4 rounded-lg border"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Demo Account:</strong> This is a placeholder login page. Full authentication would be integrated with a backend service like Supabase Auth or your own authentication system.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

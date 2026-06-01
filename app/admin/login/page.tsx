'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Amber@wb2026'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('wb_admin_token', 'wb_admin_2025_secure')
      router.push('/admin')
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0a5752 50%, #134e4a 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Card */}
        <div
          className="rounded-2xl shadow-2xl p-8"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Logo / Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ backgroundColor: '#0F766E' }}
            >
              <ShieldCheck size={32} color="white" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#1F2937' }}
            >
              Admin Portal
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: '#6B7280' }}
            >
              <span style={{ color: '#0F766E', fontWeight: 700 }}>Wholesale</span>
              <span style={{ color: '#FF6B6B', fontWeight: 700 }}> Baazar</span>
              {' '}— Secure Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: '#374151' }}
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock size={18} color="#9CA3AF" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    borderColor: error ? '#EF4444' : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                    color: '#1F2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0F766E'
                    e.target.style.backgroundColor = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB'
                    e.target.style.backgroundColor = '#F9FAFB'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword
                    ? <EyeOff size={18} color="#9CA3AF" />
                    : <Eye size={18} color="#9CA3AF" />
                  }
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
              style={{
                backgroundColor: loading || !password ? '#9CA3AF' : '#0F766E',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm transition hover:underline"
              style={{ color: '#6B7280' }}
            >
              ← Back to Wholesale Baazar
            </a>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          🔒 This page is for authorized personnel only.
        </p>

      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@wholesalebaazar.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        sessionStorage.setItem('admin_token', 'fairpath_admin_demo_2024')
        router.push('/admin')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }} className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--primary)' }}>Wholesale</span>
            <span style={{ color: 'var(--secondary)' }}> Baazar</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="p-8 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            {error && (
              <div className="mb-6 p-4 rounded-lg flex gap-3" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
            Demo credentials: admin@wholesalebaazar.com / admin123
          </p>
        </form>
      </div>
    </main>
  )
}

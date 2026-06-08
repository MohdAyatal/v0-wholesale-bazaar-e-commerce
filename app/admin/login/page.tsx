'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('wb_admin_token', 'wb_admin_2025_secure')
      window.location.href = '/admin'
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0F766E, #134e4a)' }}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-2xl p-8 shadow-2xl bg-white">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow"
              style={{ backgroundColor: 'var(--primary)' }}>
              <ShieldCheck size={28} color="white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Portal</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Wholesale</span>
              <span style={{ color: 'var(--secondary)', fontWeight: 700 }}> Baazar</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }} />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {show
                    ? <EyeOff size={16} style={{ color: 'var(--text-secondary)' }} />
                    : <Eye size={16} style={{ color: 'var(--text-secondary)' }} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {loading ? 'Checking...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-5">
            <a href="/" className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

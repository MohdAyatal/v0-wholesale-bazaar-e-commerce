'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('wb_admin_token')
    if (token) {
      router.push('/admin')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate network delay for security
    await new Promise(r => setTimeout(r, 500))

    if (password === ADMIN_PASSWORD) {
      // Use localStorage for persistence across tabs
      localStorage.setItem('wb_admin_token', 'wb_admin_2025_secure')
      localStorage.setItem('wb_admin_expiry', String(Date.now() + 60 * 60 * 1000))
      // Use router.push instead of window.location for proper Next.js navigation
      router.push('/admin')
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
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow"
              style={{ backgroundColor: '#0F766E' }}
            >
              <ShieldCheck size={28} color="white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm mt-1 text-gray-600">
              <span className="font-bold text-teal-700">Wholesale</span>
              <span className="font-bold text-teal-900"> Baazar</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { 
                    setPassword(e.target.value); 
                    if (error) setError('') 
                  }}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                <button 
                  type="button" 
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 text-gray-400"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50 bg-teal-700 hover:bg-teal-800"
            >
              {loading ? 'Checking...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-5">
            <a href="/" className="text-xs text-gray-500 hover:text-teal-700 hover:underline">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

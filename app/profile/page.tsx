'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { User, Phone, Mail, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Ethnic Wear', 'Mens Wear', 'Kids Wear', 'Bridal Wear', 'Casual Wear', 'Accessories']

export default function ProfilePage() {
  const { user, profile, refreshProfile, loading } = useAuth()
  const router = useRouter()

  const [fullName,    setFullName]    = useState('')
  const [phone,       setPhone]       = useState('')
  const [gender,      setGender]      = useState('')
  const [categories,  setCategories]  = useState<string[]>([])
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [error,       setError]       = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setGender(profile.gender || '')
      setCategories(profile.preferred_categories || [])
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '')
    }
  }, [profile, user])

  const toggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()

      // Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          gender,
          preferred_categories: categories,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Also update auth metadata so name shows in header immediately
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })

      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />
      <div className="flex items-center justify-center py-24">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    </main>
  )

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {fullName.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Personal Info */}
          <div className="card p-6 rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none opacity-60 cursor-not-allowed"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Personalization</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Help us show you products you'll love. This personalizes your homepage.
            </p>

            {/* Gender */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>I am a</label>
              <div className="flex gap-3">
                {[['male','👨 Male'],['female','👩 Female'],['other','🧑 Other']].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setGender(val)}
                    className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition"
                    style={{
                      borderColor: gender === val ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: gender === val ? '#E0F2F0' : 'white',
                      color: gender === val ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred categories */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                I'm interested in <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="px-4 py-2 rounded-xl border-2 text-sm font-medium transition"
                    style={{
                      borderColor: categories.includes(cat) ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: categories.includes(cat) ? '#E0F2F0' : 'white',
                      color: categories.includes(cat) ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    {categories.includes(cat) ? '✓ ' : ''}{cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: saved ? 'var(--success)' : 'var(--primary)' }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  )
}

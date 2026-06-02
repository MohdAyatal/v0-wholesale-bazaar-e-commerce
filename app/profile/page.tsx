'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-context'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, Package, Heart, Settings, ChevronRight, Camera } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'men', label: 'Men', icon: '👔' },
  { id: 'women', label: 'Women', icon: '👗' },
  { id: 'kids', label: 'Kids', icon: '🧸' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
]

export default function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    preferred_categories: [] as string[],
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        preferred_categories: profile.preferred_categories || [],
      })
    }
  }, [profile])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          gender: formData.gender,
          preferred_categories: formData.preferred_categories,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      await refreshProfile()
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories.includes(categoryId)
        ? prev.preferred_categories.filter(c => c !== categoryId)
        : [...prev.preferred_categories, categoryId]
    }))
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border p-6 mb-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {getInitial(profile?.full_name || 'U')}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: 'var(--secondary)' }}>
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>{profile?.full_name}</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${activeTab === 'profile' ? 'font-semibold' : ''}`}
                  style={{ 
                    backgroundColor: activeTab === 'profile' ? '#E0F2F0' : 'transparent',
                    color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                >
                  <User size={20} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${activeTab === 'preferences' ? 'font-semibold' : ''}`}
                  style={{ 
                    backgroundColor: activeTab === 'preferences' ? '#E0F2F0' : 'transparent',
                    color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                >
                  <Settings size={20} />
                  Preferences
                </button>
                <Link href="/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left" style={{ color: 'var(--text-primary)' }}>
                  <Package size={20} />
                  Orders
                  <ChevronRight size={16} className="ml-auto" style={{ color: 'var(--text-secondary)' }} />
                </Link>
                <Link href="/wishlist" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left" style={{ color: 'var(--text-primary)' }}>
                  <Heart size={20} />
                  Wishlist
                  <ChevronRight size={16} className="ml-auto" style={{ color: 'var(--text-secondary)' }} />
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2"
                          style={{ 
                            borderColor: 'var(--border)', 
                            backgroundColor: 'var(--background)',
                            color: 'var(--text-primary)',
                            ringColor: 'var(--primary)'
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 rounded-xl border opacity-60 cursor-not-allowed"
                          style={{ 
                            borderColor: 'var(--border)', 
                            backgroundColor: 'var(--background)',
                            color: 'var(--text-secondary)'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2"
                          style={{ 
                            borderColor: 'var(--border)', 
                            backgroundColor: 'var(--background)',
                            color: 'var(--text-primary)',
                            ringColor: 'var(--primary)'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Gender</label>
                      <div className="flex gap-4">
                        {[
                          { value: 'male', label: 'Male', emoji: '♂️' },
                          { value: 'female', label: 'Female', emoji: '♀️' },
                          { value: 'other', label: 'Other', emoji: '⚧' }
                        ].map((g) => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g.value as any })}
                            className={`flex-1 py-3 rounded-xl border-2 transition ${formData.gender === g.value ? 'font-semibold' : ''}`}
                            style={{
                              borderColor: formData.gender === g.value ? 'var(--primary)' : 'var(--border)',
                              backgroundColor: formData.gender === g.value ? '#E0F2F0' : 'var(--background)',
                              color: formData.gender === g.value ? 'var(--primary)' : 'var(--text-primary)'
                            }}
                          >
                            <span className="mr-1">{g.emoji}</span>
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                      style={{ backgroundColor: loading ? 'var(--text-secondary)' : 'var(--primary)' }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Shopping Preferences</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Select categories you're interested in. We'll personalize your home feed based on these preferences.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-4 rounded-xl border-2 transition text-center ${formData.preferred_categories.includes(cat.id) ? 'font-semibold' : ''}`}
                      style={{
                        borderColor: formData.preferred_categories.includes(cat.id) ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: formData.preferred_categories.includes(cat.id) ? '#E0F2F0' : 'var(--background)',
                        color: formData.preferred_categories.includes(cat.id) ? 'var(--primary)' : 'var(--text-primary)'
                      }}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="text-sm">{cat.label}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                    style={{ backgroundColor: loading ? 'var(--text-secondary)' : 'var(--primary)' }}
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>

                {/* Preview */}
                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Your Personalized Feed Will Show:</h3>
                  {formData.preferred_categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.preferred_categories.map(cat => (
                        <span 
                          key={cat} 
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
                        >
                          {categories.find(c => c.id === cat)?.label || cat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No preferences selected. We'll show you trending products.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

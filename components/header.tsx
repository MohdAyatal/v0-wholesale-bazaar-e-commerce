'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/components/auth-context'
import { ShoppingBag, Search, Menu, X, LogIn, MessageCircle, User, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const WHATSAPP_NUMBER = '8840130533'

export default function Header() {
  const { items } = useCart()
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello, I would like to know more about your products.`, '_blank')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bold text-2xl tracking-tight">
            <span style={{ color: 'var(--primary)' }}>Wholesale</span>
            <span style={{ color: 'var(--secondary)' }}> Baazar</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Products</Link>
            <Link href="/orders" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
            <Link href="/about" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/contact" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Contact</Link>
          </nav>

          {/* Right side - Search & Cart & Auth & WhatsApp */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--surface)' }}>
              <Search size={18} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent ml-2 outline-none text-sm w-32"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            
            <Link href="/cart" className="relative transition hover:opacity-80" style={{ color: 'var(--primary)' }}>
              <ShoppingBag size={24} /> 
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--secondary)' }}>{items.length}</span>
              )}
            </Link>

            <button 
              onClick={openWhatsApp}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition hover:opacity-90 text-white text-sm"
              style={{ backgroundColor: '#25D366' }}
              title="Contact on WhatsApp"
            >
              <MessageCircle size={16} />
              <span className="hidden lg:inline">WhatsApp</span>
            </button>

            {/* Auth Section */}
            {!loading && (
              <>
                {user && profile ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:opacity-80"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {getInitial(profile.full_name)}
                      </div>
                      <span className="hidden lg:block font-medium text-sm max-w-24 truncate" style={{ color: 'var(--text-primary)' }}>
                        {profile.full_name.split(' ')[0]}
                      </span>
                      <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border" style={{ borderColor: 'var(--border)' }}>
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{profile.full_name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:opacity-80"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={18} style={{ color: 'var(--primary)' }} />
                          My Profile
                        </Link>
                        
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:opacity-80"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                          My Orders
                        </Link>
                        
                        <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--border)' }}>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition hover:opacity-80"
                            style={{ color: '#DC2626' }}
                          >
                            <LogOut size={18} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" style={{ color: 'var(--text-primary)' }}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--border)' }}>
            <Link href="/products" className="font-medium transition hover:opacity-80 py-2" style={{ color: 'var(--text-secondary)' }}>Products</Link>
            <Link href="/orders" className="font-medium transition hover:opacity-80 py-2" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
            <Link href="/about" className="font-medium transition hover:opacity-80 py-2" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/contact" className="font-medium transition hover:opacity-80 py-2" style={{ color: 'var(--text-secondary)' }}>Contact</Link>
            
            {!loading && user && profile ? (
              <>
                <div className="flex items-center gap-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {getInitial(profile.full_name)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{profile.full_name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>View Profile</p>
                  </div>
                </div>
                <Link href="/profile" className="font-medium py-2" style={{ color: 'var(--primary)' }}>My Profile</Link>
                <button 
                  onClick={handleSignOut}
                  className="font-medium py-2 text-left"
                  style={{ color: '#DC2626' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="font-medium py-2" style={{ color: 'var(--primary)' }}>Login</Link>
            )}
            
            <button 
              onClick={openWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white w-full justify-center mt-2"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

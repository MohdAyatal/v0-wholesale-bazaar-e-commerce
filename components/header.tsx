'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, LogIn, User, Package, LogOut, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export default function Header() {
  const [isOpen, setIsOpen]         = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { items } = useCart()
  const { user, profile, signOut, loading } = useAuth()

  const cartCount  = items.reduce((s, i) => s + i.quantity, 0)
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || ''
  const firstLetter = displayName.charAt(0).toUpperCase()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bold text-2xl tracking-tight">
            <span style={{ color: 'var(--primary)' }}>Wholesale</span>
            <span style={{ color: 'var(--secondary)' }}> Baazar</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Products</Link>
            <Link href="/orders"   className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
            <Link href="/about"    className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/contact"  className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Contact</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="hidden sm:flex items-center rounded-lg px-3 py-2 gap-2" style={{ backgroundColor: 'var(--surface)' }}>
              <Search size={16} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
                className="bg-transparent outline-none text-sm w-28"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            {/* WhatsApp */}
            {WHATSAPP_NUMBER && (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-white transition hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative transition hover:opacity-80" style={{ color: 'var(--primary)' }}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--secondary)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth button — Login or Profile */}
            {user ? (
                  /* ── Profile Dropdown ── */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(o => !o)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:opacity-80"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      {/* Avatar circle with first letter */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {firstLetter || '?'}
                      </div>
                      <span
                        className="hidden sm:block text-sm font-semibold max-w-[100px] truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {displayName.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div
                        className="absolute right-0 top-12 w-52 rounded-xl border shadow-lg py-1 z-50"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        {/* User info at top */}
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                            {displayName || 'My Account'}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {user.email}
                          </p>
                        </div>

                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:opacity-80 transition cursor-pointer">
                            <User size={16} style={{ color: 'var(--primary)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>My Profile</span>
                          </div>
                        </Link>

                        <Link href="/orders" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:opacity-80 transition cursor-pointer">
                            <Package size={16} style={{ color: 'var(--primary)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>My Orders</span>
                          </div>
                        </Link>

                        <div className="border-t mt-1" style={{ borderColor: 'var(--border)' }}>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition text-left"
                          >
                            <LogOut size={16} style={{ color: 'var(--error)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--error)' }}>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Login Button ── */
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              style={{ color: 'var(--text-primary)' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav
            className="md:hidden pb-4 border-t flex flex-col gap-3 pt-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <Link href="/products" onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--text-secondary)' }}>Products</Link>
            <Link href="/orders"   onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
            <Link href="/about"    onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/contact"  onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--text-secondary)' }}>Contact</Link>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--primary)' }}>My Profile</Link>
                <button onClick={handleSignOut} className="text-left font-medium" style={{ color: 'var(--error)' }}>Sign Out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="font-medium" style={{ color: 'var(--primary)' }}>Login</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

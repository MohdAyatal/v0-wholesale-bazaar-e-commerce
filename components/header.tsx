'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, LogIn, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const WHATSAPP_NUMBER = '8840130533'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello, I would like to know more about your products.`, '_blank')
  }

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
            <Link href="/about" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>About</Link>
          </nav>

          {/* Right side - Search & Cart & Login & WhatsApp */}
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
              <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--secondary)' }}>0</span>
            </Link>

            <button 
              onClick={openWhatsApp}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-90 text-white"
              style={{ backgroundColor: '#25D366' }}
              title="Contact on WhatsApp"
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>

            <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:opacity-80" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-primary)' }}>
              <LogIn size={18} />
              Login
            </Link>

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" style={{ color: 'var(--text-primary)' }}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--border)' }}>
            <Link href="/products" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Products</Link>
            <Link href="/about" className="font-medium transition hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <button 
              onClick={openWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white w-full justify-center"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <Link href="/login" className="font-medium transition hover:opacity-80" style={{ color: 'var(--primary)' }}>Login</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

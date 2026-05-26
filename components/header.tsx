'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bold text-xl tracking-tight">
            <span className="text-pink-600">Wholesale</span>
            <span className="text-purple-600"> Baazar</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium transition">Products</Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium transition">Suppliers</Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 font-medium transition">About</Link>
          </nav>

          {/* Right side - Search & Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent ml-2 outline-none text-sm w-32 text-gray-700"
              />
            </div>
            
            <Link href="/cart" className="relative text-gray-700 hover:text-pink-600 transition">
              <ShoppingBag size={24} />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
            </Link>

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t flex flex-col gap-3">
            <Link href="/products" className="text-gray-700 hover:text-pink-600">Products</Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600">Suppliers</Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600">About</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

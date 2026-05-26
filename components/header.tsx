'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-white">FairPath</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="#categories" className="text-slate-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/suppliers" className="text-slate-300 hover:text-white transition-colors">
              Suppliers
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-slate-800"
          >
            <nav className="flex flex-col gap-3 pt-4">
              <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
                Products
              </Link>
              <Link href="#categories" className="text-slate-300 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/suppliers" className="text-slate-300 hover:text-white transition-colors">
                Suppliers
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                About
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

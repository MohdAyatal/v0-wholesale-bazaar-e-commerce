'use client'

import Header from '@/components/header'
import { MapPin, Phone, Mail, Check, Star } from 'lucide-react'

const suppliers = [
  {
    id: 1,
    name: 'Prayagraj Women Fashion',
    category: 'Women',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000001',
    email: 'info@prayagraj-fashion.com',
    verified: true,
    rating: 4.8,
    reviews: 245,
    description: 'Premium womens clothing supplier with latest fashion trends',
    yearsInBusiness: 15
  },
  {
    id: 2,
    name: 'Modern Wear Co.',
    category: 'Men',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000002',
    email: 'sales@modernwear.com',
    verified: true,
    rating: 4.6,
    reviews: 189,
    description: 'Leading manufacturer of mens formal wear and casual clothing',
    yearsInBusiness: 12
  },
  {
    id: 3,
    name: 'Kids Fashion Studio',
    category: 'Kids',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000003',
    email: 'contact@kidsfashion.com',
    verified: true,
    rating: 4.7,
    reviews: 167,
    description: 'Colorful and trendy kids clothing collection for all ages',
    yearsInBusiness: 10
  },
  {
    id: 4,
    name: 'Home and Kitchen Essentials',
    category: 'Home and Kitchen',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000004',
    email: 'info@homeandkitchen.com',
    verified: true,
    rating: 4.9,
    reviews: 312,
    description: 'Complete range of home decor and kitchen products',
    yearsInBusiness: 18
  },
  {
    id: 5,
    name: 'Accessories Outlet',
    category: 'Accessories',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000005',
    email: 'wholesale@accessories.com',
    verified: true,
    rating: 4.5,
    reviews: 143,
    description: 'Complete range of jewelry and fashion accessories',
    yearsInBusiness: 8
  },
  {
    id: 6,
    name: 'Premium Wholesale Hub',
    category: 'Women',
    location: 'Prayagraj, UP',
    phone: '+91-9999-000006',
    email: 'hello@wholesale.com',
    verified: true,
    rating: 4.7,
    reviews: 198,
    description: 'Multi-category wholesale supplier for women, men and kids',
    yearsInBusiness: 14
  },
]

export default function SuppliersPage() {
  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Verified Suppliers
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Connect directly with premium fashion wholesale suppliers in Prayagraj. All suppliers are verified and rated by our community.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>6</p>
              <p style={{ color: 'var(--text-secondary)' }}>Verified Suppliers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--secondary)' }}>100%</p>
              <p style={{ color: 'var(--text-secondary)' }}>Quality Assured</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>4.7★</p>
              <p style={{ color: 'var(--text-secondary)' }}>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>Our Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="rounded-xl border p-6 hover:shadow-lg transition"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {supplier.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--secondary)' }}>
                      {supplier.category}
                    </p>
                  </div>
                  {supplier.verified && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--surface)' }}>
                      <Check size={16} style={{ color: 'var(--success)' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {supplier.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(supplier.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {supplier.rating}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    ({supplier.reviews})
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} style={{ color: 'var(--primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} style={{ color: 'var(--primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} style={{ color: 'var(--primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{supplier.email}</span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    ✓ {supplier.yearsInBusiness} years in business
                  </div>
                </div>

                {/* Action */}
                <button
                  className="w-full py-2 rounded-lg font-semibold transition text-white hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Contact Supplier
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Order CTA */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Need Bulk Orders?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Contact our suppliers directly for wholesale pricing and custom arrangements
          </p>
          <button
            className="px-8 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            Request Bulk Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

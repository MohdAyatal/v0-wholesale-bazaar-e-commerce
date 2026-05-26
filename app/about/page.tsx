'use client'

import Header from '@/components/header'
import { MapPin, Phone, Mail, Globe, Users, Shield } from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    alert('Thank you for your inquiry. We will get back to you soon!')
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            About Wholesale Baazar
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Your gateway to premium wholesale fashion from Prayagraj
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Who We Are
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                Wholesale Baazar is India&apos;s premier online marketplace connecting fashion enthusiasts with verified wholesale suppliers from Prayagraj. We specialize in ethnic wear, casual clothing, bridal collections, kids fashion, and accessories.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                With over 15 years of combined experience in the fashion industry, our suppliers offer authentic quality products at competitive wholesale prices. Every supplier on our platform is carefully verified to ensure you receive the best products and service.
              </p>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Whether you&apos;re a retailer, reseller, or bulk buyer, Wholesale Baazar makes it easy to find and connect with premium fashion wholesalers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <Users size={40} style={{ color: 'var(--primary)' }} className="mx-auto mb-4" />
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>500+</p>
                <p style={{ color: 'var(--text-secondary)' }}>Active Buyers</p>
              </div>
              <div className="p-6 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <Globe size={40} style={{ color: 'var(--secondary)' }} className="mx-auto mb-4" />
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>6</p>
                <p style={{ color: 'var(--text-secondary)' }}>Verified Suppliers</p>
              </div>
              <div className="p-6 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <Shield size={40} style={{ color: 'var(--accent)' }} className="mx-auto mb-4" />
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>100%</p>
                <p style={{ color: 'var(--text-secondary)' }}>Quality Assured</p>
              </div>
              <div className="p-6 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <MapPin size={40} style={{ color: 'var(--primary)' }} className="mx-auto mb-4" />
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Prayagraj</p>
                <p style={{ color: 'var(--text-secondary)' }}>Based in India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--text-primary)' }}>
            Visit Our Location
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.8293896850453!2d81.84308!3d25.434073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398d5b5b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sPrayagraj%2C%20Uttar%20Pradesh%20211001%2C%20India!5e0!3m2!1sen!2sin!4v1234567890"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Get in Touch
                </h3>
              </div>

              <div className="flex gap-4">
                <MapPin size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Address</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Prayagraj Fashion Hub<br />
                    Prayagraj, Uttar Pradesh 211001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone size={24} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Phone</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>+91-9876-543210</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Email</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>info@wholesalebaazar.com</p>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Business Hours</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p style={{ color: 'var(--text-secondary)' }}>Saturday: 10:00 AM - 4:00 PM</p>
                <p style={{ color: 'var(--text-secondary)' }}>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
            Request Bulk Order Quote
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            Contact us for wholesale pricing and custom bulk orders
          </p>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border p-8"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
                placeholder="Tell us about your bulk order requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Send Inquiry
            </button>
          </form>
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

'use client'

import Header from '@/components/header'
import { MapPin, Phone, Mail, Globe, Users, Shield } from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Hi, I'm ${formData.name} from ${formData.company || 'N/A'}. ${formData.message} Contact: ${formData.email}, ${formData.phone}`
    window.open(`https://wa.me/918840130533?text=${encodeURIComponent(msg)}`, '_blank')
    setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            About Wholesale Baazar
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Your trusted wholesale fashion partner from Prayagraj
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Who We Are
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                Wholesale Baazar is a Prayagraj-based wholesale supplier of premium fashion for men, women, and kids. We also stock home & kitchen essentials and health supplements — all at competitive wholesale prices.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                Whether you are a retailer, reseller, or bulk buyer, we make it easy to source quality products directly from our warehouse in Jhunsi, Prayagraj.
              </p>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                COD available. Free shipping above ₹999. GST invoices on bulk orders.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Users size={40} style={{ color: 'var(--primary)' }} />, value: 'PAN India', label: 'Delivery' },
                { icon: <Globe size={40} style={{ color: 'var(--secondary)' }} />, value: '5+', label: 'Categories' },
                { icon: <Shield size={40} style={{ color: 'var(--accent)' }} />, value: '100%', label: 'Quality Assured' },
                { icon: <MapPin size={40} style={{ color: 'var(--primary)' }} />, value: 'Prayagraj', label: 'Based in India' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="mx-auto mb-4 flex justify-center">{item.icon}</div>
                  <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--text-primary)' }}>
            Visit Our Store
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.4!2d81.8920!3d25.4538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAnwar+Market+Jhunsi+Prayagraj!5e0!3m2!1sen!2sin!4v1"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contact Details</h3>

              <div className="flex gap-4">
                <MapPin size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Address</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Ground Floor, Anwar Market, Jhunsi<br />
                    Prayagraj, Uttar Pradesh 211001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone size={24} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Phone & WhatsApp</h4>
                  <a href="tel:+918840130533" style={{ color: 'var(--text-secondary)' }}>+91 88401 30533</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Email</h4>
                  <a href="mailto:wholesalebazaar.support@gmail.com" style={{ color: 'var(--text-secondary)' }}>
                    wholesalebazaar.support@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Business Hours</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Monday – Saturday: 9:00 AM – 8:00 PM</p>
                <p style={{ color: 'var(--text-secondary)' }}>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Form — sends to WhatsApp */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
            Request Bulk Order Quote
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            Fill the form below — it will open WhatsApp with your details pre-filled so we can reply fast.
          </p>

          {submitted && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm text-center"
              style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              ✅ Opening WhatsApp... We will reply within 24 hours!
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-xl border p-8 space-y-6"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name *', key: 'name', type: 'text', required: true },
                { label: 'Email *', key: 'email', type: 'email', required: true },
                { label: 'Phone *', key: 'phone', type: 'tel', required: true },
                { label: 'Company Name', key: 'company', type: 'text', required: false },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</label>
                  <input
                    type={type}
                    required={required}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what products you need, quantity, and budget..."
                className="w-full px-4 py-2.5 rounded-xl border outline-none resize-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}>
              💬 Send via WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2026 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

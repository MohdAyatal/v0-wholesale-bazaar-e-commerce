'use client'

import Header from '@/components/header'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: In production, this would send to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      {/* Hero Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg opacity-90">We would love to hear from you. Contact us for any inquiries or support.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
                <Phone size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Phone</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>+91-8840130533</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Available Monday to Friday, 9AM - 6PM IST</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
                <Mail size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Email</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>support@wholesalebaazar.com</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>We respond within 24 hours</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                <MapPin size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Address</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>New Delhi, India</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Headquarters location</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--border)'}}
                  required
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--border)' }}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--border)' }}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 min-h-32"
                  style={{ borderColor: 'var(--border)' }}
                  required
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Send size={18} />
                Send Message
              </button>

              {submitted && (
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                  Message sent successfully! We will get back to you soon.
                </div>
              )}
            </form>

            <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Bulk Ordering?</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
                For wholesale inquiries and bulk orders, please fill out our detailed form below to get special pricing and terms.
              </p>
              <a
                href="#bulk-order-form"
                className="inline-block px-6 py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                Bulk Order Form
              </a>
            </div>
          </div>

          {/* Google Form Embed Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Bulk Order Inquiry</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              Fill out this form for wholesale pricing and bulk orders at special rates.
            </p>
            
            <div id="bulk-order-form" className="rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="space-y-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Bulk Order Form</h3>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="business@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Product Categories Interested
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                    <option>Select categories...</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                    <option>Home and Kitchen</option>
                    <option>Multiple Categories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Estimated Order Volume (units/month)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border min-h-24"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Tell us about your business and requirements..."
                  />
                </div>

                <button
                  className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Submit Bulk Order Request
                </button>

                <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                  Or use this Google Form for detailed bulk ordering: 
                  <a href="https://forms.gle/" target="_blank" rel="noopener noreferrer" className="underline ml-1" style={{ color: 'var(--primary)' }}>
                    https://forms.gle/[YOUR_FORM_ID]
                  </a>
                </p>
              </div>
            </div>

             {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/products" className="hover:text-white transition">Products</a></li>
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@wholesalebaazar.com</li>
                <li>Phone: +91-8840130533</li>
                <li>WhatsApp: 8840130533</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Business Hours</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Monday - Friday: 9AM - 6PM</li>
                <li>Saturday: 10AM - 4PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main> 
  

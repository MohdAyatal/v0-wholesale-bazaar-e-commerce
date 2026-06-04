import Link from 'next/link'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl">
                <span style={{ color: 'var(--primary-light, #14B8A6)' }}>Wholesale</span>
                <span style={{ color: 'var(--secondary, #FF6B6B)' }}> Baazar</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium fashion marketplace connecting verified suppliers with wholesale buyers across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[['products','Products'],['suppliers','Suppliers'],['about','About Us'],['contact','Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={`/${href}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[['#','FAQ'],['#','Shipping Info'],['#','Return Policy'],['#','Privacy Policy']].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} style={{ color: 'var(--primary-light, #14B8A6)' }} />
                <a href="mailto:info@wholesalebaazar.in" className="text-gray-400 hover:text-white text-sm">
                  Wholesalebazaar.support@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} style={{ color: 'var(--primary-light, #14B8A6)' }} />
                <span className="text-gray-400 text-sm">+91-9876-543210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} style={{ color: 'var(--primary-light, #14B8A6)', marginTop: 2 }} />
                <span className="text-gray-400 text-sm">Prayagraj, Uttar Pradesh 211001, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Wholesale Baazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

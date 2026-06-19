'use client'

import { Shield, Truck, HeadphonesIcon, Tag } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: '100% Authentic',
      description: 'All products verified'
    },
   {
      icon: Truck,
      title: 'Free Shipping ₹999+',
      description: 'Fast Pan-India delivery in 3–5 days'
    },
    {
      icon: Tag,
      title: 'Lowest Wholesale Prices',
      description: 'Direct from manufacturer, no middlemen'
    },
    {
      icon: HeadphonesIcon,
      title: 'WhatsApp Support',
      description: 'Mon–Sat 9AM–8PM instant help'
    }
    ]

  return (
    <section className="py-12 border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">
                  <div 
                    className="p-4 rounded-full"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <Icon size={32} style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {badge.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {badge.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

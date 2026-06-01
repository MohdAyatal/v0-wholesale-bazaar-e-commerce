'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { Package, ShoppingBag, Eye, Search } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  customer_email: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  delivered:  { bg: '#D1FAE5', color: '#065F46', icon: '✅' },
  shipped:    { bg: '#DBEAFE', color: '#1E40AF', icon: '🚚' },
  processing: { bg: '#FEF3C7', color: '#92400E', icon: '⏳' },
  pending:    { bg: '#F3F4F6', color: '#374151', icon: '🕐' },
  cancelled:  { bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
}

export default function MyOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [user, setUser]         = useState<any>(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const supabase = createClient()

      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      // Fetch real orders for this user
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
      }

      setOrders(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const filtered = orders.filter(o => {
    const matchSearch =
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === 'all' || o.status?.toLowerCase() === filter

    return matchSearch && matchFilter
  })

  const getStatusStyle = (status: string) =>
    STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES['pending']

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <Package size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Orders
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Not logged in */}
        {!loading && !user && (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Please log in to view your orders
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your account to see your order history.
            </p>
            <Link href="/login">
              <button
                className="px-8 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Sign In
              </button>
            </Link>
          </div>
        )}

        {/* Logged in */}
        {user && (
          <>
            {/* Search + Filter */}
            <div className="flex gap-3 mb-6 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order number or email..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border text-sm outline-none"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border p-5 animate-pulse"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', height: 80 }}
                  />
                ))}
              </div>
            )}

            {/* Empty state — no orders at all */}
            {!loading && orders.length === 0 && (
              <div
                className="rounded-2xl border p-16 text-center"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  No orders yet
                </h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                  You haven&apos;t placed any orders yet. Start shopping!
                </p>
                <Link href="/products">
                  <button
                    className="px-8 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Browse Products
                  </button>
                </Link>
              </div>
            )}

            {/* No search results */}
            {!loading && orders.length > 0 && filtered.length === 0 && (
              <div
                className="rounded-2xl border p-12 text-center"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                <Search size={40} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No orders match your search.
                </p>
              </div>
            )}

            {/* Orders list */}
            {!loading && filtered.length > 0 && (
              <div className="space-y-4">
                {filtered.map((order) => {
                  const s = getStatusStyle(order.status)
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border p-5 flex items-center justify-between gap-4 hover:shadow-md transition"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                    >
                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <span style={{ fontSize: 24 }}>{s.icon}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-4">
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          ₹{order.total_amount?.toLocaleString('en-IN')}
                        </p>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{ backgroundColor: s.bg, color: s.color }}
                        >
                          {order.status || 'Pending'}
                        </span>
                        <Link href={`/orders/${order.id}`}>
                          <button
                            className="p-2 rounded-lg transition hover:opacity-70"
                            style={{ backgroundColor: 'var(--background)' }}
                            title="View order"
                          >
                            <Eye size={18} style={{ color: 'var(--primary)' }} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Summary */}
            {!loading && orders.length > 0 && (
              <p className="text-xs text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
                Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}

        {/* Help section */}
        <div
          className="mt-12 rounded-2xl p-6"
          style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
        >
          <h3 className="font-bold mb-1" style={{ color: '#1E40AF' }}>Need Help?</h3>
          <p className="text-sm mb-4" style={{ color: '#3B82F6' }}>
            Can&apos;t find your order or need to track it? Contact our support team.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/contact">
              <button
                className="px-5 py-2 rounded-lg text-sm font-semibold border transition hover:opacity-80"
                style={{ borderColor: '#3B82F6', color: '#1E40AF', backgroundColor: 'white' }}
              >
                Contact Support
              </button>
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                WhatsApp Support
              </button>
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Package, Filter, Download, Edit2, Eye, Trash2, X, Check } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  tracking_number?: string
  items: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-orange-100 text-orange-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([])
  const [loading, setLoading]       = useState(true)
  const [filterStatus, setFilter]   = useState('all')
  const [sortBy, setSortBy]         = useState('newest')
  const [selectedOrder, setSelected]= useState<Order | null>(null)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editTracking, setEditTracking] = useState('')
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?all=true')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return
    try {
      await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setOrders(prev => prev.filter(o => o.id !== id))
      setMsg('Order deleted.')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) { console.error(e) }
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          status: editStatus,
          tracking_number: editTracking
        })
      })
      setOrders(prev => prev.map(o =>
        o.id === editingId
          ? { ...o, status: editStatus, tracking_number: editTracking }
          : o
      ))
      setEditingId(null)
      setMsg('Order updated!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const parseItems = (items: string) => {
    try { return JSON.parse(items) } catch { return [] }
  }

  const filtered = orders
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'highest') return b.total_amount - a.total_amount
      if (sortBy === 'lowest') return a.total_amount - b.total_amount
      return 0
    })

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    transit:   orders.filter(o => ['shipped','processing'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue:   orders.reduce((s, o) => s + (o.total_amount || 0), 0)
  }

  const exportCSV = () => {
    const rows = [
      ['Order #','Customer','Email','Phone','Amount','Status','Payment','Date'],
      ...orders.map(o => [
        o.order_number, o.customer_name, o.customer_email,
        o.customer_phone, o.total_amount, o.status,
        o.payment_method, new Date(o.created_at).toLocaleDateString()
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = 'orders.csv'
    a.click()
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

      {/* Header */}
      <div className="bg-white border-b px-6 py-6" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl text-white" style={{ backgroundColor: 'var(--primary)' }}>
                <Package size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Order Management
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Real orders from Supabase
                </p>
              </div>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Orders', value: stats.total,    bg: '#EFF6FF', color: '#1D4ED8' },
              { label: 'Pending',      value: stats.pending,  bg: '#FFFBEB', color: '#92400E' },
              { label: 'In Transit',   value: stats.transit,  bg: '#F5F3FF', color: '#6D28D9' },
              { label: 'Delivered',    value: stats.delivered, bg: '#ECFDF5', color: '#065F46' },
              { label: 'Revenue',      value: `₹${stats.revenue.toLocaleString('en-IN')}`, bg: '#ECFDF5', color: '#065F46' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {msg && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
            ✅ {msg}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4"
          style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Orders placed by customers will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    {['Order','Customer','Amount','Status','Payment','Date','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                        style={{ color: 'var(--text-secondary)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id}
                      className="border-t hover:bg-gray-50 transition"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {order.order_number}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {parseItems(order.items).length} item(s)
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {order.customer_name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {order.customer_email}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {order.customer_phone}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                          ₹{order.total_amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                          {order.payment_method}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {editingId === order.id ? (
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value)}
                            className="px-2 py-1 border rounded text-xs outline-none"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.payment_status === 'paid' || order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          {editingId === order.id ? (
                            <>
                              <button onClick={handleSaveEdit} disabled={saving}
                                className="p-1.5 rounded hover:bg-green-50 transition"
                                title="Save">
                                <Check size={16} style={{ color: '#059669' }} />
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="p-1.5 rounded hover:bg-red-50 transition"
                                title="Cancel">
                                <X size={16} style={{ color: '#DC2626' }} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setSelected(order)}
                                className="p-1.5 rounded hover:bg-gray-100 transition"
                                title="View">
                                <Eye size={16} style={{ color: 'var(--text-secondary)' }} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(order.id)
                                  setEditStatus(order.status)
                                  setEditTracking(order.tracking_number || '')
                                }}
                                className="p-1.5 rounded hover:bg-gray-100 transition"
                                title="Edit Status">
                                <Edit2 size={16} style={{ color: 'var(--text-secondary)' }} />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="p-1.5 rounded hover:bg-red-50 transition"
                                title="Delete">
                                <Trash2 size={16} style={{ color: '#DC2626' }} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedOrder.order_number}
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:opacity-70">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                ['Customer', selectedOrder.customer_name],
                ['Email', selectedOrder.customer_email],
                ['Phone', selectedOrder.customer_phone],
                ['Address', selectedOrder.shipping_address],
                ['Payment', selectedOrder.payment_method],
                ['Payment Status', selectedOrder.payment_status],
                ['Order Status', selectedOrder.status],
                ['Total', `₹${selectedOrder.total_amount?.toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="font-medium text-right max-w-[60%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}

              <div>
                <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Items</p>
                {parseItems(selectedOrder.items).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span>{item.product_name || item.name} × {item.quantity}</span>
                    <span>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        let query = supabase.from('orders').select('*')

        if (sortBy === 'date') {
          query = query.order('created_at', { ascending: sortOrder === 'asc' })
        } else {
          query = query.order('total_amount', { ascending: sortOrder === 'asc' })
        }

        const { data, error } = await query.limit(20)

        if (error) throw error
        setOrders(data || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [sortBy, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400'
      case 'processing':
        return 'bg-blue-600/20 text-blue-400'
      case 'shipped':
        return 'bg-purple-600/20 text-purple-400'
      case 'delivered':
        return 'bg-green-600/20 text-green-400'
      default:
        return 'bg-slate-600/20 text-slate-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-800 rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Customer</th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white"
                onClick={() => {
                  if (sortBy === 'date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('date')
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Date
                  {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white"
                onClick={() => {
                  if (sortBy === 'amount') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('amount')
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Amount
                  {sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Payment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white">{order.order_number}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-slate-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-400 hover:text-white">
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

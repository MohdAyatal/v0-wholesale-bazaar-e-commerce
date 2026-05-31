'use client';

import { useState } from 'react';
import { Package, Filter, Download, Edit2, Eye, Trash2, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminOrder {
  id: string;
  order_number: string;
  user_email: string;
  user_phone: string;
  total_amount: number;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  items_count: number;
}

const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: '1',
    order_number: 'WB-001-2024',
    user_email: 'customer1@example.com',
    user_phone: '9876543210',
    total_amount: 2999,
    final_amount: 3149,
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'razorpay',
    tracking_number: 'TRK-2024-001',
    created_at: '2024-05-26',
    items_count: 3
  },
  {
    id: '2',
    order_number: 'WB-002-2024',
    user_email: 'customer2@example.com',
    user_phone: '9876543211',
    total_amount: 5999,
    final_amount: 6299,
    status: 'shipped',
    payment_status: 'completed',
    payment_method: 'card',
    tracking_number: 'TRK-2024-002',
    created_at: '2024-05-29',
    items_count: 1
  },
  {
    id: '3',
    order_number: 'WB-003-2024',
    user_email: 'customer1@example.com',
    user_phone: '9876543210',
    total_amount: 1499,
    final_amount: 1574,
    status: 'processing',
    payment_status: 'completed',
    payment_method: 'upi',
    tracking_number: 'TRK-2024-003',
    created_at: '2024-05-30',
    items_count: 2
  },
  {
    id: '4',
    order_number: 'WB-004-2024',
    user_email: 'customer3@example.com',
    user_phone: '9876543212',
    total_amount: 3499,
    final_amount: 3674,
    status: 'confirmed',
    payment_status: 'completed',
    payment_method: 'netbanking',
    tracking_number: undefined,
    created_at: '2024-05-31',
    items_count: 1
  },
  {
    id: '5',
    order_number: 'WB-005-2024',
    user_email: 'customer2@example.com',
    user_phone: '9876543211',
    total_amount: 799,
    final_amount: 839,
    status: 'pending',
    payment_status: 'pending',
    payment_method: 'cash_on_delivery',
    tracking_number: undefined,
    created_at: '2024-05-31',
    items_count: 1
  }
];

const getStatusBadge = (status: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    processing: { bg: 'bg-orange-100', text: 'text-orange-800' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' }
  };
  const color = colors[status] || colors.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const getPaymentStatusBadge = (status: string) => {
  const color = status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = ADMIN_ORDERS.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'highest':
        return b.final_amount - a.final_amount;
      case 'lowest':
        return a.final_amount - b.final_amount;
      default:
        return 0;
    }
  });

  const stats = {
    total: ADMIN_ORDERS.length,
    pending: ADMIN_ORDERS.filter(o => o.status === 'pending').length,
    shipped: ADMIN_ORDERS.filter(o => o.status === 'shipped' || o.status === 'processing').length,
    delivered: ADMIN_ORDERS.filter(o => o.status === 'delivered').length,
    revenue: ADMIN_ORDERS.reduce((sum, o) => sum + o.final_amount, 0)
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order Management</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage and track all customer orders</p>
              </div>
            </div>
            <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Orders', value: stats.total, color: 'bg-blue-50' },
              { label: 'Pending', value: stats.pending, color: 'bg-yellow-50' },
              { label: 'In Transit', value: stats.shipped, color: 'bg-purple-50' },
              { label: 'Delivered', value: stats.delivered, color: 'bg-green-50' },
              { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: 'bg-green-50' }
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-lg p-4`}>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border p-4 mb-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background-secondary)' }}
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

            <div className="flex-1">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background-secondary)' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--background-secondary)', borderBottom: `1px solid var(--border)` }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order, idx) => (
                  <tr key={order.id} style={{ borderBottom: `1px solid var(--border)` }} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.order_number}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{order.items_count} items</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{order.user_email}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{order.user_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{order.final_amount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {order.tracking_number || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded transition"
                          title="Edit Order"
                        >
                          <Edit2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing <span className="font-medium">{sortedOrders.length}</span> of <span className="font-medium">{ADMIN_ORDERS.length}</span> orders
          </p>
          <div className="flex gap-2">
            <Button variant="outline" style={{ borderColor: 'var(--border)' }}>Previous</Button>
            <Button variant="outline" style={{ borderColor: 'var(--border)' }}>1</Button>
            <Button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>2</Button>
            <Button variant="outline" style={{ borderColor: 'var(--border)' }}>Next</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

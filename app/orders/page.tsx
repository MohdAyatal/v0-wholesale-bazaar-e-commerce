'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  final_amount: number;
  payment_status: string;
  tracking_number?: string;
  created_at: string;
  estimated_delivery_date?: string;
  items?: OrderItem[];
  user_email: string;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: '1',
    order_number: 'WB-001-2024',
    status: 'delivered',
    final_amount: 3149,
    payment_status: 'completed',
    tracking_number: 'TRK-2024-001',
    created_at: '2024-05-26',
    estimated_delivery_date: '2024-06-05',
    user_email: 'customer1@example.com',
    items: [
      { id: '1', product_name: 'Stainless Steel Watch', quantity: 1, unit_price: 1999, total_price: 1999 },
      { id: '2', product_name: 'Premium Cotton T-Shirt', quantity: 2, unit_price: 299, total_price: 598 },
      { id: '3', product_name: 'Leather Belt', quantity: 1, unit_price: 399, total_price: 399 }
    ]
  },
  {
    id: '2',
    order_number: 'WB-002-2024',
    status: 'shipped',
    final_amount: 6299,
    payment_status: 'completed',
    tracking_number: 'TRK-2024-002',
    created_at: '2024-05-29',
    estimated_delivery_date: '2024-06-08',
    user_email: 'customer2@example.com',
    items: [
      { id: '4', product_name: 'Microwave Oven', quantity: 1, unit_price: 5999, total_price: 5999 }
    ]
  },
  {
    id: '3',
    order_number: 'WB-003-2024',
    status: 'processing',
    final_amount: 1574,
    payment_status: 'completed',
    tracking_number: 'TRK-2024-003',
    created_at: '2024-05-30',
    estimated_delivery_date: '2024-06-09',
    user_email: 'customer1@example.com',
    items: [
      { id: '5', product_name: 'Gold-Plated Necklace', quantity: 1, unit_price: 499, total_price: 499 },
      { id: '6', product_name: 'Designer Sunglasses', quantity: 1, unit_price: 799, total_price: 799 }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'shipped':
      return <Truck className="w-5 h-5 text-blue-600" />;
    case 'processing':
      return <Clock className="w-5 h-5 text-orange-600" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case 'cancelled':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Package className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'shipped':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'processing':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = SAMPLE_ORDERS.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Orders</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Track and manage your orders</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <Input
                type="text"
                placeholder="Search by order number or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background-secondary)'
                }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background-secondary)',
                color: 'var(--text-primary)'
              }}
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
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
            <Link href="/products">
              <Button className="mt-6" style={{ backgroundColor: 'var(--primary)' }}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-4 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(order.status)}
                    <div className="text-left">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {order.order_number}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Ordered on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ₹{order.final_amount.toLocaleString('en-IN')}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <Eye className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </button>

                {/* Order Details - Expanded */}
                {expandedOrder === order.id && (
                  <div className="border-t p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background-secondary)' }}>
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left Column - Items */}
                      <div>
                        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Order Items</h3>
                        <div className="space-y-3">
                          {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between items-start pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {item.product_name}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                ₹{item.total_price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column - Tracking & Info */}
                      <div>
                        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tracking Information</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tracking Number</p>
                            <p className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                              {order.tracking_number || 'Not yet assigned'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Estimated Delivery</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Payment Status</p>
                            <p className="font-medium capitalize" style={{ color: order.payment_status === 'completed' ? 'var(--primary)' : 'var(--text-primary)' }}>
                              {order.payment_status}
                            </p>
                          </div>
                          <button
                            className="w-full mt-4 px-4 py-2 rounded-lg border transition"
                            style={{
                              borderColor: 'var(--primary)',
                              color: 'var(--primary)',
                              backgroundColor: 'transparent'
                            }}
                          >
                            View Tracking Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-800 text-sm mb-4">
            Can't find your order or need to track it? Contact our support team.
          </p>
          <div className="flex gap-4">
            <Link href="/contact">
              <Button variant="outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                Contact Support
              </Button>
            </Link>
            <button
              onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              WhatsApp Support
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

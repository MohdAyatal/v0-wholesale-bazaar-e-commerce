'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ShoppingCart, Package, Users, TrendingUp, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminOrdersTable from './admin-orders-table'
import AdminProductsTable from './admin-products-table'

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalSuppliers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview')
  const router = useRouter()

  useEffect(() => {
    // Mock stats calculation
    setStats({
      totalOrders: 1250,
      totalProducts: 120,
      totalSuppliers: 10,
      totalRevenue: 156800,
    })
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your wholesale platform</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'from-blue-600 to-blue-700' },
          { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'from-purple-600 to-purple-700' },
          { label: 'Suppliers', value: stats.totalSuppliers, icon: Users, color: 'from-green-600 to-green-700' },
          { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'from-orange-600 to-orange-700' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">{stat.label}</h3>
              <stat.icon size={24} className="opacity-60" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-800">
        <div className="flex gap-8">
          {['overview', 'orders', 'products'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Revenue Chart</h2>
              <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center text-slate-500">
                <BarChart3 size={32} />
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                  Add Product
                </button>
                <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                  Verify Supplier
                </button>
                <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && <AdminOrdersTable />}
        {activeTab === 'products' && <AdminProductsTable />}
      </motion.div>
    </div>
  )
}

'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category_id: string
  image_urls: string[]
  discount_percent: number
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 })

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category_id: '',
    image_urls: [],
    discount_percent: 0,
    description: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('*')
      setCategories(cats || [])

      // Fetch products
      const { data: prods, count } = await supabase.from('products').select('*', { count: 'exact' })
      setProducts(prods || [])

      // Calculate stats
      const totalOrdersData = await supabase.from('orders').select('*', { count: 'exact' })
      const totalRevenueData = await supabase
        .from('orders')
        .select('total_amount')

      const calculatedRevenue = totalRevenueData.data?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0

      setStats({
        totalProducts: count || 0,
        totalOrders: totalOrdersData.count || 0,
        totalRevenue: calculatedRevenue
      })

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      alert('Please fill in required fields')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        // Update existing product
        await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId)
      } else {
        // Add new product
        await supabase.from('products').insert([formData])
      }

      fetchData()
      setShowModal(false)
      setEditingId(null)
      setFormData({
        name: '',
        price: 0,
        category_id: '',
        image_urls: [],
        discount_percent: 0,
        description: ''
      })
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const supabase = createClient()
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      image_urls: product.image_urls || [],
      discount_percent: product.discount_percent || 0,
      description: ''
    })
    setEditingId(product.id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({
      name: '',
      price: 0,
      category_id: '',
      image_urls: [],
      discount_percent: 0,
      description: ''
    })
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: 'var(--background)' }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p style={{ color: 'var(--text-secondary)' }}>Loading admin dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your wholesale inventory</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Products</p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--primary)' }}>
              {stats.totalProducts}
            </p>
          </div>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Orders</p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--secondary)' }}>
              {stats.totalOrders}
            </p>
          </div>
          <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Revenue</p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--accent)' }}>
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Category
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t hover:opacity-80 transition"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                  >
                    <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>
                      {product.name}
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                      {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--primary)' }}>
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                      {product.discount_percent}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 rounded-lg transition hover:opacity-80"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          <Edit2 size={18} style={{ color: 'var(--primary)' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-lg transition hover:opacity-80"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          <Trash2 size={18} style={{ color: 'var(--secondary)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-1">
                <X size={24} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Price *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Discount %
                </label>
                <input
                  type="number"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-lg font-semibold border transition hover:opacity-90"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

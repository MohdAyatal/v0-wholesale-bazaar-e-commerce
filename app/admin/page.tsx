'use client'

import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Play } from 'lucide-react' 
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  category_id: string
  image_urls: string[]
  discount_percent: number
}

interface SlideItem {
  id: string
  title: string
  description: string
  media_url: string
  type: 'image' | 'video'
  order: number
  active: boolean
}

interface ProductFormData {
  name: string
  price: number
  category_id: string
  image_urls: string[]
  discount_percent: number
  description: string
}

export default function AdminDashboard() {
  const router = useRouter() 
  useEffect(() => {
  const handleUnload = () => {
    sessionStorage.removeItem('wb_admin_token')
    sessionStorage.removeItem('wb_admin_expiry')
  }

  window.addEventListener('beforeunload', handleUnload)

  return () => {
    window.removeEventListener('beforeunload', handleUnload)
  }
}, [])

useEffect(() => {
  const token = sessionStorage.getItem('wb_admin_token')
  const expiry = sessionStorage.getItem('wb_admin_expiry')

if (token !== 'wb_admin_2025_secure') {
    router.push('/admin/login')
    return
  }

  if (Date.now() > Number(expiry)) {
    sessionStorage.removeItem('wb_admin_token')
    sessionStorage.removeItem('wb_admin_expiry')
    router.push('/admin/login')
    return
  }
}, [router])
  const [tab, setTab] = useState<'products' | 'slideshow' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [slides, setSlides] = useState<SlideItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 })

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category_id: '',
    image_urls: [] as string[],
    discount_percent: 0,
    description: ''
  })

  const [slideFormData, setSlideFormData] = useState({
    title: '',
    description: '',
    media_url: '',
    type: 'image' as 'image' | 'video',
    order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

 const fetchData = async () => {
  try {
    setLoading(true)

    const supabase = createClient()

    const [
      categoriesRes,
      productsRes,
      slidesRes,
      ordersCountRes,
      revenueRes
    ] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('products').select('*', { count: 'exact' }),
      supabase.from('slideshow').select('*').order('order', { ascending: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount')
    ])

    setCategories(categoriesRes.data || [])
    setProducts(productsRes.data || [])
    setSlides(slidesRes.data || [])

    const calculatedRevenue =
      revenueRes.data?.reduce(
        (sum: number, order: any) =>
          sum + (order.total_amount || 0),
        0
      ) || 0

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersCountRes.count || 0,
      totalRevenue: calculatedRevenue
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
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
        await supabase.from('products').update(formData).eq('id', editingId)
      } else {
        await supabase.from('products').insert([formData])
      }

      fetchData()
      setShowModal(false)
      setEditingId(null)
      setFormData({
        name: '',
        price: 0,
        category_id: '',
        image_urls: [] as string[],
        discount_percent: 0,
        description: ''
      })
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleAddSlide = async () => {
    if (!slideFormData.media_url) {
      alert('Please provide a media URL')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        await supabase.from('slideshow').update(slideFormData).eq('id', editingId)
      } else {
        await supabase.from('slideshow').insert([{ ...slideFormData, order: slides.length }])
      }

      fetchData()
      setShowModal(false)
      setEditingId(null)
      setSlideFormData({
        title: '',
        description: '',
        media_url: '',
        type: 'image',
        order: 0
      })
    } catch (error) {
      console.error('Error saving slide:', error)
      alert('Error saving slide')
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

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const supabase = createClient()
      await supabase.from('slideshow').delete().eq('id', id)
      fetchData()
    } catch (error) {
      console.error('Error deleting slide:', error)
      alert('Error deleting slide')
    }
  }

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      image_urls: (product.image_urls || []) as string[],
      discount_percent: product.discount_percent || 0,
      description: ''
    })
    setEditingId(product.id)
    setShowModal(true)
  }

  const handleEditSlide = (slide: SlideItem) => {
    setSlideFormData({
      title: slide.title,
      description: slide.description,
      media_url: slide.media_url,
      type: slide.type,
      order: slide.order
    })
    setEditingId(slide.id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({
      name: '',
      price: 0,
      category_id: '',
      image_urls: [] as string[],
      discount_percent: 0,
      description: ''
    })
    setSlideFormData({
      title: '',
      description: '',
      media_url: '',
      type: 'image',
      order: 0
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
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {(['products', 'slideshow', 'orders'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap capitalize"
              style={{
                borderBottomColor: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              {t}
            </button>
          ))}
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

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      {['Product Name', 'Category', 'Price', 'Discount', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {h}
                        </th>
                      ))}
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
          </>
        )}

        {/* ── SLIDESHOW TAB ── */}
        {tab === 'slideshow' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingId(null)
                  setSlideFormData({ title: '', description: '', media_url: '', type: 'image', order: 0 })
                  setShowModal(true)
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Plus size={20} />
                Add Slide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="rounded-lg border overflow-hidden hover:shadow-lg transition"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                >
                  <div
                    className="relative h-40 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    {slide.type === 'image' ? (
                      <ImageIcon size={40} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                    ) : (
                      <Play size={40} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {slide.title || 'Untitled'}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {slide.description || 'No description'}
                    </p>
                    <p className="text-xs mb-4 break-all" style={{ color: 'var(--text-secondary)' }}>
                      {slide.media_url}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSlide(slide)}
                        className="flex-1 p-2 rounded-lg transition hover:opacity-80 flex items-center justify-center gap-1 text-white"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="flex-1 p-2 rounded-lg transition hover:opacity-80 flex items-center justify-center gap-1 text-white"
                        style={{ backgroundColor: 'var(--secondary)' }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      {['Order Number', 'Customer Email', 'Amount', 'Status', 'Payment', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.totalOrders === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                          No orders yet. Start receiving orders and they will appear here.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center">
                          <a
                            href="/admin/orders"
                            className="px-6 py-2 rounded-lg font-medium text-white transition hover:opacity-90"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            View All Orders
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              💡 Tip: Click &quot;View All Orders&quot; to access the full order management dashboard.
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-xl p-8 max-w-md w-full"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {tab === 'products'
                  ? (editingId ? 'Edit Product' : 'Add New Product')
                  : (editingId ? 'Edit Slide' : 'Add New Slide')}
              </h2>
              <button onClick={closeModal} className="p-1">
                <X size={24} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="space-y-4">

              {/* Product Form */}
              {tab === 'products' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
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
                      className="w-full px-4 py-2 rounded-lg border outline-none"
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
                      className="w-full px-4 py-2 rounded-lg border outline-none"
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
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Enter product description"
                      rows={3}
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
                </>
              )}

              {/* Slideshow Form */}
              {tab === 'slideshow' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={slideFormData.title}
                      onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Enter slide title"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Description
                    </label>
                    <textarea
                      value={slideFormData.description}
                      onChange={(e) => setSlideFormData({ ...slideFormData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Enter slide description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Media URL *
                    </label>
                    <input
                      type="text"
                      value={slideFormData.media_url}
                      onChange={(e) => setSlideFormData({ ...slideFormData, media_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Media Type
                    </label>
                    <select
                      value={slideFormData.type}
                      onChange={(e) => setSlideFormData({ ...slideFormData, type: e.target.value as 'image' | 'video' })}
                      className="w-full px-4 py-2 rounded-lg border outline-none"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddSlide}
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
                </>
              )}

            </div>
          </div>
        </div>
      )}
      <button
  onClick={() => {
    sessionStorage.removeItem('wb_admin_token')
    sessionStorage.removeItem('wb_admin_expiry')
    router.push('/admin/login')
  }}
>
  Logout
</button>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1F2937', color: 'white' }} className="py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2025 Wholesale Baazar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

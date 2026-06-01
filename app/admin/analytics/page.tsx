'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowUp, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react'

interface DashboardData {
  metrics: {
    totalRevenue: number
    totalConversions: number
    avgOrderValue: number
    totalSessions: number
  }
  summary: any[]
  sessions: any[]
  revenue: any[]
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/v1/analytics/dashboard?days=${days}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('[Dashboard] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                days === d
                  ? 'text-white'
                  : 'bg-transparent border'
              }`}
              style={{
                backgroundColor: days === d ? 'var(--primary)' : 'transparent',
                borderColor: days === d ? 'transparent' : 'var(--border)',
                color: days === d ? 'white' : 'var(--text-secondary)',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          value={`₹${(data.metrics.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          change={12.5}
        />
        <MetricCard
          label="Total Conversions"
          value={data.metrics.totalConversions.toString()}
          icon={ShoppingCart}
          change={8.2}
        />
        <MetricCard
          label="Average Order Value"
          value={`₹${(data.metrics.avgOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          change={5.1}
        />
        <MetricCard
          label="Total Sessions"
          value={data.metrics.totalSessions.toString()}
          icon={Users}
          change={15.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Revenue Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.summary.slice(0, 10).reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Conversions by Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Purchase', value: data.revenue.filter(r => r.conversion_type === 'purchase').length },
                  { name: 'View', value: data.revenue.filter(r => r.conversion_type === 'view').length },
                  { name: 'Add to Cart', value: data.revenue.filter(r => r.conversion_type === 'add_to_cart').length },
                  { name: 'Other', value: data.revenue.filter(r => !['purchase', 'view', 'add_to_cart'].includes(r.conversion_type)).length },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sessions Trend */}
        <div className="rounded-lg border p-6 lg:col-span-2" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Session Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.summary.slice(0, 10).reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="total_sessions" fill="var(--primary)" />
              <Bar dataKey="total_page_views" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Revenue Data */}
      <div className="rounded-lg border" style={{ borderColor: 'var(--border)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recent Conversions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--surface)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Items
                </th>
              </tr>
            </thead>
            <tbody>
              {data.revenue.slice(0, 10).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                      {item.conversion_type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₹{(item.revenue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.items_count || 0}
                  </td>
                </tr>
              ))}
              {data.revenue.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    No conversion data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  icon: any
  change: number
}

function MetricCard({ label, value, icon: Icon, change }: MetricCardProps) {
  return (
    <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `var(--primary)15` }}>
          <Icon size={24} style={{ color: 'var(--primary)' }} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ArrowUp size={16} style={{ color: '#10B981' }} />
        <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
          {change}%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          vs last period
        </span>
      </div>
    </div>
  )
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import AdminDashboard from '@/components/admin/admin-dashboard'
import AdminProtection from '@/components/admin/admin-protection'

export const metadata = {
  title: 'Admin Dashboard - FairPath',
  description: 'Manage products, orders, and suppliers',
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminProtection>
        <Header />
        <AdminDashboard />
        <Footer />
      </AdminProtection>
    </main>
  )
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'

export const metadata = {
  title: 'Our Suppliers - FairPath',
  description: 'Meet our verified wholesale suppliers',
}

export default function SuppliersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Our Suppliers</h1>
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">Verified wholesale suppliers coming soon...</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
        </div>
      </div>
      <Footer />
    </main>
  )
}

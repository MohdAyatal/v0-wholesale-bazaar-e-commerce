import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductsGrid from '@/components/products-grid'
import ProductsFilters from '@/components/products-filters'
import { Suspense } from 'react'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export const metadata = {
  title: 'Products - FairPath Wholesale Marketplace',
  description: 'Browse our extensive collection of wholesale products from verified suppliers',
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Products</h1>
          <p className="text-slate-400">Browse our complete catalog of wholesale products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <Suspense fallback={<div className="bg-slate-800 rounded-lg h-96 animate-pulse" />}>
            <ProductsFilters />
          </Suspense>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg h-96 animate-pulse" />
              ))}
            </div>}>
              <ProductsGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductDetail from '@/components/product-detail'
import ProductReviews from '@/components/product-reviews'
import { Suspense } from 'react'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Product Details - FairPath',
  description: 'View detailed product information, specifications, and reviews',
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          <div className="bg-slate-800 rounded-lg h-96 animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </div>}>
          <ProductDetail productId={id} />
        </Suspense>

        <Suspense fallback={<div className="py-12 bg-slate-800 rounded-lg h-96 animate-pulse" />}>
          <ProductReviews productId={id} />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}

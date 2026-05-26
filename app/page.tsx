import HeroSection from '@/components/hero-section'
import CategoriesSection from '@/components/categories-section'
import FeaturedProducts from '@/components/featured-products'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}

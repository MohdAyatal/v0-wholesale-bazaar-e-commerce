import Header from '@/components/header'
import Footer from '@/components/footer'
import ShoppingCart from '@/components/shopping-cart'

export const metadata = {
  title: 'Shopping Cart - FairPath',
  description: 'Review your shopping cart and proceed to checkout',
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ShoppingCart />
      <Footer />
    </main>
  )
}

import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductGrid />
    </main>
  )
}


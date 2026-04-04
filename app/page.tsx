import Header from "@/components/header"
import Hero from "@/components/hero"
import PromoCarousel from "@/components/promo-carousel"
import About from "@/components/about"
import Services from "@/components/services"
import Products from "@/components/products"
import Location from "@/components/location"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PromoCarousel />
      <About />
      <Services />
      <Products />
      <Location />
      <Footer />
    </main>
  )
}

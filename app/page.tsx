import Header from "@/components/header"
import Hero from "@/components/hero"
import PromoCarousel from "@/components/promo-carousel"
import PromoVideo from "@/components/promo-video"
import About from "@/components/about"
import ServicesPreview from "@/components/services-preview"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PromoCarousel />
      <PromoVideo />
      <About />
      <ServicesPreview />
      <Footer />
    </main>
  )
}

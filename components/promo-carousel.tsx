"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { getPromotions, type Promotion } from "@/lib/supabase/data-service"

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromos()
  }, [])

  const loadPromos = async () => {
    setLoading(true)
    try {
      const data = await getPromotions()
      // Only show active promotions
      setPromos(data.filter(p => p.active))
    } catch (error) {
      console.error("Error loading promos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (promos.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [promos.length])

  if (loading || promos.length === 0) return null

  return (
    <section className="py-8 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden h-24 flex items-center justify-center">
          {promos.map((promo, index) => (
            <div
              key={promo.id}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                index === currentIndex
                  ? "opacity-100 translate-x-0"
                  : index < currentIndex
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
              }`}
            >
              {promo.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={promo.image || "/placeholder.svg"}
                    alt={promo.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold font-serif">{promo.title}</div>
                      <div className="text-sm opacity-90">{promo.description}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Sparkles className="h-6 w-6 flex-shrink-0" />
                  <div className="text-center">
                    <div className="text-2xl font-bold font-serif">{promo.title}</div>
                    <div className="text-sm opacity-90">{promo.description}</div>
                  </div>
                  {promo.badge && (
                    <div className="bg-accent-foreground text-accent px-4 py-2 rounded-md font-bold text-sm">
                      {promo.badge}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-accent-foreground w-8" : "bg-accent-foreground/40"
              }`}
              aria-label={`Go to promo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

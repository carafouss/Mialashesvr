"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { BookingDialog } from "@/components/booking-dialog"
import { getHeroContent, type HeroContent } from "@/lib/supabase/data-service"

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroContent | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    loadHeroData()
  }, [])

  const loadHeroData = async () => {
    const data = await getHeroContent()
    setHeroData(data || {
      id: "",
      image: "",
      images: [],
      title: "L'art de sublimer votre regard",
      subtitle: "Extensions de cils, micropigmentation des sourcils et soins beauté personnalisés",
      updated_at: "",
    })
  }

  // Get all images (combine main image with images array)
  const getAllImages = useCallback(() => {
    if (!heroData) return []
    const allImages: string[] = []
    if (heroData.image) allImages.push(heroData.image)
    if (heroData.images && heroData.images.length > 0) {
      heroData.images.forEach(img => {
        if (img && !allImages.includes(img)) allImages.push(img)
      })
    }
    return allImages.length > 0 ? allImages : ["/placeholder.svg"]
  }, [heroData])

  const images = getAllImages()

  // Auto-advance carousel
  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
        setIsTransitioning(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index: number) => {
    if (index === currentImageIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  const goToPrevious = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
      setIsTransitioning(false)
    }, 300)
  }

  if (!heroData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary/20">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentImageIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={img}
              alt={`Mia Lashes Institut ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Carousel Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <div className={`transition-all duration-500 ${isTransitioning ? "opacity-90 translate-y-1" : "opacity-100 translate-y-0"}`}>
          <span className="inline-block px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-medium rounded-full mb-6 animate-fade-in-up">
            Institut de Beauté Haut de Gamme
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up [animation-delay:100ms] text-balance leading-tight">
            {heroData.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up [animation-delay:200ms] text-pretty leading-relaxed text-white/90">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:300ms]">
            <BookingDialog serviceName="Consultation générale" servicePrice="Gratuit">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base md:text-lg px-6 md:px-10 py-5 md:py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </BookingDialog>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-base md:text-lg px-6 md:px-10 py-5 md:py-7 transition-all duration-300"
              asChild
            >
              <a href="#services">Nos prestations</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex 
                  ? "w-8 h-2 bg-accent" 
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}

      </section>
  )
}

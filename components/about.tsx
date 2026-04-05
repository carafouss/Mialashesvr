"use client"

import { useEffect, useState } from "react"
import { Eye, Award, Heart, Sparkles, Loader2 } from "lucide-react"
import { getAboutContent, type AboutContent } from "@/lib/supabase/data-service"

export default function About() {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    setLoading(true)
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
      const data = await Promise.race([getAboutContent(), timeoutPromise])
      setAboutData(data || {
        id: "",
        image: "",
        title: "Notre Philosophie",
        subtitle: "L'excellence au service de votre beauté",
        paragraph1: "Mia Lashes est née d'une passion pour la beauté et l'art de sublimer le regard.",
        paragraph2: "Notre équipe de professionnelles certifiées vous accueille dans un cadre élégant et apaisant.",
        paragraph3: "Nous utilisons exclusivement des produits haut de gamme pour garantir des résultats exceptionnels.",
        badge_text: "Expert en extensions de cils",
        updated_at: "",
      })
    } catch (error) {
      console.error("Error loading about data:", error)
      // Set default data on error
      setAboutData({
        id: "",
        image: "",
        title: "Notre Philosophie",
        subtitle: "L'excellence au service de votre beauté",
        paragraph1: "Mia Lashes est née d'une passion pour la beauté et l'art de sublimer le regard.",
        paragraph2: "Notre équipe de professionnelles certifiées vous accueille dans un cadre élégant et apaisant.",
        paragraph3: "Nous utilisons exclusivement des produits haut de gamme pour garantir des résultats exceptionnels.",
        badge_text: "Expert en extensions de cils",
        updated_at: "",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  if (!aboutData) return null

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            À Propos de Mia Lashes
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {aboutData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative animate-fade-in-up [animation-delay:200ms]">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <img
                src={aboutData.image || "/placeholder.svg"}
                alt="Intérieur élégant de Mia Lashes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-xl">
              <p className="text-xl font-bold">{aboutData.badge_text}</p>
            </div>
          </div>

          {/* Story */}
          <div className="animate-fade-in-up [animation-delay:400ms]">
            <h3 className="font-serif text-3xl font-bold mb-6 text-balance">{aboutData.title}</h3>
            {aboutData.paragraph1 && (
              <p className="text-muted-foreground mb-4 leading-relaxed">
                <span className="font-semibold text-foreground">Mia Lashes</span>{" "}
                {aboutData.paragraph1.replace("Mia Lashes", "")}
              </p>
            )}
            {aboutData.paragraph2 && (
              <p className="text-muted-foreground mb-4 leading-relaxed">{aboutData.paragraph2}</p>
            )}
            {aboutData.paragraph3 && (
              <p className="text-muted-foreground mb-4 leading-relaxed">{aboutData.paragraph3}</p>
            )}
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in [animation-delay:200ms]">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-accent" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Précision</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chaque geste est minutieusement exécuté pour un résultat impeccable
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in [animation-delay:300ms]">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Excellence</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Des techniques de pointe et des produits premium pour votre beauté
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in [animation-delay:400ms]">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Élégance</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Une beauté naturelle et raffinée qui révèle votre personnalité
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in [animation-delay:500ms]">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Bien-être</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un moment de détente et de soin dans un cadre luxueux
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

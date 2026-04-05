"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, ArrowRight } from "lucide-react"
import { getServices, type Service } from "@/lib/supabase/data-service"
import Link from "next/link"

export default function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const timeoutPromise = new Promise<Service[]>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
      const data = await Promise.race([getServices(), timeoutPromise])
      // Show only first 3 services on home page
      setServices(data.slice(0, 3))
    } catch (error) {
      console.error("Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Nos Prestations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Des services experts pour sublimer votre beauté naturelle
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Link href={`/services/${service.id}`} key={service.id}>
              <Card
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in cursor-pointer h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="bg-accent text-accent-foreground p-3 rounded-full">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-primary-foreground">{service.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-accent">{service.price}</span>
                    <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                      Voir plus <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/services" className="flex items-center gap-2">
              Voir toutes nos prestations
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

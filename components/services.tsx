"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookingDialog } from "@/components/booking-dialog"
import { Eye, Loader2 } from "lucide-react"
import { getServices, type Service } from "@/lib/supabase/data-service"

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error("Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Nos Prestations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Des services experts pour sublimer votre beauté naturelle
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in"
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
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                
                {/* Prix principal */}
                <div className="mb-4">
                  <span className="text-lg font-semibold text-accent">{service.price}</span>
                </div>
                
                {/* Tarifs détaillés */}
                {service.price_details && service.price_details.length > 0 && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Nos tarifs</p>
                    <div className="space-y-1.5">
                      {service.price_details.map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{detail.label}</span>
                          <span className="font-semibold text-accent">{detail.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <BookingDialog serviceName={service.title} servicePrice={service.price} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

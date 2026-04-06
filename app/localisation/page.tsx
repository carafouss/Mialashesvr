"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Phone } from "lucide-react"

export default function LocalisationPage() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Mia+Lash+studio+Abidjan+Cote+d'Ivoire"
  
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Rendez-vous dans notre salon pour une expérience beauté exceptionnelle
          </p>
        </div>
      </section>

      {/* Location Details */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Map - Same width as info column */}
            <div className="h-full">
              <div className="h-full min-h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.3!2d-3.98!3d5.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMzYuMCJOIDPCsDU4JzQ4LjAiVw!5e0!3m2!1sfr!2sci!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Mia Lashes"
                />
              </div>
            </div>

            {/* Contact Info Cards - Same width as map */}
            <div className="flex flex-col gap-4 h-full">
              {/* Adresse */}
              <Card className="border border-border shadow-sm flex-1">
                <CardContent className="p-6 h-full flex items-center">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                      <p className="text-muted-foreground mb-2">
                        Mia Lash studio, Abidjan, Côte d&apos;Ivoire
                      </p>
                      <a 
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
                      >
                        Voir sur Google Maps
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border border-border shadow-sm flex-1">
                <CardContent className="p-6 h-full flex items-center">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Contact</h3>
                      <p className="text-muted-foreground mb-1">
                        Téléphone / WhatsApp:
                      </p>
                      <a 
                        href="tel:+2250777812489" 
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        +225 07 77 81 24 89
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Horaires */}
              <Card className="border border-border shadow-sm flex-1">
                <CardContent className="p-6 h-full flex items-center">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Horaires</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lundi - Samedi: 8h30 - 17h30</p>
                        <p>Dimanche: Fermé</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

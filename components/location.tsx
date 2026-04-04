"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Clock } from "lucide-react"

export default function Location() {
  return (
    <section id="location" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Nous Trouver</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Rendez-vous dans notre salon pour une expérience beauté exceptionnelle
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <Card className="flex-1">
              <CardContent className="p-4 h-full flex items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground p-2.5 rounded-full flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Adresse</h3>
                    <p className="text-sm text-muted-foreground">
                      Mia Lash studio, Abidjan, Côte d&apos;Ivoire
                    </p>
                    <a
                      href="https://maps.app.goo.gl/umNXWPfz5vh1WYQ77?g_st=aw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium text-sm"
                    >
                      Voir sur Google Maps →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="p-4 h-full flex items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground p-2.5 rounded-full flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Contact</h3>
                    <p className="text-sm text-muted-foreground">Téléphone / WhatsApp:</p>
                    <a href="tel:+2250777812489" className="text-accent hover:underline font-medium text-sm">
                      +225 07 77 81 24 89
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="p-4 h-full flex items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground p-2.5 rounded-full flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Horaires</h3>
                    <p className="text-sm text-muted-foreground">Lundi - Samedi: 8h30 - 17h30</p>
                    <p className="text-sm text-muted-foreground">Dimanche: Fermé</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-[280px] lg:h-auto rounded-lg overflow-hidden animate-scale-in shadow-lg lg:order-first">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3972.4876!2d-3.9876!3d5.3477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMjAnNTEuNyJOIDPCsDU5JzE1LjQiVw!5e0!3m2!1sfr!2sci!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mia Lashes Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

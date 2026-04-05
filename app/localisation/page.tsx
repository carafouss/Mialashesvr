"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookingDialog } from "@/components/booking-dialog"
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react"

export default function LocalisationPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Notre Institut</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Nous Trouver
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rendez-nous visite dans notre institut de beauté au coeur d&apos;Abidjan
          </p>
        </div>
      </section>

      {/* Location Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div className="aspect-square lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.5349!2d-3.9893!3d5.3599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMzUuNiJOIDPCsDU5JzIxLjUiVw!5e0!3m2!1sfr!2sci!4v1234567890"
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

            {/* Contact Info */}
            <div className="order-1 lg:order-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        Cocody Angré, 8ème Tranche<br />
                        Abidjan, Côte d&apos;Ivoire
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Horaires d&apos;ouverture</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lundi - Vendredi: 9h00 - 19h00</p>
                        <p>Samedi: 9h00 - 18h00</p>
                        <p>Dimanche: Sur rendez-vous</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                      <a href="tel:+2250700000000" className="text-muted-foreground hover:text-accent transition-colors">
                        +225 07 00 00 00 00
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <a href="mailto:contact@mialashes.ci" className="text-muted-foreground hover:text-accent transition-colors">
                        contact@mialashes.ci
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                <a
                  href="https://instagram.com/mialashes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/mialashes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/2250700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <BookingDialog serviceName="Consultation générale" servicePrice="Gratuit">
                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
                    <Clock className="mr-2 w-5 h-5" />
                    Prendre rendez-vous
                  </Button>
                </BookingDialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

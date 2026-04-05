"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getServiceById, type Service } from "@/lib/supabase/data-service"
import { BookingDialog } from "@/components/booking-dialog"
import { ArrowLeft, Clock, Sparkles, Play, X, ChevronLeft, ChevronRight } from "lucide-react"

interface ExtendedService extends Service {
  long_description?: string
  images?: string[]
  videos?: string[]
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<ExtendedService | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: "image" | "video" } | null>(null)
  const [mediaIndex, setMediaIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      loadService(params.id as string)
    }
  }, [params.id])

  const loadService = async (id: string) => {
    setLoading(true)
    try {
      const data = await getServiceById(id)
      setService(data as ExtendedService)
    } catch (error) {
      console.error("Error loading service:", error)
    } finally {
      setLoading(false)
    }
  }

  const allMedia = [
    ...(service?.images || []).map((url) => ({ url, type: "image" as const })),
    ...(service?.videos || []).map((url) => ({ url, type: "video" as const })),
  ]

  const goToPrevious = () => {
    if (mediaIndex > 0) {
      setMediaIndex(mediaIndex - 1)
      setSelectedMedia(allMedia[mediaIndex - 1])
    }
  }

  const goToNext = () => {
    if (mediaIndex < allMedia.length - 1) {
      setMediaIndex(mediaIndex + 1)
      setSelectedMedia(allMedia[mediaIndex + 1])
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-muted rounded mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-[4/3] bg-muted rounded-2xl"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!service) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-4">Service non trouvé</h1>
            <p className="text-muted-foreground mb-8">Ce service n&apos;existe pas ou a été supprimé.</p>
            <Link href="/services">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Retour aux services
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour aux services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-accent/40" />
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {allMedia.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {allMedia.slice(0, 8).map((media, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedMedia(media)
                        setMediaIndex(index)
                      }}
                    >
                      {media.type === "image" ? (
                        <Image src={media.url} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Play className="w-6 h-6 text-accent" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Prestation</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {service.title}
              </h1>

              <p className="text-2xl font-bold text-accent mb-6">
                {service.price}
              </p>

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-muted-foreground">
                  {service.long_description || service.description}
                </p>
              </div>

              {/* Price Details */}
              {service.price_details && service.price_details.length > 0 && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Tarifs détaillés</h3>
                    <div className="space-y-3">
                      {service.price_details.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="text-muted-foreground">{detail.label}</span>
                          <span className="font-semibold">{detail.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <BookingDialog serviceName={service.title} servicePrice={service.price}>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
                  <Clock className="mr-2 w-5 h-5" />
                  Réserver cette prestation
                </Button>
              </BookingDialog>
            </div>
          </div>
        </div>
      </section>

      {/* Media Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {mediaIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}

            {mediaIndex < allMedia.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}

            {selectedMedia && (
              <div className="flex items-center justify-center min-h-[60vh] p-8">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.url}
                    alt=""
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}

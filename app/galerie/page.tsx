"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getGalleryItems, type GalleryItem } from "@/lib/supabase/data-service"
import { Camera, Play, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function GaleriePage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    setLoading(true)
    try {
      const data = await getGalleryItems()
      setItems(data)
    } catch (error) {
      console.error("Error loading gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory)

  const currentIndex = selectedItem ? filteredItems.findIndex((item) => item.id === selectedItem.id) : -1

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1])
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Notre Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Galerie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos réalisations et laissez-vous inspirer par notre travail sur les extensions de cils et les soins du regard
          </p>
        </div>
      </section>

      {/* Filter Section */}
      {categories.length > 1 && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent hover:bg-accent/90" : ""}
                >
                  {category === "all" ? "Tous" : category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.media_type === "image" ? (
                    <Image
                      src={item.media_url}
                      alt={item.title || "Image galerie"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      {item.thumbnail_url ? (
                        <Image
                          src={item.thumbnail_url}
                          alt={item.title || "Vidéo galerie"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-accent ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Aucun média disponible pour le moment</p>
              <p className="text-muted-foreground text-sm mt-2">Revenez bientôt pour découvrir nos réalisations</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}

            {currentIndex < filteredItems.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}

            {selectedItem && (
              <div className="flex items-center justify-center min-h-[60vh] p-8">
                {selectedItem.media_type === "image" ? (
                  <img
                    src={selectedItem.media_url}
                    alt={selectedItem.title || "Image galerie"}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedItem.media_url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                )}
              </div>
            )}

            {selectedItem && (selectedItem.title || selectedItem.description) && (
              <div className="p-6 text-white text-center">
                {selectedItem.title && (
                  <h3 className="text-xl font-semibold mb-2">{selectedItem.title}</h3>
                )}
                {selectedItem.description && (
                  <p className="text-gray-300">{selectedItem.description}</p>
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

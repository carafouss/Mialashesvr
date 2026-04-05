"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getProductById, type Product } from "@/lib/supabase/data-service"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft, Package, ShoppingCart, Plus, Minus, Play, X, ChevronLeft, ChevronRight, Check } from "lucide-react"

interface ExtendedProduct extends Product {
  long_description?: string
  images?: string[]
  videos?: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<ExtendedProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: "image" | "video" } | null>(null)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string)
    }
  }, [params.id])

  const loadProduct = async (id: string) => {
    setLoading(true)
    try {
      const data = await getProductById(id)
      setProduct(data as ExtendedProduct)
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const allMedia = [
    ...(product?.images || []).map((url) => ({ url, type: "image" as const })),
    ...(product?.videos || []).map((url) => ({ url, type: "video" as const })),
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
                <div className="aspect-square bg-muted rounded-2xl"></div>
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

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-8">Ce produit n&apos;existe pas ou a été supprimé.</p>
            <Link href="/produits">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Retour aux produits
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
          <Link href="/produits" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour aux produits
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <Package className="w-16 h-16 text-accent/40" />
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">
                      Rupture de stock
                    </span>
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

            {/* Product Info */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.name}
              </h1>

              <p className="text-2xl font-bold text-accent mb-6">
                {product.price.toLocaleString()} FCFA
              </p>

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-muted-foreground">
                  {(product as ExtendedProduct).long_description || product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    En stock ({product.stock} disponibles)
                  </p>
                ) : (
                  <p className="text-red-500">Rupture de stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">Quantité:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <Button
                size="lg"
                className={`w-full ${addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-accent hover:bg-accent/90"}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {addedToCart ? (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </Button>
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

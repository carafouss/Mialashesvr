"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { getProducts, type Product } from "@/lib/supabase/data-service"

function ProductImageCarousel({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean)
  
  if (allImages.length <= 1) {
    return (
      <img
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
      />
    )
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={allImages[currentIndex] || "/placeholder.svg"}
        alt={`${product.name} - Image ${currentIndex + 1}`}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
      />
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(index)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-4" : "bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Products() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const getQuantity = (productId: string) => quantities[productId] || 1

  const increaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }))
  }

  const decreaseQuantity = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = getQuantity(product.id)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
  }

  if (loading) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Nos Produits</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Decouvrez notre selection de produits professionnels pour extensions de cils
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-64 overflow-hidden rounded-t-lg bg-neutral-100">
                <ProductImageCarousel product={product} />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground z-10">{product.category}</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
                <div className="text-2xl font-bold text-accent">{product.price.toLocaleString()} FCFA</div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex items-center gap-2">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => decreaseQuantity(product.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{getQuantity(product.id)}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => increaseQuantity(product.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

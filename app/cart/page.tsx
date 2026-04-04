"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Trash2, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    address: "",
    phone: "",
  })

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 text-center">
            <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Commande Envoyée!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Votre commande a été envoyée via WhatsApp. Nous vous contacterons bientôt pour confirmer votre commande!
            </p>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>

        <h1 className="text-4xl font-serif font-bold mb-8">Panier</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">Votre panier est vide</p>
              <Button asChild>
                <Link href="/#products">Découvrir nos produits</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {step === 1 ? (
                <>
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <p className="text-accent font-bold">{item.price.toLocaleString()} FCFA</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        placeholder="Entrez votre nom complet"
                        value={deliveryInfo.name}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse de livraison *</Label>
                      <Textarea
                        id="address"
                        placeholder="Entrez votre adresse complète (quartier, rue, repères)"
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Numéro de téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+225 XX XX XX XX XX"
                        value={deliveryInfo.phone}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {step === 1 ? (
                    <Button className="w-full" onClick={() => setStep(2)}>
                      Passer la commande
                    </Button>
                  ) : (
                    <div className="w-full space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          const message = `🛍️ *NOUVELLE COMMANDE - MIA LASHES*\n\n*PRODUITS:*\n${items
                            .map(
                              (item) =>
                                `• ${item.name}\n  Quantité: ${item.quantity}\n  Prix: ${(item.price * item.quantity).toLocaleString()} FCFA`,
                            )
                            .join(
                              "\n\n",
                            )}\n\n*TOTAL: ${totalPrice.toLocaleString()} FCFA*\n\n━━━━━━━━━━━━━━━\n*INFORMATIONS DE LIVRAISON:*\n👤 Nom: ${deliveryInfo.name}\n📍 Adresse: ${deliveryInfo.address}\n📞 Téléphone: ${deliveryInfo.phone}\n━━━━━━━━━━━━━━━\n\nMerci de confirmer ma commande!`

                          window.open(`https://wa.me/2250777812489?text=${encodeURIComponent(message)}`, "_blank")
                          clearCart()
                          setStep(3)
                        }}
                        disabled={!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone}
                      >
                        Valider sur WhatsApp
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep(1)}>
                        Retour au panier
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

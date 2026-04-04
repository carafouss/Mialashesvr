"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { getSales, createSale, deleteSale, getProducts, type Sale, type SaleItem, type Product, type AdminUser } from "@/lib/supabase/data-service"

export default function SalesManagement() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    paymentMethod: "Wave",
    discount: 0,
    notes: "",
  })
  const [cartItems, setCartItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadData()
    const storedUser = localStorage.getItem("mia_current_user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [salesData, productsData] = await Promise.all([
        getSales(),
        getProducts()
      ])
      setSales(salesData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const canDeleteSales = currentUser?.role === "super_admin"

  const addToCart = () => {
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = cartItems.find((item) => item.product_id === product.id)
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.unit_price,
              }
            : item,
        ),
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.price,
          total: quantity * product.price,
        },
      ])
    }
    setSelectedProduct("")
    setQuantity(1)
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.product_id !== productId))
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = (subtotal * formData.discount) / 100
    return subtotal - discountAmount
  }

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.customerPhone || cartItems.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires et ajouter au moins un produit")
      return
    }

    setSaving(true)
    try {
      const newSale = {
        items: cartItems,
        total_amount: calculateTotal(),
        client_name: formData.customerName,
        client_phone: formData.customerPhone,
        payment_method: formData.paymentMethod,
        created_by: currentUser?.username || "unknown",
      }

      await createSale(newSale)
      await loadData()
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error("Error creating sale:", error)
      alert("Erreur lors de la création de la vente")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      paymentMethod: "Wave",
      discount: 0,
      notes: "",
    })
    setCartItems([])
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleDelete = async (id: string) => {
    if (!canDeleteSales) {
      alert("Seul le super administrateur peut supprimer des ventes")
      return
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
      try {
        await deleteSale(id)
        await loadData()
      } catch (error) {
        console.error("Error deleting sale:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Ventes</h2>
          <p className="text-muted-foreground">Enregistrez et suivez toutes vos ventes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Vente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enregistrer une vente</DialogTitle>
              <DialogDescription>Ajoutez les informations de la vente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nom du client *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+225 ..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ajouter des produits *</Label>
                <div className="flex gap-2">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatPrice(product.price)} (Stock: {product.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="w-20"
                    placeholder="Qté"
                  />
                  <Button type="button" onClick={addToCart} disabled={!selectedProduct}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {cartItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produits ajoutés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {formatPrice(item.unit_price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold">{formatPrice(item.total)}</p>
                            <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product_id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wave">Wave</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Réduction (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informations supplémentaires..."
                />
              </div>

              {cartItems.length > 0 && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>{formatPrice(cartItems.reduce((sum, item) => sum + item.total, 0))}</span>
                      </div>
                      {formData.discount > 0 && (
                        <div className="flex justify-between text-destructive">
                          <span>Réduction ({formData.discount}%):</span>
                          <span>
                            -
                            {formatPrice(
                              (cartItems.reduce((sum, item) => sum + item.total, 0) * formData.discount) / 100,
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : "Enregistrer la vente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des ventes</CardTitle>
          <CardDescription>
            {sales.length} vente{sales.length > 1 ? "s" : ""} enregistrée{sales.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune vente enregistrée</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Créé par</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.created_at).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{sale.client_name}</TableCell>
                    <TableCell>{sale.client_phone}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {sale.items.map((item, idx) => (
                          <div key={idx}>
                            {item.product_name} (×{item.quantity})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{sale.payment_method}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sale.created_by}</TableCell>
                    <TableCell className="text-right font-semibold">{formatPrice(sale.total_amount)}</TableCell>
                    <TableCell>
                      {canDeleteSales && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

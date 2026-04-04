"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, Users, Package, Loader2 } from "lucide-react"
import { getSales, type Sale, type SaleItem } from "@/lib/supabase/data-service"

export default function ReportsManagement() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [bestProducts, setBestProducts] = useState<{ productName: string; quantity: number; revenue: number }[]>([])
  const [bestCustomers, setBestCustomers] = useState<{ customerName: string; customerPhone: string; totalPurchases: number; totalSpent: number }[]>([])
  const [salesInPeriod, setSalesInPeriod] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    setStartDate(firstDay.toISOString().split("T")[0])
    setEndDate(today.toISOString().split("T")[0])
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      generateReport()
    }
  }, [startDate, endDate])

  const generateReport = async () => {
    setLoading(true)
    try {
      const allSales = await getSales()
      
      // Filter by period
      const filteredSales = allSales.filter((sale) => {
        const saleDate = new Date(sale.created_at).toISOString().split("T")[0]
        return saleDate >= startDate && saleDate <= endDate
      })
      
      setSalesInPeriod(filteredSales)
      
      // Calculate total revenue
      const revenue = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0)
      setTotalRevenue(revenue)
      
      // Calculate best products
      const productMap = new Map<string, { quantity: number; revenue: number }>()
      filteredSales.forEach((sale) => {
        sale.items.forEach((item: SaleItem) => {
          const existing = productMap.get(item.product_name) || { quantity: 0, revenue: 0 }
          productMap.set(item.product_name, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + item.total,
          })
        })
      })
      const products = Array.from(productMap.entries())
        .map(([productName, data]) => ({ productName, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
      setBestProducts(products)
      
      // Calculate best customers
      const customerMap = new Map<string, { phone: string; purchases: number; spent: number }>()
      filteredSales.forEach((sale) => {
        const existing = customerMap.get(sale.client_name) || { phone: sale.client_phone || "", purchases: 0, spent: 0 }
        customerMap.set(sale.client_name, {
          phone: sale.client_phone || existing.phone,
          purchases: existing.purchases + 1,
          spent: existing.spent + sale.total_amount,
        })
      })
      const customers = Array.from(customerMap.entries())
        .map(([customerName, data]) => ({
          customerName,
          customerPhone: data.phone,
          totalPurchases: data.purchases,
          totalSpent: data.spent,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
      setBestCustomers(customers)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  const exportReport = (type: "products" | "customers" | "sales") => {
    const date = new Date().toISOString().split("T")[0]
    if (type === "products" && bestProducts.length > 0) {
      exportToCSV(
        bestProducts.map((p) => ({
          Produit: p.productName,
          "Quantité vendue": p.quantity,
          "Revenu généré (FCFA)": p.revenue,
        })),
        `meilleurs_produits_${date}.csv`,
      )
    } else if (type === "customers" && bestCustomers.length > 0) {
      exportToCSV(
        bestCustomers.map((c) => ({
          Client: c.customerName,
          Téléphone: c.customerPhone,
          "Nombre d'achats": c.totalPurchases,
          "Montant total (FCFA)": c.totalSpent,
        })),
        `meilleurs_clients_${date}.csv`,
      )
    } else if (type === "sales" && salesInPeriod.length > 0) {
      const flattenedSales = salesInPeriod.map((sale) => ({
        Date: new Date(sale.created_at).toLocaleDateString("fr-FR"),
        Client: sale.client_name,
        Téléphone: sale.client_phone,
        Produits: sale.items.map((i: SaleItem) => `${i.product_name} (×${i.quantity})`).join(", "),
        Paiement: sale.payment_method,
        "Montant (FCFA)": sale.total_amount,
      }))
      exportToCSV(flattenedSales, `ventes_${date}.csv`)
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`
  }

  if (loading && !startDate) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rapports et Statistiques</h2>
        <p className="text-muted-foreground">Analysez vos performances sur une période donnée</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Période d'analyse</CardTitle>
          <CardDescription>Sélectionnez la période pour générer les rapports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {salesInPeriod.length} vente{salesInPeriod.length > 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meilleurs Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bestProducts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Produits vendus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bestCustomers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Clients uniques</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meilleurs Produits</CardTitle>
                <CardDescription>Classés par revenu généré</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport("products")}
                disabled={bestProducts.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </CardHeader>
            <CardContent>
              {bestProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune donnée pour cette période</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Quantité vendue</TableHead>
                      <TableHead className="text-right">Revenu généré</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bestProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right font-semibold">{formatPrice(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meilleurs Clients</CardTitle>
                <CardDescription>Classés par montant total dépensé</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport("customers")}
                disabled={bestCustomers.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </CardHeader>
            <CardContent>
              {bestCustomers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune donnée pour cette période</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Nombre d'achats</TableHead>
                      <TableHead className="text-right">Montant total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bestCustomers.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{customer.customerName}</TableCell>
                        <TableCell>{customer.customerPhone}</TableCell>
                        <TableCell className="text-right">{customer.totalPurchases}</TableCell>
                        <TableCell className="text-right font-semibold">{formatPrice(customer.totalSpent)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Détail des ventes</CardTitle>
                <CardDescription>Toutes les ventes de la période</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport("sales")}
                disabled={salesInPeriod.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </CardHeader>
            <CardContent>
              {salesInPeriod.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune vente pour cette période</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Produits</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesInPeriod.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.created_at).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{sale.client_name}</TableCell>
                        <TableCell className="text-sm">
                          {sale.items.map((item: SaleItem, idx: number) => (
                            <div key={idx}>
                              {item.product_name} (×{item.quantity})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{sale.payment_method}</TableCell>
                        <TableCell className="text-right font-semibold">{formatPrice(sale.total_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

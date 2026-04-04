export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Sale {
  id: string
  date: string
  customerName: string
  customerPhone: string
  items: SaleItem[]
  totalAmount: number
  paymentMethod: "Wave" | "WhatsApp" | "Espèces"
  discount: number
  finalAmount: number
  notes?: string
  createdBy: string
  createdByUsername: string
}

export function getSales(): Sale[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mialashes_sales")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return []
}

export function saveSales(sales: Sale[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mialashes_sales", JSON.stringify(sales))
  }
}

export function addSale(sale: Sale): void {
  const sales = getSales()
  sales.push(sale)
  saveSales(sales)
}

export function deleteSale(id: string): void {
  const sales = getSales().filter((s) => s.id !== id)
  saveSales(sales)
}

// Statistiques
export function getSalesInPeriod(startDate: string, endDate: string): Sale[] {
  return getSales().filter((sale) => {
    return sale.date >= startDate && sale.date <= endDate
  })
}

export function getTotalRevenue(startDate: string, endDate: string): number {
  const sales = getSalesInPeriod(startDate, endDate)
  return sales.reduce((sum, sale) => sum + sale.finalAmount, 0)
}

export function getBestProducts(
  startDate: string,
  endDate: string,
): Array<{
  productName: string
  quantity: number
  revenue: number
}> {
  const sales = getSalesInPeriod(startDate, endDate)
  const productStats: Record<string, { productName: string; quantity: number; revenue: number }> = {}

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          productName: item.productName,
          quantity: 0,
          revenue: 0,
        }
      }
      productStats[item.productId].quantity += item.quantity
      productStats[item.productId].revenue += item.total
    })
  })

  return Object.values(productStats).sort((a, b) => b.revenue - a.revenue)
}

export function getBestCustomers(
  startDate: string,
  endDate: string,
): Array<{
  customerName: string
  customerPhone: string
  totalPurchases: number
  totalSpent: number
}> {
  const sales = getSalesInPeriod(startDate, endDate)
  const customerStats: Record<
    string,
    { customerName: string; customerPhone: string; totalPurchases: number; totalSpent: number }
  > = {}

  sales.forEach((sale) => {
    const key = sale.customerPhone
    if (!customerStats[key]) {
      customerStats[key] = {
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        totalPurchases: 0,
        totalSpent: 0,
      }
    }
    customerStats[key].totalPurchases += 1
    customerStats[key].totalSpent += sale.finalAmount
  })

  return Object.values(customerStats).sort((a, b) => b.totalSpent - a.totalSpent)
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
  ].join("\n")

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

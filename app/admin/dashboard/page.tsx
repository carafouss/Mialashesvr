"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import ProductsManagement from "@/components/admin/products-management"
import DashboardStats from "@/components/admin/dashboard-stats"
import CategoriesManagement from "@/components/admin/categories-management"
import PromosManagement from "@/components/admin/promos-management"
import AboutManagement from "@/components/admin/about-management"
import ServicesManagement from "@/components/admin/services-management"
import SalesManagement from "@/components/admin/sales-management"
import ReportsManagement from "@/components/admin/reports-management"
import UsersManagement from "@/components/admin/users-management"
import HeroManagement from "@/components/admin/hero-management"
import type { AdminUser } from "@/lib/supabase/data-service"

const setAdminLoggedIn = (value: boolean) => {
  localStorage.setItem("mia_admin_logged_in", value.toString())
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [canManageUsers, setCanManageUsers] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("mia_current_user")
    if (!storedUser) {
      router.push("/admin")
    } else {
      const user = JSON.parse(storedUser) as AdminUser
      setIsAuthenticated(true)
      setCurrentUser(user)
      setCanManageUsers(user.role === "super_admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("mia_current_user")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-serif">Mia Lashes - Admin</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Connecté en tant que <span className="font-medium">{currentUser?.username}</span>
              {currentUser?.role === "super_admin" && <span className="text-amber-600"> (Super Admin)</span>}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full sm:w-auto bg-transparent">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 md:py-8">
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto -mx-2 px-2 pb-2">
            <TabsList className="inline-flex w-max min-w-full md:w-full md:grid md:grid-cols-5 lg:grid-cols-10 gap-1">
              <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">Vue</TabsTrigger>
              <TabsTrigger value="sales" className="text-xs md:text-sm whitespace-nowrap">Ventes</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs md:text-sm whitespace-nowrap">Rapports</TabsTrigger>
              <TabsTrigger value="hero" className="text-xs md:text-sm whitespace-nowrap">Accueil</TabsTrigger>
              <TabsTrigger value="about" className="text-xs md:text-sm whitespace-nowrap">À Propos</TabsTrigger>
              <TabsTrigger value="services" className="text-xs md:text-sm whitespace-nowrap">Prestations</TabsTrigger>
              <TabsTrigger value="products" className="text-xs md:text-sm whitespace-nowrap">Produits</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs md:text-sm whitespace-nowrap">Catégories</TabsTrigger>
              <TabsTrigger value="promos" className="text-xs md:text-sm whitespace-nowrap">Promos</TabsTrigger>
              {canManageUsers && <TabsTrigger value="users" className="text-xs md:text-sm whitespace-nowrap">Utilisateurs</TabsTrigger>}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="sales">
            <SalesManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="hero">
            <HeroManagement />
          </TabsContent>

          <TabsContent value="about">
            <AboutManagement />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="promos">
            <PromosManagement />
          </TabsContent>

          {canManageUsers && (
            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

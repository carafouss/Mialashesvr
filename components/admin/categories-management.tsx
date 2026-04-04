"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCategories, createCategory, deleteCategory, type Category } from "@/lib/supabase/data-service"
import { Plus, Trash2, Loader2 } from "lucide-react"

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const categoryName = formData.get("name") as string

    if (categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase())) {
      alert("Cette catégorie existe déjà")
      setSaving(false)
      return
    }

    try {
      await createCategory(categoryName)
      await loadCategories()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(id)
        await loadCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Erreur lors de la suppression")
      }
    }
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
        <h2 className="text-2xl font-bold">Gestion des Catégories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une catégorie</DialogTitle>
              <DialogDescription>Créez une nouvelle catégorie de produits</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input id="name" name="name" placeholder="Ex: Accessoires, Outils" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

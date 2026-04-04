"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPromotions, createPromotion, updatePromotion, deletePromotion, type Promotion } from "@/lib/supabase/data-service"
import { useImageUpload } from "@/hooks/use-image-upload"
import { Plus, Edit, Trash2, Upload, ImageIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PromosManagement() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { uploadImage, uploading } = useImageUpload()

  useEffect(() => {
    loadPromos()
  }, [])

  const loadPromos = async () => {
    setLoading(true)
    try {
      const data = await getPromotions()
      setPromos(data)
    } catch (error) {
      console.error("Error loading promos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop grande. Taille maximale: 5MB")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSavePromo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    
    let imageUrl = editingPromo?.image || ""
    
    // Upload image to Vercel Blob if a new file is selected
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        alert("Erreur lors de l'upload de l'image")
        setSaving(false)
        return
      }
    }

    const promoData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      badge: formData.get("badge") as string,
      image: imageUrl,
      active: formData.get("active") === "on",
    }

    try {
      if (editingPromo) {
        await updatePromotion(editingPromo.id, promoData)
      } else {
        await createPromotion({ ...promoData, active: true })
      }
      await loadPromos()
      setIsDialogOpen(false)
      setEditingPromo(null)
      setImagePreview("")
      setImageFile(null)
    } catch (error) {
      console.error("Error saving promo:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePromo = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")) {
      try {
        await deletePromotion(id)
        await loadPromos()
      } catch (error) {
        console.error("Error deleting promo:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleToggleActive = async (promo: Promotion) => {
    try {
      await updatePromotion(promo.id, { active: !promo.active })
      await loadPromos()
    } catch (error) {
      console.error("Error toggling promo:", error)
    }
  }

  const openEditDialog = (promo: Promotion) => {
    setEditingPromo(promo)
    setImagePreview(promo.image || "")
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingPromo(null)
    setImagePreview("")
    setImageFile(null)
    setIsDialogOpen(true)
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
        <h2 className="text-2xl font-bold">Gestion des Promotions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromo ? "Modifier la promotion" : "Ajouter une promotion"}</DialogTitle>
              <DialogDescription>
                {editingPromo
                  ? "Modifiez les informations de la promotion"
                  : "Créez une nouvelle promotion pour le carrousel"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSavePromo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la promotion</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPromo?.title}
                  placeholder="Ex: 20% de réduction"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPromo?.description}
                  placeholder="Ex: Sur tous les paiements via Wave"
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  name="badge"
                  defaultValue={editingPromo?.badge}
                  placeholder="Ex: PROMO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageFile">Image de la promotion (optionnel)</Label>
                <Alert>
                  <ImageIcon className="h-4 w-4" />
                  <AlertDescription>
                    Taille recommandée: <strong>1200x400 pixels</strong> (ratio 3:1)
                    <br />
                    Format: JPG ou PNG. Taille max: 2MB
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {imagePreview && (
                    <div className="relative w-full max-w-md border-2 border-dashed rounded-lg p-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        className="w-full h-auto object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              {editingPromo && (
                <div className="flex items-center space-x-2">
                  <Switch id="active" name="active" defaultChecked={editingPromo.active} />
                  <Label htmlFor="active">Promotion active</Label>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                  {saving || uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploading ? "Upload image..." : "Sauvegarde..."}
                    </>
                  ) : editingPromo ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {promos.map((promo) => (
          <Card key={promo.id} className={!promo.active ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{promo.title}</span>
                <Switch
                  checked={promo.active}
                  onCheckedChange={() => handleToggleActive(promo)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {promo.image && (
                <img
                  src={promo.image || "/placeholder.svg"}
                  alt={promo.title}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <p className="text-sm text-muted-foreground">{promo.description}</p>
              {promo.badge && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Badge:</span>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-md font-bold text-sm">
                    {promo.badge}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => openEditDialog(promo)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePromo(promo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

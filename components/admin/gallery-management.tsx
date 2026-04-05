"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Video } from "lucide-react"
import { 
  getGalleryItems, 
  createGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem,
  type GalleryItem 
} from "@/lib/supabase/data-service"
import { toast } from "sonner"

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_url: "",
    media_type: "image" as "image" | "video",
    thumbnail_url: "",
    category: "general",
    display_order: 0,
    is_visible: true
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const data = await getGalleryItems()
    setItems(data)
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      media_url: "",
      media_type: "image",
      thumbnail_url: "",
      category: "general",
      display_order: 0,
      is_visible: true
    })
    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.media_url) {
      toast.error("L'URL du média est requise")
      return
    }

    if (editingItem) {
      const updated = await updateGalleryItem(editingItem.id, formData)
      if (updated) {
        toast.success("Élément mis à jour")
        loadItems()
        setIsDialogOpen(false)
        resetForm()
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } else {
      const created = await createGalleryItem(formData)
      if (created) {
        toast.success("Élément ajouté à la galerie")
        loadItems()
        setIsDialogOpen(false)
        resetForm()
      } else {
        toast.error("Erreur lors de l'ajout")
      }
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title || "",
      description: item.description || "",
      media_url: item.media_url,
      media_type: item.media_type,
      thumbnail_url: item.thumbnail_url || "",
      category: item.category || "general",
      display_order: item.display_order || 0,
      is_visible: item.is_visible
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return
    
    const success = await deleteGalleryItem(id)
    if (success) {
      toast.success("Élément supprimé")
      loadItems()
    } else {
      toast.error("Erreur lors de la suppression")
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
        <div>
          <h2 className="text-2xl font-bold">Galerie</h2>
          <p className="text-muted-foreground">Gérez les images et vidéos de la galerie</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Modifier l'élément" : "Ajouter un élément"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de l'élément"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de média</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: "image" | "video") => 
                    setFormData({ ...formData, media_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>URL du média *</Label>
                <Input
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              {formData.media_type === "video" && (
                <div className="space-y-2">
                  <Label>URL de la miniature</Label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Général</SelectItem>
                    <SelectItem value="extensions">Extensions de cils</SelectItem>
                    <SelectItem value="sourcils">Sourcils</SelectItem>
                    <SelectItem value="soins">Soins</SelectItem>
                    <SelectItem value="salon">Salon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ordre d&apos;affichage</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label>Visible sur le site</Label>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                {editingItem ? "Mettre à jour" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun élément dans la galerie. Cliquez sur &quot;Ajouter&quot; pour commencer.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                {item.media_type === "image" ? (
                  <img
                    src={item.media_url}
                    alt={item.title || "Image galerie"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title || "Vidéo galerie"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  {item.media_type === "image" ? (
                    <ImageIcon className="h-5 w-5 text-white drop-shadow-lg" />
                  ) : (
                    <Video className="h-5 w-5 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium truncate">{item.title || "Sans titre"}</p>
                <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

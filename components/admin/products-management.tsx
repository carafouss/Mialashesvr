"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  type Product,
  type Category
} from "@/lib/supabase/data-service"
import { useImageUpload } from "@/hooks/use-image-upload"
import { Plus, Edit, Trash2, Upload, Loader2, X, ImagePlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { uploadImage, uploadMultipleImages, uploading } = useImageUpload()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: File[] = []
      const newPreviews: string[] = []

      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`L'image ${file.name} est trop grande. Taille maximale: 5MB`)
          return
        }
        newFiles.push(file)
        
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setImageFiles(prev => [...prev, ...newFiles])
            setImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index))
      setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    
    let allImageUrls: string[] = [...existingImages]
    
    // Upload new images to Vercel Blob
    if (imageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages(imageFiles)
      if (uploadedUrls.length > 0) {
        allImageUrls = [...allImageUrls, ...uploadedUrls]
      }
    }

    // Use first image as main image, rest in images array
    const mainImage = allImageUrls[0] || editingProduct?.image || ""
    const additionalImages = allImageUrls.slice(1)

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      image: mainImage,
      images: additionalImages,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }
      await loadData()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setImagePreviews([])
    setImageFiles([])
    setExistingImages([])
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Etes-vous sur de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id)
        await loadData()
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    // Combine main image and additional images
    const allImages = [product.image, ...(product.images || [])].filter(Boolean)
    setExistingImages(allImages)
    setImagePreviews([])
    setImageFiles([])
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
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
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifiez les informations du produit"
                  : "Remplissez les informations pour ajouter un nouveau produit"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name}
                  placeholder="Ex: Colle Extensions de Cils"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                  placeholder="Description detaillee du produit"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price}
                    placeholder="15000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={editingProduct?.stock}
                    placeholder="25"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Select name="category" defaultValue={editingProduct?.category || categories[0]?.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner une categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageFiles">Images du produit (plusieurs images possibles)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageFiles"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="cursor-pointer"
                    />
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Images existantes:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((img, index) => (
                          <div key={`existing-${index}`} className="relative w-20 h-20 border-2 border-dashed rounded-lg p-1 group">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, true)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[10px] text-center">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Nouvelles images a ajouter:</p>
                      <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative w-20 h-20 border-2 border-dashed border-primary rounded-lg p-1 group">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Nouvelle image ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, false)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Formats acceptes: JPG, PNG, WEBP. Taille max: 5MB par image. 
                    La premiere image sera l&apos;image principale du produit.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                  Annuler
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                  {saving || uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploading ? "Upload images..." : "Sauvegarde..."}
                    </>
                  ) : editingProduct ? "Mettre a jour" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  {product.images && product.images.length > 0 && (
                    <span className="text-xs text-muted-foreground self-end">
                      +{product.images.length}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Prix:</span>
                  <span className="font-bold">{product.price.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Stock:</span>
                  <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>{product.stock} unites</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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

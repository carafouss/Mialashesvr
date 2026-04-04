"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getServices, createService, updateService, deleteService, type Service, type PriceDetail } from "@/lib/supabase/data-service"
import { useImageUpload } from "@/hooks/use-image-upload"
import { Plus, Edit, Trash2, Save, X, Upload, Loader2 } from "lucide-react"

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { uploadImage, uploading } = useImageUpload()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  })
  const [priceDetails, setPriceDetails] = useState<PriceDetail[]>([])
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error("Error loading services:", error)
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
        const result = reader.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      title: "",
      description: "",
      image: "",
      price: "",
    })
    setPriceDetails([])
    setImagePreview("")
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      price: service.price,
    })
    setPriceDetails(service.price_details || [])
    setImagePreview(service.image)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageUrl = formData.image
      
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
      
      const filteredPriceDetails = priceDetails.filter(p => p.label.trim() !== "" && p.price.trim() !== "")
      
      const dataToSave = { 
        title: formData.title,
        description: formData.description,
        price: formData.price,
        image: imageUrl,
        price_details: filteredPriceDetails
      }
      
      if (isAdding) {
        await createService(dataToSave)
      } else if (editingId) {
        await updateService(editingId, dataToSave)
      }
      await loadServices()
      handleCancel()
    } catch (error) {
      console.error("[v0] Error saving service:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette prestation?")) {
      try {
        await deleteService(id)
        await loadServices()
      } catch (error) {
        console.error("Error deleting service:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setImageFile(null)
    setPriceDetails([])
    setFormData({
      title: "",
      description: "",
      image: "",
      price: "",
    })
    setImagePreview("")
  }

  const addPriceDetail = () => {
    setPriceDetails([...priceDetails, { label: "", price: "" }])
  }

  const updatePriceDetail = (index: number, field: keyof PriceDetail, value: string) => {
    const updated = priceDetails.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setPriceDetails(updated)
  }

  const removePriceDetail = (index: number) => {
    setPriceDetails(priceDetails.filter((_, i) => i !== index))
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gestion des Prestations</span>
            {!isAdding && !editingId && (
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Prestation
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(isAdding || editingId) && (
            <Card className="mb-6 border-2 border-primary">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="service-image">Image de la prestation</Label>
                  <div className="mt-2 space-y-4">
                    {imagePreview && (
                      <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Input
                        id="service-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="max-w-md"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="service-image" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir
                        </label>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Taille recommandée: 800x600 pixels</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="service-title">Nom de la prestation</Label>
                  <Input
                    id="service-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Extensions de Cils"
                  />
                </div>

                <div>
                  <Label htmlFor="service-description">Description</Label>
                  <Textarea
                    id="service-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description détaillée de la prestation..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="service-price">Prix principal (affiché sur la carte)</Label>
                  <Input
                    id="service-price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="À partir de 30 000 FCFA"
                  />
                </div>

                {/* Section des tarifs détaillés */}
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Tarifs détaillés</Label>
                      <p className="text-sm text-muted-foreground">Ajoutez les différentes options de prix pour cette prestation</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addPriceDetail}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un tarif
                    </Button>
                  </div>
                  
                  {priceDetails.length > 0 && (
                    <div className="space-y-3">
                      {/* En-têtes des colonnes */}
                      <div className="flex gap-2 items-center px-2">
                        <span className="flex-1 text-xs font-medium text-muted-foreground uppercase">Nom de l&apos;option</span>
                        <span className="w-36 md:w-44 text-xs font-medium text-muted-foreground uppercase">Prix</span>
                        <span className="w-9"></span>
                      </div>
                      {priceDetails.map((detail, index) => (
                        <div key={index} className="flex gap-2 items-center bg-background p-2 rounded-md border">
                          <Input
                            value={detail.label}
                            onChange={(e) => updatePriceDetail(index, "label", e.target.value)}
                            placeholder="Ex: Classic, Volume, 3 jours..."
                            className="flex-1"
                          />
                          <Input
                            value={detail.price}
                            onChange={(e) => updatePriceDetail(index, "price", e.target.value)}
                            placeholder="350 000 FCFA"
                            className="w-36 md:w-44"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removePriceDetail(index)}
                            className="text-destructive hover:text-destructive flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1" disabled={saving || uploading}>
                    {saving || uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {uploading ? "Upload image..." : "Sauvegarde..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className={editingId === service.id ? "opacity-50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {service.image && (
                      <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <p className="text-sm text-primary font-medium">{service.price}</p>
                          {service.price_details && service.price_details.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {service.price_details.map((detail, idx) => (
                                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {detail.label}: <span className="font-medium">{detail.price}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(service)}
                            disabled={isAdding || editingId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(service.id)}
                            disabled={isAdding || editingId !== null}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

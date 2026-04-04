"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Upload, Loader2, X, ImageIcon, Plus } from "lucide-react"
import { getHeroContent, updateHeroContent, type HeroContent } from "@/lib/supabase/data-service"
import { useImageUpload } from "@/hooks/use-image-upload"

export default function HeroManagement() {
  const [heroData, setHeroData] = useState<HeroContent | null>(null)
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { uploadMultipleImages, uploading } = useImageUpload()

  useEffect(() => {
    loadHeroData()
  }, [])

  const loadHeroData = async () => {
    setLoading(true)
    try {
      const data = await getHeroContent()
      if (data) {
        setHeroData(data)
        // Combine main image with images array
        const allImages: string[] = []
        if (data.image) allImages.push(data.image)
        if (data.images && data.images.length > 0) {
          data.images.forEach(img => {
            if (img && !allImages.includes(img)) allImages.push(img)
          })
        }
        setCarouselImages(allImages)
      } else {
        setHeroData({
          id: "",
          image: "",
          images: [],
          title: "L'art de sublimer votre regard",
          subtitle: "Extensions de cils, micropigmentation des sourcils et soins beauté personnalisés",
          updated_at: "",
        })
        setCarouselImages([])
      }
    } catch (error) {
      console.error("Error loading hero data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles: File[] = []
      const previews: string[] = []
      
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`L'image ${file.name} est trop grande. Taille maximale: 5MB`)
          return
        }
        validFiles.push(file)
        
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result as string)
          if (previews.length === validFiles.length) {
            setNewImagePreviews(prev => [...prev, ...previews])
          }
        }
        reader.readAsDataURL(file)
      })
      
      setNewImageFiles(prev => [...prev, ...validFiles])
    }
    // Reset input
    e.target.value = ""
  }

  const removeExistingImage = (index: number) => {
    setCarouselImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!heroData) return
    
    setSaving(true)
    try {
      let allImageUrls = [...carouselImages]
      
      // Upload new images to Vercel Blob
      if (newImageFiles.length > 0) {
        const uploadedUrls = await uploadMultipleImages(newImageFiles)
        if (uploadedUrls.length > 0) {
          allImageUrls = [...allImageUrls, ...uploadedUrls]
        }
      }
      
      // First image is the main image, rest go to images array
      const mainImage = allImageUrls[0] || ""
      const additionalImages = allImageUrls.slice(1)
      
      await updateHeroContent({ 
        ...heroData, 
        image: mainImage,
        images: additionalImages
      })
      
      setNewImageFiles([])
      setNewImagePreviews([])
      setCarouselImages(allImageUrls)
      alert("Page d'accueil mise à jour avec succès!")
    } catch (error) {
      console.error("Error saving hero data:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!heroData) {
    return <div>Erreur de chargement</div>
  }

  const totalImages = carouselImages.length + newImagePreviews.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de la Page d&apos;Accueil</CardTitle>
        <CardDescription>Modifiez les images du carousel et les textes de la section hero</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images Carousel Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Images du Carousel</Label>
              <p className="text-sm text-muted-foreground">
                Ajoutez jusqu&apos;à 5 images pour le carousel. La première sera l&apos;image principale.
              </p>
            </div>
            {totalImages < 5 && (
              <Button variant="outline" className="relative bg-transparent" asChild>
                <label htmlFor="carousel-images" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter des images
                  <input
                    id="carousel-images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddImages}
                  />
                </label>
              </Button>
            )}
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing images */}
            {carouselImages.map((img, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                  <img src={img} alt={`Carousel ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                      Image principale
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Supprimer l'image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {/* New images previews */}
            {newImagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-accent">
                  <img src={preview} alt={`Nouvelle image ${index + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-1 bg-accent/80 text-accent-foreground text-xs font-medium rounded">
                    Nouvelle
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Supprimer l'image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Empty state */}
            {totalImages === 0 && (
              <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />
                <p className="text-sm">Aucune image</p>
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Taille recommandée: 1920x1080 pixels (Format paysage). {totalImages}/5 images
          </p>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="hero-title">Titre principal</Label>
          <Input
            id="hero-title"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            placeholder="L'art de sublimer votre regard"
            className="mt-2"
          />
        </div>

        {/* Subtitle */}
        <div>
          <Label htmlFor="hero-subtitle">Sous-titre / Description</Label>
          <Textarea
            id="hero-subtitle"
            value={heroData.subtitle}
            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
            placeholder="Extensions de cils, micropigmentation des sourcils..."
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving || uploading} className="w-full">
          {saving || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploading ? "Upload des images..." : "Sauvegarde..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

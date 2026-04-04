"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAboutContent, updateAboutContent, type AboutContent } from "@/lib/supabase/data-service"
import { useImageUpload } from "@/hooks/use-image-upload"
import { Upload, Save, Loader2 } from "lucide-react"

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { uploadImage, uploading } = useImageUpload()

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    setLoading(true)
    try {
      const data = await getAboutContent()
      if (data) {
        setAboutData(data)
        setImagePreview(data.image)
      } else {
        // Default values if no data exists
        setAboutData({
          id: "",
          image: "",
          title: "Notre Philosophie",
          subtitle: "L'excellence au service de votre beauté",
          paragraph1: "",
          paragraph2: "",
          paragraph3: "",
          badge_text: "Expert en extensions de cils",
          updated_at: "",
        })
      }
    } catch (error) {
      console.error("Error loading about data:", error)
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

  const handleSave = async () => {
    if (!aboutData) return
    
    setSaving(true)
    try {
      let imageUrl = aboutData.image
      
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
      
      await updateAboutContent({ ...aboutData, image: imageUrl })
      setImageFile(null)
      alert("Section À Propos mise à jour avec succès!")
    } catch (error) {
      console.error("Error saving about data:", error)
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

  if (!aboutData) {
    return <div>Erreur de chargement</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de la section À Propos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image */}
        <div>
          <Label htmlFor="about-image">Image principale</Label>
          <div className="mt-2 space-y-4">
            {imagePreview && (
              <div className="relative aspect-[4/3] w-full max-w-md rounded-lg overflow-hidden border">
                <img src={imagePreview || "/placeholder.svg"} alt="Aperçu" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <Input id="about-image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-md" />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="about-image" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </label>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Taille recommandée: 800x600 pixels (ratio 4:3)</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="about-title">Titre principal</Label>
          <Input
            id="about-title"
            value={aboutData.title}
            onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
            placeholder="Notre Philosophie"
          />
        </div>

        {/* Subtitle */}
        <div>
          <Label htmlFor="about-subtitle">Sous-titre</Label>
          <Input
            id="about-subtitle"
            value={aboutData.subtitle}
            onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
            placeholder="L'excellence au service de votre beauté"
          />
        </div>

        {/* Description paragraphs */}
        <div className="space-y-4">
          <Label>Paragraphes de description</Label>
          <Textarea
            value={aboutData.paragraph1}
            onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
            placeholder="Paragraphe 1"
            rows={3}
          />
          <Textarea
            value={aboutData.paragraph2}
            onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
            placeholder="Paragraphe 2"
            rows={3}
          />
          <Textarea
            value={aboutData.paragraph3}
            onChange={(e) => setAboutData({ ...aboutData, paragraph3: e.target.value })}
            placeholder="Paragraphe 3"
            rows={3}
          />
        </div>

        {/* Badge */}
        <div>
          <Label htmlFor="badge-text">Badge</Label>
          <Input
            id="badge-text"
            value={aboutData.badge_text}
            onChange={(e) => setAboutData({ ...aboutData, badge_text: e.target.value })}
            placeholder="Expert en extensions de cils"
          />
        </div>

        <Button onClick={handleSave} className="w-full" disabled={saving || uploading}>
          {saving || uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploading ? "Upload image..." : "Sauvegarde..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

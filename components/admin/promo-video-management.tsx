"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Video, Save } from "lucide-react"
import { getPromoVideo, updatePromoVideo, type PromoVideo } from "@/lib/supabase/data-service"
import { toast } from "sonner"

export default function PromoVideoManagement() {
  const [promoVideo, setPromoVideo] = useState<PromoVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    is_active: true
  })

  useEffect(() => {
    loadPromoVideo()
  }, [])

  const loadPromoVideo = async () => {
    setLoading(true)
    const data = await getPromoVideo()
    if (data) {
      setPromoVideo(data)
      setFormData({
        title: data.title || "",
        video_url: data.video_url || "",
        thumbnail_url: data.thumbnail_url || "",
        is_active: data.is_active
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const updated = await updatePromoVideo(formData)
    if (updated) {
      toast.success("Vidéo promotionnelle mise à jour")
      setPromoVideo(updated)
    } else {
      toast.error("Erreur lors de la mise à jour")
    }
    
    setSaving(false)
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
      <div>
        <h2 className="text-2xl font-bold">Vidéo Promotionnelle</h2>
        <p className="text-muted-foreground">Gérez la vidéo affichée sur la page d&apos;accueil</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Titre de la vidéo</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Découvrez Mia Lashes"
                />
              </div>

              <div className="space-y-2">
                <Label>URL de la vidéo</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/... ou URL directe"
                />
                <p className="text-xs text-muted-foreground">
                  Formats supportés : YouTube (embed), Vimeo, ou lien direct vers fichier vidéo
                </p>
              </div>

              <div className="space-y-2">
                <Label>URL de la miniature (optionnel)</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Image affichée avant la lecture de la vidéo
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.video_url ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {formData.video_url.includes("youtube.com") || formData.video_url.includes("youtu.be") ? (
                  <iframe
                    src={formData.video_url.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : formData.video_url.includes("vimeo.com") ? (
                  <iframe
                    src={formData.video_url}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={formData.video_url}
                    poster={formData.thumbnail_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune vidéo configurée</p>
                  <p className="text-xs">Ajoutez une URL pour voir l&apos;aperçu</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { getPromoVideo, type PromoVideo } from "@/lib/supabase/data-service"

export default function PromoVideoSection() {
  const [promoVideo, setPromoVideo] = useState<PromoVideo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromoVideo()
  }, [])

  const loadPromoVideo = async () => {
    setLoading(true)
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      )
      const data = await Promise.race([getPromoVideo(), timeoutPromise])
      setPromoVideo(data)
    } catch (error) {
      console.error("Error loading promo video:", error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no video URL
  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse bg-muted h-8 w-64 mx-auto rounded mb-4"></div>
            <div className="animate-pulse bg-muted aspect-video max-w-4xl mx-auto rounded-2xl"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!promoVideo || !promoVideo.video_url) {
    return null
  }

  const isYouTube = promoVideo.video_url.includes("youtube.com") || promoVideo.video_url.includes("youtu.be")
  const isVimeo = promoVideo.video_url.includes("vimeo.com")

  const getEmbedUrl = (url: string) => {
    if (isYouTube) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()
        : new URL(url).searchParams.get("v")
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (isVimeo) {
      const videoId = url.split("/").pop()
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return url
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            {promoVideo.title || "Découvrez Mia Lashes"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plongez dans l&apos;univers de la beauté et découvrez notre expertise en extensions de cils et soins du regard
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            {!isPlaying ? (
              <>
                {promoVideo.thumbnail_url ? (
                  <img
                    src={promoVideo.thumbnail_url}
                    alt={promoVideo.title || "Vidéo promotionnelle"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">Aperçu vidéo</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                    aria-label="Lire la vidéo"
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {isYouTube || isVimeo ? (
                  <iframe
                    src={getEmbedUrl(promoVideo.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={promoVideo.video_url}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

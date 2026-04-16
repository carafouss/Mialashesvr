"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Generate unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(7)
      const extension = file.name.split(".").pop()
      const filename = `products/${timestamp}-${randomId}.${extension}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("[v0] Supabase upload error:", uploadError)
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
      return null
    } finally {
      setUploading(false)
    }
  }

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    console.log("[v0] uploadMultipleImages called with", files.length, "files")
    setUploading(true)
    setError(null)
    const uploadedUrls: string[] = []

    try {
      const supabase = createClient()
      
      for (const file of files) {
        console.log("[v0] Uploading file:", file.name, file.size, file.type)
        
        // Generate unique filename
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const extension = file.name.split(".").pop()
        const filename = `products/${timestamp}-${randomId}.${extension}`

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from("images")
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error("[v0] Supabase upload error:", uploadError)
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(data.path)

        console.log("[v0] Upload result:", urlData.publicUrl)
        uploadedUrls.push(urlData.publicUrl)
      }
      
      console.log("[v0] All uploads complete. URLs:", uploadedUrls)
      return uploadedUrls
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
      return uploadedUrls
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const supabase = createClient()
      
      // Extract path from URL
      const urlObj = new URL(url)
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/)
      if (!pathMatch) return false
      
      const filePath = pathMatch[1]
      
      const { error } = await supabase.storage
        .from("images")
        .remove([filePath])

      return !error
    } catch {
      return false
    }
  }

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    uploading,
    error,
  }
}

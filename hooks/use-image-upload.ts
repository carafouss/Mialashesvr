"use client"

import { useState } from "react"

interface UploadResult {
  url: string
  filename: string
  size: number
  type: string
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result: UploadResult = await response.json()
      return result.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      return null
    } finally {
      setUploading(false)
    }
  }

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    setUploading(true)
    setError(null)
    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`)
        }

        const result: UploadResult = await response.json()
        uploadedUrls.push(result.url)
      }
      return uploadedUrls
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      return uploadedUrls
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      return response.ok
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

"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ProductUploadZoneProps {
  onProductData: (data: { name: string; description: string; image: string }) => void
  onComplete: () => void
}

export function ProductUploadZone({ onProductData, onComplete }: ProductUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleImageConversion = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        handleImageConversion(file)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImageConversion(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productName || !productDescription || !imagePreview) {
      alert("Please fill in all fields and upload an image")
      return
    }

    setIsLoading(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    onProductData({
      name: productName,
      description: productDescription,
      image: imagePreview,
    })

    setIsLoading(false)
    onComplete()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Upload your product image and details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground">Click or drag to replace image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">Drag and drop your product image</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="image-input" />
            <label htmlFor="image-input" className="cursor-pointer">
              <div className="mt-4">
                <Button type="button" variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </label>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
            <Input
              type="text"
              placeholder="Enter your product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Description</label>
            <textarea
              placeholder="Describe your product, its features, and benefits"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Generate SEO Content"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

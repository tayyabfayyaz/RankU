"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface InstagramData {
  productImage: File | null
  productName: string
  productDescription: string
  targetAudience: string
}

interface InstagramFormProps {
  data: InstagramData
  setData: (data: InstagramData) => void
  onGenerate: () => void
  isLoading: boolean
}

export function InstagramForm({ data, setData, onGenerate, isLoading }: InstagramFormProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData({ ...data, productImage: file })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-dashed border-pink-300">
        <div className="flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-pink-50 rounded-lg transition">
          <Upload className="h-12 w-12 text-pink-500 mb-4" />
          <p className="text-lg font-semibold text-gray-800 mb-2">Upload Product Image</p>
          <p className="text-sm text-gray-500 mb-4">Drag and drop or click to select</p>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          <label htmlFor="image-upload">
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <span>Select Image</span>
            </Button>
          </label>
          {data.productImage && <p className="text-sm text-green-600 mt-4">✓ {data.productImage.name}</p>}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Product Name *</label>
          <Input
            placeholder="e.g., Premium Wireless Headphones"
            value={data.productName}
            onChange={(e) => setData({ ...data, productName: e.target.value })}
            className="border-pink-200 focus:border-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Product Description *</label>
          <Textarea
            placeholder="Describe your product, features, and benefits..."
            value={data.productDescription}
            onChange={(e) => setData({ ...data, productDescription: e.target.value })}
            className="border-pink-200 focus:border-pink-500 min-h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Target Audience *</label>
          <Input
            placeholder="e.g., Music lovers, athletes, professionals"
            value={data.targetAudience}
            onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
            className="border-pink-200 focus:border-pink-500"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold"
        >
          {isLoading ? "Generating..." : "Generate SEO Content"}
        </Button>
      </Card>
    </div>
  )
}

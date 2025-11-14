"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export interface YouTubeVideoData {
  videoTitle: string
  videoDescription: string
  targetAudience?: string
  keywords?: string
}

interface YouTubeFormProps {
  data: YouTubeVideoData | null
  setData: (data: YouTubeVideoData) => void
  onGenerate: () => void
  isLoading: boolean
}

export function YouTubeForm({ data, setData, onGenerate, isLoading }: YouTubeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData({
      ...data || { videoTitle: "", videoDescription: "", targetAudience: "", keywords: "" },
      [name]: value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!data?.videoTitle?.trim()) {
      newErrors.videoTitle = "Video title is required"
    }
    if (!data?.videoDescription?.trim()) {
      newErrors.videoDescription = "Video description is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onGenerate()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Video Title */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Video Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="videoTitle"
            value={data?.videoTitle || ""}
            onChange={handleChange}
            placeholder="Enter your YouTube video title"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground ${
              errors.videoTitle ? "border-red-500" : "border-input"
            }`}
            disabled={isLoading}
          />
          {errors.videoTitle && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.videoTitle}
            </p>
          )}
        </div>

        {/* Video Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Video Description <span className="text-red-600">*</span>
          </label>
          <textarea
            name="videoDescription"
            value={data?.videoDescription || ""}
            onChange={handleChange}
            placeholder="Enter your video description"
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground resize-none ${
              errors.videoDescription ? "border-red-500" : "border-input"
            }`}
            disabled={isLoading}
          />
          {errors.videoDescription && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.videoDescription}
            </p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Target Audience <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            name="targetAudience"
            value={data?.targetAudience || ""}
            onChange={handleChange}
            placeholder="e.g., Business professionals, Students, Tech enthusiasts"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
            disabled={isLoading}
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Keywords <span className="text-muted-foreground text-xs">(Optional - comma separated)</span>
          </label>
          <input
            type="text"
            name="keywords"
            value={data?.keywords || ""}
            onChange={handleChange}
            placeholder="e.g., tutorial, beginner, step-by-step"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoading ? "Generating..." : "Generate SEO Content"}
        </Button>
      </CardContent>
    </Card>
  )
}

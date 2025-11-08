"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"

interface YouTubeFormProps {
  onComplete: (data: YouTubeVideoData) => void
}

export interface YouTubeVideoData {
  videoContent: string
  targetAudience: string
  category: string
  videoTitle: string
  keyPoints: string
  videoLink: string
  videoDescription: string
}

export function YouTubeForm({ onComplete }: YouTubeFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<YouTubeVideoData>({
    videoContent: "",
    targetAudience: "",
    category: "",
    videoTitle: "",
    keyPoints: "",
    videoLink: "",
    videoDescription: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.videoContent.trim()) {
        newErrors.videoContent = "Video content description is required"
      } else if (formData.videoContent.trim().length < 20) {
        newErrors.videoContent = "Please provide more details about your video content (at least 20 characters)"
      }
    }

    if (currentStep === 2) {
      if (!formData.targetAudience.trim()) {
        newErrors.targetAudience = "Target audience is required"
      } else if (formData.targetAudience.trim().length < 15) {
        newErrors.targetAudience = "Please describe your target audience in more detail"
      }
    }

    if (currentStep === 3) {
      if (!formData.videoTitle.trim()) {
        newErrors.videoTitle = "Video title is required"
      }
      if (!formData.category.trim()) {
        newErrors.category = "Video category is required"
      }
      if (!formData.keyPoints.trim()) {
        newErrors.keyPoints = "Key points are required"
      } else if (formData.keyPoints.trim().length < 20) {
        newErrors.keyPoints = "Please provide more details about your key points"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(step)) {
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      onComplete(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>YouTube Video SEO Optimization</CardTitle>
        <CardDescription>
          Step {step} of 3 - {step === 1 ? "Video Content" : step === 2 ? "Target Audience" : "Additional Details"}
        </CardDescription>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-6">
          {/* Step 1: Video Content */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What is your video about? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-3">Describe the main content and topic of your video</p>
                <Textarea
                  name="videoContent"
                  placeholder="e.g., A tutorial on how to build a React application with TypeScript, covering hooks, state management, and best practices..."
                  value={formData.videoContent}
                  onChange={handleChange}
                  rows={5}
                  className={errors.videoContent ? "border-red-500" : ""}
                />
                {errors.videoContent && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.videoContent}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Target Audience */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Who is your target audience? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Describe the demographics and interests of your viewers
                </p>
                <Textarea
                  name="targetAudience"
                  placeholder="e.g., Beginner to intermediate web developers interested in React, ages 18-35, working in tech or learning to code..."
                  value={formData.targetAudience}
                  onChange={handleChange}
                  rows={5}
                  className={errors.targetAudience ? "border-red-500" : ""}
                />
                {errors.targetAudience && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetAudience}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="videoTitle"
                  placeholder="Enter your video title"
                  value={formData.videoTitle}
                  onChange={handleChange}
                  className={errors.videoTitle ? "border-red-500" : ""}
                />
                {errors.videoTitle && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.videoTitle}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground ${
                    errors.category ? "border-red-500" : "border-input"
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="gaming">Gaming</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="travel">Travel</option>
                  <option value="tutorial">Tutorial</option>
                </select>
                {errors.category && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </div>
                )}
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What are the key points in your video? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">List the main topics covered in your video</p>
                <Textarea
                  name="keyPoints"
                  placeholder="e.g., React hooks, useState, useEffect, useContext, custom hooks, performance optimization, best practices..."
                  value={formData.keyPoints}
                  onChange={handleChange}
                  rows={4}
                  className={errors.keyPoints ? "border-red-500" : ""}
                />
                {errors.keyPoints && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.keyPoints}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1 bg-transparent">
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Generate SEO Content
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

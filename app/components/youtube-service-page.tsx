"use client"

import { useState } from "react"
import { Navigation } from "@/app/components/navigation"
import { Footer } from "@/app/components/footer"
import { YouTubeForm, type YouTubeVideoData } from "@/app/components/youtube-form"
import { SEOContentGenerator } from "@/app/components/seo-content-generator"
import { PlayCircle, Zap, Sparkles, AlertCircle, Loader2, FileText, Tag, Target } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

interface GeneratedContent {
  title?: string
  description?: string
  tags?: string[]
  keywords?: string[]
  youtubeTitle?: string
  youtubeDescription?: string
  youtubeTags?: string[]
  error?: string
  code?: string
  details?: string
  metadata?: {
    processingTime: number
    model: string
    generatedAt: string
  }
}

export default function YouTubeServicePage() {
  const [youtubeData, setYoutubeData] = useState<YouTubeVideoData | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleGenerate = async () => {
    if (!youtubeData?.videoTitle || !youtubeData?.videoDescription) {
      setErrorMessage("Please fill in all required fields: Video Title and Description")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setGeneratedContent(null)

    try {
      const response = await fetch("/api/generate-seo-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "youtube",
          videoTitle: youtubeData.videoTitle,
          videoDescription: youtubeData.videoDescription,
          targetAudience: youtubeData.targetAudience || "",
          keywords: youtubeData.keywords || "",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP Error: ${response.status}`)
      }

      const data: GeneratedContent = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.youtubeTitle && !data.youtubeDescription && !data.youtubeTags && !data.keywords) {
        throw new Error("No content was generated. Please try again.")
      }

      setGeneratedContent(data)
      setShowGenerator(true)
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to generate content. Please try again."
      setErrorMessage(errorMsg)
      setShowGenerator(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-background py-16 px-4 sm:px-6 lg:px-8 border-b border-red-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-lg">
              <PlayCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">YouTube SEO</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-foreground mb-4">Optimize Your YouTube Videos</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Our AI agent analyzes your video content and generates SEO-optimized titles, descriptions, tags, and
              keywords to maximize visibility and engagement.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-red-200">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-foreground">AI-Powered Optimization</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-red-200">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-foreground">Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href="/services">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Info & Form */}
            <div className="lg:col-span-1 sticky top-24 h-fit">
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">YouTube SEO</h2>
                <p className="text-red-100 mb-6">
                  Enhance your video visibility with data-driven SEO optimization
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-red-200">Generate:</p>
                    <ul className="text-sm text-red-100 space-y-1 mt-2">
                      <li>✓ Optimized titles</li>
                      <li>✓ SEO descriptions</li>
                      <li>✓ Strategic tags</li>
                      <li>✓ Performance keywords</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Generator */}
            <div className="lg:col-span-2">
              {errorMessage && (
                <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">Error generating content</p>
                        <p className="text-sm text-red-800 dark:text-red-200 mt-1">{errorMessage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                      <p className="text-foreground font-medium">Generating your YouTube SEO content...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!showGenerator && !isLoading ? (
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">Tell Us About Your Video</h2>
                  <YouTubeForm
                    data={youtubeData}
                    setData={setYoutubeData}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                  />
                </div>
              ) : showGenerator && generatedContent ? (
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">Generated SEO Content</h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGenerator(false)
                      setGeneratedContent(null)
                      setErrorMessage("")
                    }}
                    className="mb-6"
                  >
                    Generate New Content
                  </Button>
                  <SEOContentGenerator platform="youtube" content={generatedContent} />
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">Generated SEO Content</h2>
                  <Card className="border-2 border-dashed border-red-200 bg-red-50/30">
                    <CardContent className="pt-12 pb-12 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-lg flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground mb-2">Ready to Generate SEO Content?</p>
                          <p className="text-muted-foreground">
                            Fill out the form on the left with your video details to get started
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50/50 border-t border-red-200/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What We Generate For You</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Optimized Title",
                description: "SEO-friendly titles under 60 characters with primary keywords",
                icon: FileText,
              },
              {
                title: "Description",
                description: "300-400 word SEO-optimized descriptions with natural keyword placement",
                icon: PlayCircle,
              },
              {
                title: "Tags",
                description: "15 strategic tags to improve discoverability and reach",
                icon: Tag,
              },
              {
                title: "Keywords",
                description: "12 high-performing keywords researched for your content",
                icon: Target,
              },
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <Card key={index} className="hover:border-red-300 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 mb-3 bg-red-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

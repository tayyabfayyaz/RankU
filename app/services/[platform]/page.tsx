"use client"

import { useState } from "react"
import { Navigation } from "@/app/components/navigation"
import { Footer } from "@/app/components/footer"
import { ProductUploadZone } from "@/app/components/upload-product-zone"
import { SEOContentGenerator } from "@/app/components/seo-content-generator"
import { YouTubeForm, type YouTubeVideoData } from "@/app/components/youtube-form"
import { PlayCircle, Zap, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ServicePageProps {
  params: {
    platform: string
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const [productData, setProductData] = useState<{
    name: string
    description: string
    image: string
  } | null>(null)
  const [youtubeData, setYoutubeData] = useState<YouTubeVideoData | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  const platformConfig = {
    instagram: {
      title: "Instagram SEO",
      description: "Upload your product and let our AI generate optimized Instagram content with trending keywords",
      color: "from-pink-500 to-rose-500",
    },
    facebook: {
      title: "Facebook SEO",
      description: "Optimize your product for Facebook with AI-powered keyword research and content generation",
      color: "from-blue-600 to-blue-400",
    },
    website: {
      title: "Website SEO",
      description: "Create comprehensive SEO content for your website with competitive analysis",
      color: "from-purple-500 to-indigo-500",
    },
    youtube: {
      title: "YouTube SEO",
      description: "Optimize your YouTube video with AI-powered titles, descriptions, tags, and keyword research",
      color: "from-red-500 to-red-600",
    },
  }

  const config = platformConfig[params.platform as keyof typeof platformConfig] || platformConfig.website
  const isYoutube = params.platform === "youtube"

  if (isYoutube) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-background">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-red-200/50">
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
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <h2 className="text-3xl font-bold text-foreground mb-8">Tell Us About Your Video</h2>
                  <YouTubeForm
                    onComplete={(data) => {
                      console.log("[v0] YouTube form completed with data:", data)
                      setYoutubeData(data)
                      setShowGenerator(true)
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Generator */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold text-foreground mb-8">Generated SEO Content</h2>

                {youtubeData && showGenerator ? (
                  <SEOContentGenerator productData={null} youtubeData={youtubeData} platform="youtube" />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50/50 border-t border-red-200/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What We Generate For You</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Optimized Title",
                  description: "SEO-friendly titles under 60 characters with primary keywords",
                  icon: "📝",
                },
                {
                  title: "Description",
                  description: "300-400 word SEO-optimized descriptions with natural keyword placement",
                  icon: "📄",
                },
                {
                  title: "Tags",
                  description: "15 strategic tags to improve discoverability and reach",
                  icon: "🏷️",
                },
                {
                  title: "Keywords",
                  description: "12 high-performing keywords researched for your content",
                  icon: "🎯",
                },
              ].map((item, index) => (
                <Card key={index} className="hover:border-red-300 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">{config.title}</h1>
            <p className="text-lg text-muted-foreground">{config.description}</p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Zone */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Step 1: Upload Your Product</h2>
              <ProductUploadZone onProductData={setProductData} onComplete={() => setShowGenerator(true)} />
            </div>

            {/* Content Generator */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Step 2: Generate SEO Content</h2>
              {productData && showGenerator ? (
                <SEOContentGenerator
                  key={`generator-${params.platform}`}
                  productData={productData}
                  youtubeData={null}
                  platform={params.platform}
                />
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Upload your product to generate SEO content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

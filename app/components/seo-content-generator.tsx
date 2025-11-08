"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { YouTubeVideoData } from "@/app/components/youtube-form"

interface SEOContentGeneratorProps {
  productData?: {
    name: string
    description: string
    image: string
  } | null
  youtubeData?: YouTubeVideoData | null
  platform: string
}

interface GeneratedContent {
  keywords: string[]
  seoContent: string
  competitiveProducts: Array<{
    name: string
    keywords: string[]
    description: string
  }>
  suggestions: string[]
  youtubeTitle?: string
  youtubeDescription?: string
  youtubeTags?: string[]
}

export function SEOContentGenerator({ productData, youtubeData, platform }: SEOContentGeneratorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateSEOContent()
  }, [productData, youtubeData])

  const generateSEOContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const requestBody = youtubeData
        ? {
            videoLink: youtubeData.videoLink,
            videoTitle: youtubeData.videoTitle,
            targetAudience: youtubeData.targetAudience,
            videoDescription: youtubeData.videoDescription,
            category: youtubeData.category,
            platform: platform,
            isYoutube: true,
          }
        : {
            productName: productData?.name,
            productDescription: productData?.description,
            platform: platform,
            imageBase64: productData?.image,
            isYoutube: false,
          }

      const response = await fetch("/api/generate-seo-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to generate SEO content")
      }

      const data = await response.json()
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">
              {youtubeData
                ? "Analyzing your video and generating SEO content..."
                : "Analyzing your product and generating SEO content..."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">AI Gateway Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-600">
            {error.includes("credit card")
              ? "To use AI-powered content generation, you need to add a credit card to your Vercel account."
              : `Error: ${error}`}
          </p>
          {error.includes("credit card") && (
            <div className="space-y-3">
              <p className="text-sm text-red-700">Here's how to fix it:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-red-700">
                <li>Go to your Vercel Dashboard</li>
                <li>Click on your account/team settings</li>
                <li>Navigate to Billing → Payment Method</li>
                <li>Add your credit card</li>
                <li>Return here and try again</li>
              </ol>
              <a
                href="https://vercel.com/account/billing/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-red-600 hover:bg-red-700">Go to Vercel Billing</Button>
              </a>
            </div>
          )}
          <Button onClick={generateSEOContent} className="mt-4 w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">{youtubeData ? "Description" : "SEO Content"}</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          {youtubeData && <TabsTrigger value="youtube">YouTube Optimization</TabsTrigger>}
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        {/* SEO Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>{youtubeData ? "Optimized Video Description" : "Optimized SEO Content"}</CardTitle>
              <CardDescription>AI-generated content optimized for {platform} with targeted keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{content.seoContent}</p>
              </div>
              <Button className="mt-6 w-full bg-transparent" variant="outline">
                Copy Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Researched Keywords</CardTitle>
              <CardDescription>High-performing keywords for your {youtubeData ? "video" : "product"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">{keyword}</span>
                    <Button size="sm" variant="ghost">
                      Copy
                    </Button>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-foreground mb-4">Optimization Suggestions</h3>
                <ul className="space-y-2">
                  {content.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">✓</span>
                      <span className="text-foreground">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {youtubeData && (
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>YouTube Optimization</CardTitle>
                <CardDescription>AI-generated title, description, and tags for YouTube</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Optimized Title */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Optimized Video Title</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-medium">{content.youtubeTitle}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {content.youtubeTitle?.length || 0}/60 characters
                    </p>
                  </div>
                  <Button className="mt-3 w-full bg-transparent" variant="outline">
                    Copy Title
                  </Button>
                </div>

                {/* Optimized Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Optimized Video Description</h3>
                  <div className="p-4 bg-muted rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-foreground whitespace-pre-wrap text-sm">{content.youtubeDescription}</p>
                  </div>
                  <Button className="mt-3 w-full bg-transparent" variant="outline">
                    Copy Description
                  </Button>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Recommended Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.youtubeTags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full cursor-pointer hover:bg-primary/20 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button className="mt-4 w-full bg-transparent" variant="outline">
                    Copy All Tags
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Competitors Tab */}
        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitive {youtubeData ? "Videos" : "Products"}</CardTitle>
              <CardDescription>Similar {youtubeData ? "videos" : "products"} and their SEO strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.competitiveProducts.map((product, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.keywords.map((keyword, kIndex) => (
                        <span key={kIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

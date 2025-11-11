"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"

interface YouTubeVideoData {
  videoLink: string
  videoTitle: string
  targetAudience: string
  videoDescription: string
  category: string
}

interface SEOContentGeneratorProps {
  productData?: {
    name: string
    description: string
    image: string
  } | null
  youtubeData?: YouTubeVideoData | null
  platform: string
  onRegenerate?: () => void
}

interface GeneratedContent {
  keywords: string[]
  seoContent: string
  competitiveProducts?: Array<{
    name: string
    keywords: string[]
    description: string
  }>
  suggestions: string[]
  youtubeTitle?: string
  youtubeDescription?: string
  youtubeTags?: string[]
  metaTitle?: string
  metaDescription?: string
  onPageContent?: string
}

interface ApiError {
  error: string
  details?: string
  help?: string
}

export function SEOContentGenerator({ 
  productData, 
  youtubeData, 
  platform, 
  onRegenerate 
}: SEOContentGeneratorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    // Reset state when props change
    setContent(null)
    setError(null)
    setHasGenerated(false)
    setIsLoading(true)
  }, [productData, youtubeData, platform])

  useEffect(() => {
    // Only generate content once when we have actual product data
    if ((productData?.name && productData?.description) || 
        (youtubeData?.videoTitle && youtubeData?.targetAudience)) {
      if (!hasGenerated) {
        generateSEOContent()
        setHasGenerated(true)
      }
    } else {
      setIsLoading(false)
    }
  }, [productData, youtubeData, platform, hasGenerated])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const generateSEOContent = async () => {
    setIsLoading(true)
    setError(null)
    setContent(null)

    try {
      // Validate we have the required data
      if (youtubeData) {
        if (!youtubeData.videoTitle || !youtubeData.targetAudience) {
          throw new Error("Missing required YouTube data: video title and target audience")
        }
      } else if (productData) {
        if (!productData.name || !productData.description) {
          throw new Error("Missing required product data: name and description")
        }
      } else {
        throw new Error("No product or YouTube data provided")
      }

      const requestBody = youtubeData
        ? {
            type: platform,
            videoContent: youtubeData.videoTitle,
            targetAudience: youtubeData.targetAudience,
            videoDescription: youtubeData.videoDescription || "",
            videoCategory: youtubeData.category || "Product Review",
          }
        : {
            type: platform,
            productName: productData?.name,
            productDescription: productData?.description,
            targetAudience: "general audience",
          }

      console.log("🟡 Sending SEO request:", requestBody)

      const response = await fetch("/api/generate-seo-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to generate SEO content: ${response.status}`)
      }

      // Check if this is a platform detection response (not actual content)
      if (data.message && data.requiresProductData) {
        console.log("🟡 Received platform detection response, ignoring...")
        return
      }

      // Only set content for actual generated content
      if (data.seoContent || data.youtubeTitle || data.metaTitle) {
        console.log("🟢 Setting generated content:", data)
        setContent(data)
      } else {
        throw new Error("No content generated in API response")
      }
    } catch (err) {
      console.error("🔴 SEO generation error:", err)
      setError({
        error: err instanceof Error ? err.message : "An error occurred",
        details: err instanceof Error ? err.message : undefined
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Safe access to array properties
  const keywords = content?.keywords || []
  const suggestions = content?.suggestions || []
  const competitiveProducts = content?.competitiveProducts || []
  const youtubeTags = content?.youtubeTags || []

  const LoadingSkeleton = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">
            {youtubeData
              ? "Analyzing your video and generating SEO content..."
              : "Analyzing your product and generating SEO content..."}
          </p>
          <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Error Generating Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-600">{error.error}</p>
          {error.details && (
            <p className="text-sm text-red-500">{error.details}</p>
          )}
          {error.help && (
            <p className="text-sm text-red-700">{error.help}</p>
          )}
          <div className="flex gap-3">
            <Button onClick={generateSEOContent} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            {onRegenerate && (
              <Button onClick={onRegenerate} variant="outline">
                Change Input
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">Ready to generate SEO content.</p>
            <Button onClick={generateSEOContent} className="mx-auto">
              Generate SEO Content
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">
                SEO Content Generated Successfully!
              </h3>
              <p className="text-green-600 text-sm">
                Optimized for {platform} with AI-powered insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            {youtubeData ? "Description" : platform === "website" ? "On-Page SEO" : "SEO Content"}
          </TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          {(youtubeData || platform === "website") && (
            <TabsTrigger value="optimization">
              {platform === "website" ? "Meta Tags" : "YouTube Optimization"}
            </TabsTrigger>
          )}
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        {/* SEO Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>
                {platform === "website" 
                  ? "On-Page SEO Recommendations" 
                  : youtubeData 
                    ? "Optimized Video Description" 
                    : "Optimized SEO Content"
                }
              </CardTitle>
              <CardDescription>
                AI-generated content optimized for {platform} with targeted keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {content.seoContent || content.onPageContent}
                </p>
              </div>
              <Button 
                className="mt-6 w-full"
                variant="outline"
                onClick={() => copyToClipboard(content.seoContent || content.onPageContent || "", "content")}
              >
                {copiedField === "content" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Researched Keywords</CardTitle>
              <CardDescription>
                High-performing keywords for your {youtubeData ? "video" : "product"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywords.length > 0 ? (
                  keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium text-foreground">{keyword}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(keyword, `keyword-${index}`)}
                      >
                        {copiedField === `keyword-${index}` ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No keywords generated</p>
                )}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-foreground mb-4">Optimization Suggestions</h3>
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 font-bold mt-1">✓</span>
                        <span className="text-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        {(youtubeData || platform === "website") && (
          <TabsContent value="optimization">
            <Card>
              <CardHeader>
                <CardTitle>
                  {platform === "website" ? "Meta Tags Optimization" : "YouTube Optimization"}
                </CardTitle>
                <CardDescription>
                  {platform === "website" 
                    ? "AI-generated meta titles and descriptions for better search visibility"
                    : "AI-generated title, description, and tags for YouTube"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {platform === "website" ? (
                  <>
                    {/* Meta Title */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Meta Title</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-foreground font-medium">{content.metaTitle || "No meta title generated"}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {(content.metaTitle?.length || 0)}/60 characters
                        </p>
                      </div>
                      <Button 
                        className="mt-3 w-full"
                        variant="outline"
                        onClick={() => copyToClipboard(content.metaTitle || "", "metaTitle")}
                        disabled={!content.metaTitle}
                      >
                        {copiedField === "metaTitle" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Meta Title
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Meta Description</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-foreground">{content.metaDescription || "No meta description generated"}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {(content.metaDescription?.length || 0)}/160 characters
                        </p>
                      </div>
                      <Button 
                        className="mt-3 w-full"
                        variant="outline"
                        onClick={() => copyToClipboard(content.metaDescription || "", "metaDescription")}
                        disabled={!content.metaDescription}
                      >
                        {copiedField === "metaDescription" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Meta Description
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* YouTube Title */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Optimized Video Title</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-foreground font-medium">{content.youtubeTitle || "No title generated"}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {(content.youtubeTitle?.length || 0)}/60 characters
                        </p>
                      </div>
                      <Button 
                        className="mt-3 w-full"
                        variant="outline"
                        onClick={() => copyToClipboard(content.youtubeTitle || "", "youtubeTitle")}
                        disabled={!content.youtubeTitle}
                      >
                        {copiedField === "youtubeTitle" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Title
                          </>
                        )}
                      </Button>
                    </div>

                    {/* YouTube Description */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Optimized Video Description</h3>
                      <div className="p-4 bg-muted rounded-lg max-h-48 overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap text-sm">
                          {content.youtubeDescription || "No description generated"}
                        </p>
                      </div>
                      <Button 
                        className="mt-3 w-full"
                        variant="outline"
                        onClick={() => copyToClipboard(content.youtubeDescription || "", "youtubeDescription")}
                        disabled={!content.youtubeDescription}
                      >
                        {copiedField === "youtubeDescription" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Description
                          </>
                        )}
                      </Button>
                    </div>

                    {/* YouTube Tags */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Recommended Tags</h3>
                      {youtubeTags.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {youtubeTags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary/20 transition"
                                onClick={() => copyToClipboard(tag, `tag-${index}`)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                        className="mt-4 w-full"
                            variant="outline"
                            onClick={() => copyToClipboard(youtubeTags.join(", "), "allTags")}
                          >
                            {copiedField === "allTags" ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copied All Tags!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy All Tags
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No tags generated</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Competitors Tab */}
        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitive {youtubeData ? "Videos" : "Products"}</CardTitle>
              <CardDescription>
                Similar {youtubeData ? "videos" : "products"} and their SEO strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {competitiveProducts.length > 0 ? (
                <div className="space-y-4">
                  {competitiveProducts.map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:border-primary/50 transition">
                      <h4 className="font-semibold text-foreground mb-2">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(product.keywords || []).map((keyword, kIndex) => (
                          <Badge key={kIndex} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No competitive analysis available for this content.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Need different results?
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={generateSEOContent} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              {onRegenerate && (
                <Button onClick={onRegenerate}>
                  Change Input
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
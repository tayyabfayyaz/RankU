"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, AlertCircle } from 'lucide-react'

interface SEOContentGeneratorProps {
  platform: string
  content: {
    seoContent?: string
    keywords?: string[]
    suggestions?: string[]
    competitiveProducts?: string[]
    youtubeTitle?: string
    youtubeDescription?: string
    youtubeTags?: string[]
    metaTitle?: string
    metaDescription?: string
    onPageContent?: string
    error?: string
    code?: string
    details?: string
    metadata?: {
      processingTime: number
      model: string
      generatedAt: string
    }
  } | null
}

export function SEOContentGenerator({ platform, content }: SEOContentGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (!content) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-200">No content available. Please try generating again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (content.error) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Generation Error: {content.code}</p>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{content.error}</p>
              {content.details && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-1 font-mono">{content.details}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasValidContent = 
    content.seoContent || 
    (content.keywords && content.keywords.length > 0) || 
    content.youtubeTitle || 
    content.metaTitle

  if (!hasValidContent) {
    return (
      <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-800 dark:text-yellow-200">The generated content appears to be empty. Please try again with different parameters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      {content.metadata && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Generated in {content.metadata.processingTime}ms using {content.metadata.model}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Facebook/Instagram Content */}
      {(platform === "facebook" || platform === "instagram") && (
        <>
          {content.seoContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  Your optimized {platform} {platform === "instagram" ? "caption" : "post"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {content.seoContent}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(content.seoContent!, 0)}
                  className="w-full"
                >
                  {copiedIndex === 0 ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {content.keywords && content.keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Keywords/Hashtags</CardTitle>
                <CardDescription>
                  {platform === "instagram" ? "Recommended hashtags" : "Target keywords"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.keywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopy(keyword, index + 100)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {copiedIndex === index + 100 ? (
                        <>
                          <Check className="inline mr-1 h-3 w-3" />
                        </>
                      ) : (
                        <Copy className="inline mr-1 h-3 w-3" />
                      )}
                      {keyword}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {content.suggestions && content.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* YouTube Content */}
      {platform === "youtube" && (
        <>
          {content.youtubeTitle && (
            <Card>
              <CardHeader>
                <CardTitle>YouTube Title</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm font-semibold">
                  {content.youtubeTitle}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(content.youtubeTitle!, 1)}
                  className="w-full"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Title
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {content.youtubeDescription && (
            <Card>
              <CardHeader>
                <CardTitle>YouTube Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {content.youtubeDescription}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(content.youtubeDescription!, 2)}
                  className="w-full"
                >
                  {copiedIndex === 2 ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Description
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {content.youtubeTags && content.youtubeTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>YouTube Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.youtubeTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopy(tag, index + 200)}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      {copiedIndex === index + 200 ? (
                        <>
                          <Check className="inline mr-1 h-3 w-3" />
                        </>
                      ) : (
                        <Copy className="inline mr-1 h-3 w-3" />
                      )}
                      {tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Website Content */}
      {platform === "website" && (
        <>
          {content.metaTitle && (
            <Card>
              <CardHeader>
                <CardTitle>Meta Title</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm font-semibold">
                  {content.metaTitle}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(content.metaTitle!, 3)}
                  className="w-full"
                >
                  {copiedIndex === 3 ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Title
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {content.metaDescription && (
            <Card>
              <CardHeader>
                <CardTitle>Meta Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm">
                  {content.metaDescription}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(content.metaDescription!, 4)}
                  className="w-full"
                >
                  {copiedIndex === 4 ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Description
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {content.onPageContent && (
            <Card>
              <CardHeader>
                <CardTitle>On-Page SEO Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {content.onPageContent}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

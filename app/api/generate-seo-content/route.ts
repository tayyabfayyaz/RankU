import { NextResponse } from "next/server"
import { generateText } from "ai"
import { geminiModel, geminiMiniModel } from "@/lib/gemini-config"

export const maxDuration = 30
export const dynamic = 'force-dynamic'

// Rate limiting utility
class RateLimiter {
  private requests: number[] = []
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.windowMs - (now - oldestRequest)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
    
    this.requests.push(now)
  }
}

// Create rate limiter: max 15 requests per minute
const rateLimiter = new RateLimiter(60000, 15)

// Enhanced generateText with retry and rate limiting
async function generateTextWithRetry(options: any, retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await rateLimiter.waitIfNeeded()
      const result = await generateText(options)
      return result
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error?.message)
      
      if (attempt === retries) throw error
      
      // Exponential backoff with jitter
      const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000
      console.log(`Waiting ${backoffTime}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, backoffTime))
    }
  }
  throw new Error('All retry attempts failed')
}

// Input validation
function validateInput(body: any): { isValid: boolean; error?: string; fields?: any } {
  const { type, productName, productDescription, targetAudience, videoContent } = body

  if (!type) {
    return { isValid: false, error: "Missing required field: type" }
  }

  const validTypes = ['instagram', 'facebook', 'youtube', 'website']
  if (!validTypes.includes(type)) {
    return { isValid: false, error: `Invalid type: ${type}. Supported types: ${validTypes.join(', ')}` }
  }

  // Check if this is a platform detection request
  const hasProductData = productName || productDescription || videoContent
  if (!hasProductData) {
    return { 
      isValid: true, 
      fields: { isPlatformDetection: true }
    }
  }

  // Validate required fields based on type
  if (type === 'youtube') {
    if (!videoContent) {
      return { isValid: false, error: "Missing required field: videoContent for YouTube" }
    }
    if (!targetAudience) {
      return { isValid: false, error: "Missing required field: targetAudience" }
    }
  } else {
    if (!productName) {
      return { isValid: false, error: "Missing required field: productName" }
    }
    if (!productDescription) {
      return { isValid: false, error: "Missing required field: productDescription" }
    }
    if (!targetAudience) {
      return { isValid: false, error: "Missing required field: targetAudience" }
    }
  }

  return { 
    isValid: true, 
    fields: {
      type,
      productName: productName?.trim(),
      productDescription: productDescription?.trim(),
      targetAudience: targetAudience?.trim(),
      videoContent: videoContent?.trim(),
      ...body
    }
  }
}

export async function POST(req: Request): Promise<Response> {
  const startTime = Date.now()
  
  try {
    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return NextResponse.json(
        { 
          error: "Invalid JSON in request body",
          code: "INVALID_JSON"
        },
        { status: 400 }
      )
    }

    console.log("🔵 SEO Content API called:", {
      type: body.type,
      hasProductData: !!(body.productName || body.videoContent)
    })

    // Validate input
    const validation = validateInput(body)
    if (!validation.isValid) {
      console.error("❌ Validation failed:", validation.error)
      return NextResponse.json(
        { 
          error: validation.error,
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      )
    }

    // Handle platform detection requests
    if (validation.fields?.isPlatformDetection) {
      console.log("ℹ️  Platform detection request received")
      return NextResponse.json({
        message: "Platform detected successfully",
        detectedPlatform: body.type,
        requiresProductData: true,
        code: "PLATFORM_DETECTED"
      })
    }

    const { type, productName, productDescription, targetAudience, videoContent, videoCategory, videoDescription, websiteLink, category, businessType, mainKeywords, competitors } = validation.fields

    console.log("🎯 Processing SEO type:", type, {
      productName: productName?.substring(0, 50),
      targetAudience
    })

    try {
      let response

      switch (type) {
        case 'instagram':
          response = await generateInstagramSEO({
            productName,
            productDescription,
            targetAudience
          })
          break

        case 'facebook':
          response = await generateFacebookSEO({
            productName,
            productDescription,
            targetAudience
          })
          break

        case 'youtube':
          response = await generateYouTubeSEO({
            videoContent,
            targetAudience,
            videoCategory,
            videoDescription
          })
          break

        case 'website':
          response = await generateWebsiteSEO({
            websiteLink,
            category,
            targetAudience,
            description: productDescription,
            businessType,
            mainKeywords,
            competitors
          })
          break

        default:
          throw new Error(`Unsupported type: ${type}`)
      }

      const processingTime = Date.now() - startTime
      console.log(`🎉 ${type.toUpperCase()} SEO generation completed in ${processingTime}ms`)

      return NextResponse.json({
        ...response,
        metadata: {
          processingTime,
          model: "gemini-2.0-flash",
          generatedAt: new Date().toISOString()
        }
      })

    } catch (generationError) {
      console.error(`❌ ${type} SEO generation failed:`, generationError)
      throw generationError
    }

  } catch (error: any) {
    console.error("💥 Unexpected error in SEO content generation:", error)
    
    const errorResponse = {
      error: "Failed to generate SEO content",
      code: "GENERATION_ERROR",
      details: error.message,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Instagram SEO Generator
async function generateInstagramSEO(params: {
  productName: string
  productDescription: string
  targetAudience: string
}) {
  const { productName, productDescription, targetAudience } = params

  const [seoContentResult, keywordsResult, suggestionsResult] = await Promise.all([
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Create an engaging Instagram caption for ${productName}.
Description: ${productDescription}
Target Audience: ${targetAudience}

Include: engaging hook, benefits, hashtags, CTA. Keep it authentic and relatable.`,
      maxTokens: 800,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiMiniModel,
      prompt: `Generate 10 Instagram hashtags for ${productName}.
Audience: ${targetAudience}
Return JSON: ["#hashtag1", ...]`,
      maxTokens: 200,
      temperature: 0.5,
    }),
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Provide 5 Instagram optimization tips for ${productName}.
Audience: ${targetAudience}
Return JSON: ["tip1", ...]`,
      maxTokens: 400,
      temperature: 0.7,
    })
  ])

  return {
    seoContent: seoContentResult?.text?.trim() || "",
    keywords: parseJSONArray(keywordsResult?.text) || generateFallbackHashtags(productName),
    suggestions: parseJSONArray(suggestionsResult?.text) || generateFallbackSuggestions(),
    competitiveProducts: []
  }
}

// Facebook SEO Generator
async function generateFacebookSEO(params: {
  productName: string
  productDescription: string
  targetAudience: string
}) {
  const { productName, productDescription, targetAudience } = params

  const [seoContentResult, keywordsResult, suggestionsResult] = await Promise.all([
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Create a Facebook post and ad copy for ${productName}.
Description: ${productDescription}
Audience: ${targetAudience}

Include: compelling headline, engaging story, pain points, solutions, CTA.`,
      maxTokens: 1000,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiMiniModel,
      prompt: `Generate 10 Facebook keywords for ${productName}.
Audience: ${targetAudience}
Return JSON: ["keyword1", ...]`,
      maxTokens: 200,
      temperature: 0.5,
    }),
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Provide 5 Facebook marketing tips for ${productName}.
Audience: ${targetAudience}
Return JSON: ["tip1", ...]`,
      maxTokens: 400,
      temperature: 0.7,
    })
  ])

  return {
    seoContent: seoContentResult?.text?.trim() || "",
    keywords: parseJSONArray(keywordsResult?.text) || generateFallbackKeywords(productName),
    suggestions: parseJSONArray(suggestionsResult?.text) || generateFallbackSuggestions(),
    competitiveProducts: []
  }
}

// YouTube SEO Generator
async function generateYouTubeSEO(params: {
  videoContent: string
  targetAudience: string
  videoCategory?: string
  videoDescription?: string
}) {
  const { videoContent, targetAudience, videoCategory = "Education", videoDescription = "" } = params

  const [titleResult, descriptionResult, tagsResult] = await Promise.all([
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Create a catchy YouTube title for: ${videoContent}
Audience: ${targetAudience}
Category: ${videoCategory}

Make it under 60 chars, clickable, and SEO-friendly.`,
      maxTokens: 80,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Write a YouTube description for: ${videoContent}
Audience: ${targetAudience}
Existing: ${videoDescription}

Include: hook, timestamps, keywords, CTA, links.`,
      maxTokens: 600,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiMiniModel,
      prompt: `Generate 15 YouTube tags for: ${videoContent}
Category: ${videoCategory}
Return JSON: ["tag1", ...]`,
      maxTokens: 200,
      temperature: 0.5,
    })
  ])

  return {
    seoContent: descriptionResult?.text?.trim() || "",
    youtubeTitle: titleResult?.text?.trim() || "",
    youtubeDescription: descriptionResult?.text?.trim() || "",
    youtubeTags: parseJSONArray(tagsResult?.text) || generateFallbackTags(videoContent),
    keywords: [],
    suggestions: generateFallbackSuggestions(),
    competitiveProducts: []
  }
}

// Website SEO Generator
async function generateWebsiteSEO(params: {
  websiteLink: string
  category: string
  targetAudience: string
  description: string
  businessType?: string
  mainKeywords?: string
  competitors?: string
}) {
  const { websiteLink, category, targetAudience, description, businessType = "Business", mainKeywords = "" } = params

  const [metaTitleResult, metaDescriptionResult, onPageResult] = await Promise.all([
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Create a meta title for: ${websiteLink}
Category: ${category}
Business: ${businessType}
Audience: ${targetAudience}
Keywords: ${mainKeywords}

Keep under 60 chars, include primary keyword.`,
      maxTokens: 80,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Write a meta description for: ${websiteLink}
Description: ${description}
Audience: ${targetAudience}

Keep under 160 chars, compelling, include CTA.`,
      maxTokens: 150,
      temperature: 0.7,
    }),
    generateTextWithRetry({
      model: geminiModel,
      prompt: `Provide on-page SEO recommendations for: ${websiteLink}
Category: ${category}
Audience: ${targetAudience}
Description: ${description}

Include: heading structure, content tips, technical SEO.`,
      maxTokens: 800,
      temperature: 0.7,
    })
  ])

  return {
    metaTitle: metaTitleResult?.text?.trim() || "",
    metaDescription: metaDescriptionResult?.text?.trim() || "",
    onPageContent: onPageResult?.text?.trim() || "",
    seoContent: onPageResult?.text?.trim() || "",
    keywords: [],
    suggestions: generateFallbackSuggestions(),
    competitiveProducts: []
  }
}

// Utility functions
function parseJSONArray(text: string | undefined): string[] {
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed.slice(0, 15) : []
  } catch {
    // Fallback: extract array-like content
    const matches = text.match(/\[[^\]]*\]/) || text.match(/"([^"]*)"/g)
    if (matches) {
      return matches.map(m => m.replace(/["\[\]]/g, '').trim()).filter(Boolean).slice(0, 15)
    }
    return text.split('\n').filter(line => line.trim()).slice(0, 15)
  }
}

function generateFallbackHashtags(productName: string): string[] {
  const base = productName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return [
    `#${base}`,
    `#${base}product`,
    `#buy${base}`,
    `#${base}love`,
    `#${base}goals`,
    `#${base}addict`,
    `#${base}life`,
    `#${base}community`,
    `#${base}inspo`,
    `#${base}trending`
  ]
}

function generateFallbackKeywords(productName: string): string[] {
  return [
    productName,
    `buy ${productName}`,
    `${productName} price`,
    `${productName} review`,
    `best ${productName}`,
    `${productName} near me`,
    `${productName} online`,
    `${productName} benefits`,
    `${productName} features`,
    `${productName} discount`
  ]
}

function generateFallbackTags(videoContent: string): string[] {
  const words = videoContent.toLowerCase().split(/\s+/).slice(0, 10)
  return [...new Set(words)].map(word => word.replace(/[^a-z0-9]/g, ''))
}

function generateFallbackSuggestions(): string[] {
  return [
    "Post during peak engagement hours for your target audience",
    "Use high-quality visuals to increase engagement",
    "Include clear call-to-actions in your content",
    "Monitor analytics to optimize performance",
    "Engage with your audience through comments and messages"
  ]
}

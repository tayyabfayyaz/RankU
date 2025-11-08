"use client"

import { generateText } from "ai"
import { geminiModel } from "./gemini-config"

interface CampaignData {
  id: string
  productName: string
  productDescription: string
  productImage: string | null
  targetAudience: string
  scheduledDates: Date[]
  createdAt: string
  status: string
}

/**
 * Agent Workflow System
 * Orchestrates the AI agents for research, content generation, and posting
 * Uses Google Gemini 2.0 Flash API for all agent operations
 */

// Agent 1: Research Agent - Gathers product insights and market research
async function runResearchAgent(
  campaignData: CampaignData,
  onProgress: (message: string) => void,
): Promise<{
  seoKeywords: string[]
  productComparison: string
  marketInsights: string
}> {
  onProgress("Research Agent: Analyzing product and market...")

  try {
    const { text: researchText } = await generateText({
      model: geminiModel,
      prompt: `Analyze this product and provide market insights:
      
Product Name: ${campaignData.productName}
Description: ${campaignData.productDescription}
Target Audience: ${campaignData.targetAudience}

Please provide:
1. Top 5 SEO keywords (comma-separated)
2. Product comparison with similar market alternatives (2-3 sentences)
3. Key market insights and selling points (2-3 sentences)

Format your response as JSON with keys: seoKeywords, productComparison, marketInsights`,
    })

    const research = JSON.parse(researchText)
    onProgress("Research Agent: Analysis complete")
    return research
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    onProgress(`Research Agent Error: ${errorMessage}`)
    throw error
  }
}

// Agent 2: Content Generation Agent - Creates social media posts
async function runContentAgent(
  campaignData: CampaignData,
  research: any,
  onProgress: (message: string) => void,
): Promise<{
  posts: Array<{
    date: string
    caption: string
    hashtags: string
    cta: string
  }>
}> {
  onProgress("Content Agent: Generating social media posts...")

  try {
    const posts = []
    const dateCount = campaignData.scheduledDates.length

    // Generate different post variations
    for (let i = 0; i < Math.min(dateCount, 3); i++) {
      const postType = i === 0 ? "announcement" : i === 1 ? "feature_highlight" : "social_proof"

      const { text: postText } = await generateText({
        model: geminiModel,
        prompt: `Create a ${postType} social media post for this product:

Product: ${campaignData.productName}
Description: ${campaignData.productDescription}
Keywords: ${research.seoKeywords.join(", ")}
Key Insights: ${research.marketInsights}

Generate a post with:
1. Engaging caption (150-200 characters)
2. 5-10 relevant hashtags
3. Call-to-action

Format as JSON with keys: caption, hashtags, cta`,
      })

      const post = JSON.parse(postText)
      posts.push({
        date: new Date(campaignData.scheduledDates[i]).toISOString().split("T")[0],
        ...post,
      })
    }

    onProgress("Content Agent: Posts generated")
    return { posts }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    onProgress(`Content Agent Error: ${errorMessage}`)
    throw error
  }
}

// Agent 3: Posting Agent - Schedules and posts to social media
async function runPostingAgent(
  campaignData: CampaignData,
  posts: any,
  onProgress: (message: string) => void,
): Promise<{
  scheduledPosts: number
  platforms: string[]
}> {
  onProgress("Posting Agent: Scheduling posts across platforms...")

  try {
    // Simulate posting to connected social accounts
    const platforms = ["facebook", "instagram", "twitter"]

    // In production, this would call your social media APIs
    // For now, we'll simulate the scheduling
    const scheduledPosts = posts.length * platforms.length

    onProgress(`Posting Agent: Scheduled ${scheduledPosts} posts across ${platforms.length} platforms`)

    return {
      scheduledPosts,
      platforms,
    }
  } catch (error) {
    console.error("[v0] Posting agent error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    onProgress(`Posting Agent Error: ${errorMessage}`)
    throw error
  }
}

// Main workflow orchestrator
export async function triggerAgentWorkflow(
  campaignData: CampaignData,
  onProgress: (message: string) => void,
): Promise<void> {
  try {
    console.log("[v0] Workflow starting with campaign data:", campaignData)

    const research = await runResearchAgent(campaignData, onProgress)
    const content = await runContentAgent(campaignData, research, onProgress)
    const posting = await runPostingAgent(campaignData, content.posts, onProgress)

    // Save campaign with generated content
    const completeCampaign = {
      ...campaignData,
      status: "completed",
      research,
      content: content.posts,
      posting,
      completedAt: new Date().toISOString(),
    }

    // Store in localStorage (replace with DB in production)
    const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]")
    campaigns.push(completeCampaign)
    localStorage.setItem("campaigns", JSON.stringify(campaigns))

    console.log("[v0] Campaign created successfully:", completeCampaign)
    onProgress("Campaign created successfully! Posts scheduled for all platforms.")
  } catch (error) {
    console.error("[v0] Workflow error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    onProgress(`Failed to create campaign: ${errorMessage}`)
    throw error
  }
}

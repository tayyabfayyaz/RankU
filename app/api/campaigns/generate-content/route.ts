import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { geminiModel } from "@/lib/gemini-config"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { campaignId, scheduledPostId } = await req.json()

    if (!campaignId || !scheduledPostId) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { data: scheduledPost, error: postError } = await supabase
      .from("scheduled_posts")
      .select(`
        *,
        products (
          id,
          name,
          description,
          category,
          target_audience
        )
      `)
      .eq("id", scheduledPostId)
      .eq("user_id", user.id)
      .single()

    if (postError || !scheduledPost) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    const product = scheduledPost.products
    const platform = scheduledPost.platform

    const { text: generatedContent } = await generateText({
      model: geminiModel,
      prompt: `You are an expert ${platform} marketing specialist. Generate an optimized post for this product.

PRODUCT DETAILS:
- Name: ${product.name}
- Description: ${product.description}
- Category: ${product.category}
- Target Audience: ${product.target_audience}

PLATFORM: ${platform}

CONTENT GUIDELINES FOR ${platform.toUpperCase()}:
${
  platform === "instagram"
    ? `- Create an engaging caption with emojis
- Include 15-20 relevant hashtags
- Keep it under 2,200 characters
- Add call-to-action (tag friend, visit link, etc.)`
    : platform === "facebook"
      ? `- Write a conversational post
- Include relevant hashtags (5-10)
- Add emotional appeal
- Include clear call-to-action
- Keep it under 1,000 characters`
      : platform === "twitter"
        ? `- Keep under 280 characters
- Include relevant hashtags (2-3)
- Make it engaging and shareable
- Include call-to-action if possible`
        : `- Write professional yet engaging post
- Include industry-relevant hashtags
- Add value proposition
- Keep it 200-300 characters`
}

Generate the optimized post content now:`,
    //   maxTokens: 500,
      temperature: 0.7,
    })

    const { text: keywordsText } = await generateText({
      model: geminiModel,
      prompt: `Generate 8 relevant keywords and hashtags for this ${platform} post:
Product: ${product.name}
Description: ${product.description}
Audience: ${product.target_audience}

Return as JSON: {"keywords": ["keyword1", "keyword2", ...], "hashtags": ["#tag1", "#tag2", ...]}`,
    //   maxTokens: 300,
      temperature: 0.5,
    })

    let keywords = []
    let hashtags = []

    try {
      const parsed = JSON.parse(keywordsText)
      keywords = parsed.keywords || []
      hashtags = parsed.hashtags || []
    } catch {
      // Fallback if JSON parsing fails
      keywords = [product.name, product.category, product.target_audience]
      hashtags = [`#${product.name.replace(/\s+/g, "")}`, `#${product.category}`]
    }

    const { error: updateError } = await supabase
      .from("scheduled_posts")
      .update({
        content: generatedContent.trim(),
        generated_content: {
          keywords,
          hashtags,
          generatedAt: new Date().toISOString(),
        },
      })
      .eq("id", scheduledPostId)

    if (updateError) {
      return Response.json({ error: "Failed to save generated content" }, { status: 500 })
    }

    return Response.json({
      success: true,
      content: generatedContent.trim(),
      keywords,
      hashtags,
    })
  } catch (error) {
    console.error("[v0] Content generation error:", error)
    return Response.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

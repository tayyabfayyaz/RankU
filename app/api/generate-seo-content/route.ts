import { generateText } from "ai"
import { geminiModel, geminiMiniModel } from "@/lib/gemini-config"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type } = body

    // INSTAGRAM SEO
    if (type === "instagram") {
      const { productName, productDescription, targetAudience } = body

      if (!productName || !productDescription || !targetAudience) {
        return Response.json({ error: "Missing required Instagram fields" }, { status: 400 })
      }

      const { text: seoContent } = await generateText({
        model: geminiModel,
        prompt: `You are an expert Instagram SEO specialist. Create an engaging, SEO-optimized Instagram caption for a product.

PRODUCT DETAILS:
- Product Name: ${productName}
- Description: ${productDescription}
- Target Audience: ${targetAudience}

INSTRUCTIONS FOR CAPTION GENERATION:
1. Write an engaging hook (first 2 lines) that captures attention
2. Include natural keyword placement throughout the caption
3. Mention the product benefits relevant to the ${targetAudience}
4. Create urgency or curiosity about the product
5. Include relevant hashtags (use 20-30 hashtags naturally)
6. Add a call-to-action (link in bio, tag a friend, DM, etc.)
7. Keep the tone matching Instagram's informal, engaging style
8. Maximum length: 2,200 characters

Generate the optimized Instagram caption now:`,
        // maxTokens: 1000,
        temperature: 0.7,
      })

      const { text: keywordsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Generate 10 high-performing Instagram hashtags and keywords for this product:
Product: ${productName}
Description: ${productDescription}
Target Audience: ${targetAudience}

Instructions:
- Mix popular (>100K posts) and niche hashtags
- Focus on hashtags that ${targetAudience} actually searches for
- Include product category hashtags
- Include lifestyle/interest hashtags

Return ONLY a JSON array: ["#hashtag1", "#hashtag2", ...]`,
        // maxTokens: 300,
        temperature: 0.5,
      })

      const { text: suggestionsText } = await generateText({
        model: geminiModel,
        prompt: `Provide 5 specific Instagram SEO optimization suggestions for "${productName}":

Product Details:
- Name: ${productName}
- Description: ${productDescription}
- Target Audience: ${targetAudience}

Suggestions should include:
1. Best posting times for this audience
2. Content format recommendations (Reels, Carousel, etc.)
3. Engagement boosting tactics
4. Hashtag strategy optimization
5. Profile optimization tips

Be concise and actionable. Return as JSON array of strings.`,
        // maxTokens: 500,
        temperature: 0.7,
      })

      const { text: competitorsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Suggest 3 similar competitive products on Instagram in the same category as "${productName}".

Target Audience: ${targetAudience}

For each competitor:
- Product name
- Brief description of their positioning
- Their most effective hashtags (3 relevant ones)

Return as JSON array with objects: {name, description, keywords}`,
        // maxTokens: 600,
        temperature: 0.7,
      })

      let keywords: string[] = []
      let suggestions: string[] = []
      let competitiveProducts: Array<{ name: string; description: string; keywords: string[] }> = []

      try {
        keywords = JSON.parse(keywordsText)
        if (!Array.isArray(keywords)) keywords = []
      } catch {
        keywords = keywordsText
          .split("\n")
          .filter((k) => k.trim())
          .slice(0, 10)
      }

      try {
        suggestions = JSON.parse(suggestionsText)
        if (!Array.isArray(suggestions)) suggestions = []
      } catch {
        suggestions = suggestionsText
          .split("\n")
          .filter((s) => s.trim())
          .slice(0, 5)
      }

      try {
        competitiveProducts = JSON.parse(competitorsText)
        if (!Array.isArray(competitiveProducts)) competitiveProducts = []
      } catch {
        competitiveProducts = [
          { name: "Competitor 1", description: "Similar product", keywords: ["tag1", "tag2", "tag3"] },
        ]
      }

      return Response.json({
        seoContent: seoContent.trim(),
        keywords: keywords.slice(0, 10),
        suggestions: suggestions.slice(0, 5),
        competitiveProducts: competitiveProducts.slice(0, 3),
      })
    }

    // FACEBOOK SEO
    if (type === "facebook") {
      const { productName, productDescription, targetAudience } = body

      if (!productName || !productDescription || !targetAudience) {
        return Response.json({ error: "Missing required Facebook fields" }, { status: 400 })
      }

      const { text: seoContent } = await generateText({
        model: geminiModel,
        prompt: `You are an expert Facebook marketing SEO specialist. Create an optimized Facebook post and ad copy for a product.

PRODUCT DETAILS:
- Product Name: ${productName}
- Description: ${productDescription}
- Target Audience: ${targetAudience}

INSTRUCTIONS FOR FACEBOOK CONTENT:
1. Write a compelling post headline (60-80 characters max)
2. Create engaging post body that tells a story about the product
3. Include pain points and solutions for ${targetAudience}
4. Add natural keyword placement for search visibility
5. Include a strong call-to-action (Learn More, Shop Now, Get Started)
6. Generate an ad headline variant (25 characters max)
7. Generate ad primary text (125 characters max)
8. Maintain professional yet conversational tone
9. Include relevant emoji for visual appeal

Generate both organic post and ad variants:`,
        // maxTokens: 1200,
        temperature: 0.7,
      })

      const { text: keywordsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Generate 10 high-performing Facebook keywords and interests for this product:
Product: ${productName}
Description: ${productDescription}
Target Audience: ${targetAudience}

Instructions:
- Include product category keywords
- Include interest-based keywords (what audiences care about)
- Include demographic keywords
- Include competitor/alternative keywords
- Focus on keywords that ${targetAudience} searches on Facebook

Return ONLY a JSON array: ["keyword1", "keyword2", ...]`,
        // maxTokens: 300,
        temperature: 0.5,
      })

      const { text: suggestionsText } = await generateText({
        model: geminiModel,
        prompt: `Provide 5 specific Facebook SEO and marketing optimization suggestions for "${productName}":

Instructions should cover:
1. Ideal posting times and frequency for ${targetAudience}
2. Best performing post formats (video, image, carousel, collection)
3. Audience targeting recommendations
4. Ad bidding and budget optimization tips
5. Facebook Pixel and conversion tracking setup

Be concise and actionable. Return as JSON array of strings.`,
        // maxTokens: 500,
        temperature: 0.7,
      })

      const { text: competitorsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Suggest 3 similar competitive products on Facebook in the same category as "${productName}".

Target Audience: ${targetAudience}

For each competitor:
- Product name
- Brief description of their value proposition
- Their effective keywords (3 relevant ones)

Return as JSON array: {name, description, keywords}`,
        // maxTokens: 600,
        temperature: 0.7,
      })

      let keywords: string[] = []
      let suggestions: string[] = []
      let competitiveProducts: Array<{ name: string; description: string; keywords: string[] }> = []

      try {
        keywords = JSON.parse(keywordsText)
        if (!Array.isArray(keywords)) keywords = []
      } catch {
        keywords = keywordsText
          .split("\n")
          .filter((k) => k.trim())
          .slice(0, 10)
      }

      try {
        suggestions = JSON.parse(suggestionsText)
        if (!Array.isArray(suggestions)) suggestions = []
      } catch {
        suggestions = suggestionsText
          .split("\n")
          .filter((s) => s.trim())
          .slice(0, 5)
      }

      try {
        competitiveProducts = JSON.parse(competitorsText)
        if (!Array.isArray(competitiveProducts)) competitiveProducts = []
      } catch {
        competitiveProducts = [
          { name: "Competitor 1", description: "Similar product", keywords: ["keyword1", "keyword2", "keyword3"] },
        ]
      }

      return Response.json({
        seoContent: seoContent.trim(),
        keywords: keywords.slice(0, 10),
        suggestions: suggestions.slice(0, 5),
        competitiveProducts: competitiveProducts.slice(0, 3),
      })
    }

    // YOUTUBE SEO
    if (type === "youtube") {
      const { videoContent, targetAudience, videoCategory, videoDescription, keyPoints } = body

      if (!videoContent || !targetAudience || !videoCategory) {
        return Response.json({ error: "Missing required YouTube fields" }, { status: 400 })
      }

      const { text: youtubeTitle } = await generateText({
        model: geminiModel,
        prompt: `Create an SEO-optimized YouTube video title that will rank well in search and suggestions.

VIDEO DETAILS:
- Content: ${videoContent}
- Target Audience: ${targetAudience}
- Category: ${videoCategory}
- Key Points: ${keyPoints}

TITLE OPTIMIZATION RULES:
1. Maximum 60 characters
2. Place main keyword at the beginning
3. Include emotional trigger words (Best, Ultimate, Complete, Guide, etc.)
4. Make it specific and compelling
5. Include the target audience's search intent
6. Avoid clickbait but maximize curiosity
7. Ensure it accurately represents content

Return ONLY the optimized title.`,
        // maxTokens: 100,
        temperature: 0.7,
      })

      const { text: youtubeDescription } = await generateText({
        model: geminiModel,
        prompt: `Create a comprehensive, SEO-optimized YouTube video description that maximizes discoverability.

VIDEO DETAILS:
- Content: ${videoContent}
- Target Audience: ${targetAudience}
- Category: ${videoCategory}
- Key Points: ${keyPoints}
- Original Description: ${videoDescription}

DESCRIPTION WRITING GUIDELINES:
1. First line: Hook that summarizes the video in one compelling sentence
2. Second paragraph: Expand on what viewers will learn (include keywords naturally)
3. Address the target audience's pain points and interests
4. Break content into scannable sections with key topics
5. Include timestamps for major sections (if applicable)
6. Natural keyword placement throughout (aim for 2-3% keyword density)
7. Include resources, links, or related videos
8. End with strong call-to-action (subscribe, like, comment, check description for links)
9. Add social media handles/website if applicable
10. Structure with short paragraphs and line breaks for readability
11. Use keywords in bold for emphasis and SEO

Target length: 350-400 words

Generate the optimized description:`,
        // maxTokens: 700,
        temperature: 0.7,
      })

      const { text: keywordsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Generate 12 high-performing YouTube SEO keywords ordered by relevance and search volume.

VIDEO DETAILS:
- Content: ${videoContent}
- Target Audience: ${targetAudience}
- Category: ${videoCategory}
- Key Points: ${keyPoints}

KEYWORD SELECTION CRITERIA:
1. Include long-tail keywords (3-5 word phrases)
2. Include short-tail main keywords (1-2 words)
3. Mix informational and commercial intent keywords
4. Include keywords the target audience actually searches
5. Consider YouTube's search algorithm (similar to Google)
6. Prioritize keywords with lower competition

Return ONLY a JSON array ordered by relevance: ["keyword1", "keyword2", ...]`,
        // maxTokens: 300,
        temperature: 0.5,
      })

      const { text: tagsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Generate 15 SEO-optimized YouTube tags for maximum search visibility.

VIDEO CONTENT:
- Title: ${videoContent}
- Category: ${videoCategory}
- Key Points: ${keyPoints}

TAG GENERATION RULES:
1. Mix single-word and multi-word tags
2. Include brand name if applicable
3. Include category tags
4. Include content type tags (tutorial, review, guide, etc.)
5. Avoid irrelevant or misleading tags
6. Use tags that competitors use but are still relevant
7. Prioritize tags that ${targetAudience} would search

Return ONLY a JSON array: ["tag1", "tag2", ...]`,
        // maxTokens: 300,
        temperature: 0.5,
      })

      const { text: suggestionsText } = await generateText({
        model: geminiModel,
        prompt: `Provide 5 specific, actionable YouTube SEO optimization suggestions for "${videoContent}".

VIDEO DETAILS:
- Target Audience: ${targetAudience}
- Category: ${videoCategory}
- Key Points: ${keyPoints}

SUGGESTIONS SHOULD INCLUDE:
1. Thumbnail optimization advice
2. Video structure and pacing recommendations
3. Engagement boosting strategies (CTA placement, etc.)
4. Best practices for this content category
5. YouTube algorithm tips for increased visibility

Be specific and actionable. Return as JSON array of strings.`,
        // maxTokens: 500,
        temperature: 0.7,
      })

      const { text: competitorsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Suggest 3 similar competitive YouTube videos in the ${videoCategory} category targeting ${targetAudience}.

For each video, analyze:
- Effective video title
- What makes it successful
- 3 keywords they likely rank for

Return as JSON array: [{name: "title", description: "analysis", keywords: ["kw1", "kw2", "kw3"]}, ...]`,
        // maxTokens: 600,
        temperature: 0.7,
      })

      let keywords: string[] = []
      let suggestions: string[] = []
      let competitiveProducts: Array<{ name: string; description: string; keywords: string[] }> = []
      let youtubeTags: string[] = []

      try {
        keywords = JSON.parse(keywordsText)
        if (!Array.isArray(keywords)) keywords = []
      } catch {
        keywords = keywordsText
          .split("\n")
          .filter((k) => k.trim())
          .slice(0, 12)
      }

      try {
        suggestions = JSON.parse(suggestionsText)
        if (!Array.isArray(suggestions)) suggestions = []
      } catch {
        suggestions = suggestionsText
          .split("\n")
          .filter((s) => s.trim())
          .slice(0, 5)
      }

      try {
        competitiveProducts = JSON.parse(competitorsText)
        if (!Array.isArray(competitiveProducts)) competitiveProducts = []
      } catch {
        competitiveProducts = [
          { name: "Competitor Video", description: "Similar content", keywords: ["keyword1", "keyword2", "keyword3"] },
        ]
      }

      try {
        youtubeTags = JSON.parse(tagsText)
        if (!Array.isArray(youtubeTags)) youtubeTags = []
      } catch {
        youtubeTags = tagsText
          .split("\n")
          .filter((t) => t.trim())
          .slice(0, 15)
      }

      return Response.json({
        keywords: keywords.slice(0, 12),
        seoContent: youtubeDescription.trim(),
        youtubeTitle: youtubeTitle.trim(),
        youtubeDescription: youtubeDescription.trim(),
        youtubeTags: youtubeTags.slice(0, 15),
        competitiveProducts: competitiveProducts.slice(0, 3),
        suggestions: suggestions.slice(0, 5),
      })
    }

    // WEBSITE SEO
    if (type === "website") {
      const { websiteLink, category, targetAudience, description, businessType, mainKeywords, competitors } = body

      if (!websiteLink || !category || !targetAudience) {
        return Response.json({ error: "Missing required website fields" }, { status: 400 })
      }

      const { text: metaTitle } = await generateText({
        model: geminiModel,
        prompt: `Create an SEO-optimized meta title for a website.

WEBSITE DETAILS:
- URL: ${websiteLink}
- Category: ${category}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Main Keywords: ${mainKeywords}

META TITLE REQUIREMENTS:
1. Maximum 60 characters
2. Include primary keyword
3. Include brand name if applicable
4. Make it compelling for search results
5. Use power words that encourage clicks
6. Reflect page content accurately

Return ONLY the meta title.`,
        // maxTokens: 100,
        temperature: 0.7,
      })

      const { text: metaDescription } = await generateText({
        model: geminiModel,
        prompt: `Create an SEO-optimized meta description for a website.

WEBSITE DETAILS:
- URL: ${websiteLink}
- Category: ${category}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Description: ${description}
- Main Keywords: ${mainKeywords}

META DESCRIPTION REQUIREMENTS:
1. 150-160 characters (optimal for search results)
2. Include primary keyword naturally
3. Include call-to-action
4. Clearly describe what visitors will find
5. Include value proposition for ${targetAudience}
6. Make it compelling and click-worthy
7. Avoid keyword stuffing

Return ONLY the meta description.`,
        // maxTokens: 200,
        temperature: 0.7,
      })

      const { text: onPageContent } = await generateText({
        model: geminiModel,
        prompt: `Create comprehensive on-page SEO content strategy and optimization recommendations.

WEBSITE DETAILS:
- URL: ${websiteLink}
- Category: ${category}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Description: ${description}
- Main Keywords: ${mainKeywords}
- Competitors: ${competitors}

ON-PAGE OPTIMIZATION STRATEGY:
1. H1 tag recommendation (include main keyword)
2. Recommended internal linking structure
3. Content organization with H2/H3 headers
4. Keyword placement strategy throughout the page
5. Image optimization and alt text guidance
6. URL structure optimization
7. Schema markup recommendations
8. Mobile optimization considerations
9. Page speed optimization tips

Provide detailed, actionable recommendations:`,
        // maxTokens: 800,
        temperature: 0.7,
      })

      const { text: keywordsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Generate 15 high-performing keywords for website SEO targeting ${targetAudience}.

WEBSITE CONTEXT:
- Category: ${category}
- Business Type: ${businessType}
- Main Keywords: ${mainKeywords}
- Description: ${description}

KEYWORD CRITERIA:
1. Mix short-tail and long-tail keywords
2. Include transactional, informational, and navigational keywords
3. Focus on keywords with high search intent for ${targetAudience}
4. Include local keywords if applicable
5. Research-based on ${competitors} if provided
6. Prioritize keywords with good search volume and low competition

Return ONLY a JSON array: ["keyword1", "keyword2", ...]`,
        // maxTokens: 400,
        temperature: 0.5,
      })

      const { text: suggestionsText } = await generateText({
        model: geminiModel,
        prompt: `Provide 7 comprehensive website SEO optimization suggestions.

WEBSITE DETAILS:
- Category: ${category}
- Business Type: ${businessType}
- Target Audience: ${targetAudience}
- Competitors: ${competitors}

SUGGESTIONS SHOULD INCLUDE:
1. Technical SEO improvements (robots.txt, sitemap, etc.)
2. Content strategy recommendations
3. Backlink building opportunities
4. User experience optimization for SEO
5. Local SEO if applicable
6. Schema markup implementation
7. Analytics and monitoring recommendations

Be specific and prioritize by impact. Return as JSON array of strings.`,
        // maxTokens: 700,
        temperature: 0.7,
      })

      const { text: competitorsText } = await generateText({
        model: geminiMiniModel,
        prompt: `Analyze and suggest 3 top-ranking competitor websites in the ${category} category.

TARGET AUDIENCE: ${targetAudience}

For each competitor:
- Website/Business name
- Their competitive advantage
- Their effective keywords (3-4 relevant ones)

Provide insights on what makes them rank well. Return as JSON array: [{name, description, keywords}]`,
        // maxTokens: 700,
        temperature: 0.7,
      })

      let keywords: string[] = []
      let suggestions: string[] = []
      let competitiveProducts: Array<{ name: string; description: string; keywords: string[] }> = []

      try {
        keywords = JSON.parse(keywordsText)
        if (!Array.isArray(keywords)) keywords = []
      } catch {
        keywords = keywordsText
          .split("\n")
          .filter((k) => k.trim())
          .slice(0, 15)
      }

      try {
        suggestions = JSON.parse(suggestionsText)
        if (!Array.isArray(suggestions)) suggestions = []
      } catch {
        suggestions = suggestionsText
          .split("\n")
          .filter((s) => s.trim())
          .slice(0, 7)
      }

      try {
        competitiveProducts = JSON.parse(competitorsText)
        if (!Array.isArray(competitiveProducts)) competitiveProducts = []
      } catch {
        competitiveProducts = [
          { name: "Competitor 1", description: "Top ranking site", keywords: ["keyword1", "keyword2", "keyword3"] },
        ]
      }

      return Response.json({
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        onPageContent: onPageContent.trim(),
        keywords: keywords.slice(0, 15),
        suggestions: suggestions.slice(0, 7),
        competitiveProducts: competitiveProducts.slice(0, 3),
      })
    }

    return Response.json({ error: "Invalid service type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error generating SEO content:", error)
    return Response.json(
      { error: "Failed to generate SEO content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

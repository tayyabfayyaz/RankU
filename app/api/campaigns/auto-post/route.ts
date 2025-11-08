import { createClient } from "@/lib/supabase/server"
import { postToSocialMedia } from "@/lib/social-api"

export const maxDuration = 300 // 5 minutes for batch posting

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    const { data: duePosts, error: fetchError } = await supabase
      .from("scheduled_posts")
      .select(`
        *,
        campaigns (id, name),
        products (id, name, image_url)
      `)
      .eq("user_id", user.id)
      .eq("status", "scheduled")
      .lte("scheduled_date", now.toISOString())
      .limit(50)

    if (fetchError) {
      return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
    }

    if (!duePosts || duePosts.length === 0) {
      return Response.json({
        success: true,
        posted: 0,
        failed: 0,
        message: "No posts due at this time",
      })
    }

    const results = []
    let successCount = 0
    let failureCount = 0

    for (const post of duePosts) {
      try {
        const { data: socialAccount, error: accountError } = await supabase
          .from("social_accounts")
          .select("*")
          .eq("user_id", user.id)
          .eq("platform", post.platform)
          .single()

        if (accountError || !socialAccount) {
          await supabase
            .from("scheduled_posts")
            .update({
              status: "failed",
            })
            .eq("id", post.id)

          failureCount++
          results.push({
            postId: post.id,
            platform: post.platform,
            success: false,
            error: "Social account not connected",
          })
          continue
        }

        const postResult = await postToSocialMedia(
          post.platform,
          socialAccount.access_token,
          socialAccount.account_id,
          {
            text: post.content,
            imageUrl: post.products?.image_url,
            hashtags: post.generated_content?.hashtags || [],
          },
        )

        if (postResult.success) {
          await supabase
            .from("scheduled_posts")
            .update({
              status: "posted",
              post_url: postResult.postId,
            })
            .eq("id", post.id)

          // Update campaign posted count
          await supabase.rpc("increment_campaign_posted_count", {
            campaign_id: post.campaign_id,
          })

          successCount++
          results.push({
            postId: post.id,
            platform: post.platform,
            success: true,
          })
        } else {
          await supabase
            .from("scheduled_posts")
            .update({
              status: "failed",
            })
            .eq("id", post.id)

          failureCount++
          results.push({
            postId: post.id,
            platform: post.platform,
            success: false,
            error: postResult.error,
          })
        }
      } catch (error) {
        failureCount++
        results.push({
          postId: post.id,
          platform: post.platform,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return Response.json({
      success: true,
      posted: successCount,
      failed: failureCount,
      results,
    })
  } catch (error) {
    console.error("[v0] Auto-posting error:", error)
    return Response.json(
      {
        error: "Failed to process auto-posting",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

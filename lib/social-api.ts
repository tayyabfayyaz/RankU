// This module handles posting to various social platforms using their APIs

interface PostContent {
  text: string
  imageUrl?: string
  link?: string
  hashtags?: string[]
}

interface PostResult {
  success: boolean
  platform: string
  postId?: string
  error?: string
}

export async function postToFacebook(accessToken: string, pageId: string, content: PostContent): Promise<PostResult> {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${content.text}\n\n${content.hashtags?.join(" ") || ""}`,
        access_token: accessToken,
        link: content.link,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        platform: "facebook",
        error: error.error?.message || "Failed to post to Facebook",
      }
    }

    const data = await response.json()
    return {
      success: true,
      platform: "facebook",
      postId: data.id,
    }
  } catch (error) {
    return {
      success: false,
      platform: "facebook",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function postToInstagram(
  accessToken: string,
  accountId: string,
  content: PostContent,
): Promise<PostResult> {
  try {
    // Instagram requires image uploads via the Media container approach
    if (!content.imageUrl) {
      return {
        success: false,
        platform: "instagram",
        error: "Image URL required for Instagram posts",
      }
    }

    // Create media container
    const mediaResponse = await fetch(`https://graph.instagram.com/v18.0/${accountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: content.imageUrl,
        caption: `${content.text}\n\n${content.hashtags?.join(" ") || ""}`,
        access_token: accessToken,
      }),
    })

    if (!mediaResponse.ok) {
      const error = await mediaResponse.json()
      return {
        success: false,
        platform: "instagram",
        error: error.error?.message || "Failed to create Instagram media",
      }
    }

    const mediaData = await mediaResponse.json()

    // Publish the media
    const publishResponse = await fetch(`https://graph.instagram.com/v18.0/${accountId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: mediaData.id,
        access_token: accessToken,
      }),
    })

    if (!publishResponse.ok) {
      const error = await publishResponse.json()
      return {
        success: false,
        platform: "instagram",
        error: error.error?.message || "Failed to publish Instagram post",
      }
    }

    const publishData = await publishResponse.json()
    return {
      success: true,
      platform: "instagram",
      postId: publishData.id,
    }
  } catch (error) {
    return {
      success: false,
      platform: "instagram",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function postToTwitter(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Twitter v2 API endpoint
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: `${content.text}\n\n${content.hashtags?.join(" ") || ""}`,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        platform: "twitter",
        error: error.detail || "Failed to post to Twitter",
      }
    }

    const data = await response.json()
    return {
      success: true,
      platform: "twitter",
      postId: data.data?.id,
    }
  } catch (error) {
    return {
      success: false,
      platform: "twitter",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function postToLinkedIn(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        author: "urn:li:person:YOUR_USER_ID", // This should be fetched from user info
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.PublishContent": {
            shareCommentary: {
              text: `${content.text}\n\n${content.hashtags?.join(" ") || ""}`,
            },
            shareMediaCategory: "ARTICLE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        platform: "linkedin",
        error: error.message || "Failed to post to LinkedIn",
      }
    }

    const data = await response.json()
    return {
      success: true,
      platform: "linkedin",
      postId: data.id,
    }
  } catch (error) {
    return {
      success: false,
      platform: "linkedin",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function postToSocialMedia(
  platform: string,
  accessToken: string,
  accountId: string,
  content: PostContent,
): Promise<PostResult> {
  switch (platform.toLowerCase()) {
    case "facebook":
      return postToFacebook(accessToken, accountId, content)
    case "instagram":
      return postToInstagram(accessToken, accountId, content)
    case "twitter":
      return postToTwitter(accessToken, content)
    case "linkedin":
      return postToLinkedIn(accessToken, content)
    default:
      return {
        success: false,
        platform,
        error: "Unsupported platform",
      }
  }
}

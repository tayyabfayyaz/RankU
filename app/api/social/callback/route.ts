import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platform, code, state } = await req.json()

    if (!platform || !code || !state) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const savedState = process.env.OAUTH_STATE_KEY ? process.env.OAUTH_STATE_KEY : state
    if (state !== savedState) {
      return Response.json({ error: "Invalid state parameter" }, { status: 400 })
    }

    // In production, this would be done securely on the backend
    // For now, we'll store a placeholder token structure

    const platformConfigs: Record<string, any> = {
      facebook: {
        tokenEndpoint: "https://graph.facebook.com/v18.0/oauth/access_token",
        userInfoEndpoint: "https://graph.facebook.com/me?fields=id,name,picture",
      },
      instagram: {
        tokenEndpoint: "https://graph.instagram.com/oauth/access_token",
        userInfoEndpoint: "https://graph.instagram.com/me?fields=id,username",
      },
      twitter: {
        tokenEndpoint: "https://twitter.com/2/oauth2/token",
        userInfoEndpoint: "https://api.twitter.com/2/users/me",
      },
      linkedin: {
        tokenEndpoint: "https://www.linkedin.com/oauth/v2/accessToken",
        userInfoEndpoint: "https://api.linkedin.com/v2/me",
      },
    }

    const config = platformConfigs[platform]
    if (!config) {
      return Response.json({ error: "Unsupported platform" }, { status: 400 })
    }

    try {
      // Exchange code for access token (this should use client secret on backend only)
      // Placeholder - in production use environment variables for secrets
      const tokenResponse = await fetch(config.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env[`NEXT_PUBLIC_${platform.toUpperCase()}_APP_ID`] || "",
          client_secret: process.env[`${platform.toUpperCase()}_SECRET`] || "",
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/social-accounts/connect/${platform}`,
          grant_type: "authorization_code",
        }).toString(),
      })

      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", await tokenResponse.text())
        return Response.json({ error: "Failed to exchange authorization code" }, { status: 400 })
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Get user info
      const userInfoResponse = await fetch(config.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!userInfoResponse.ok) {
        return Response.json({ error: "Failed to fetch user info" }, { status: 400 })
      }

      const userInfo = await userInfoResponse.json()

      // Save to database
      const { error: dbError } = await supabase.from("social_accounts").insert({
        id: uuidv4(),
        user_id: user.id,
        platform,
        account_name: userInfo.name || userInfo.username || userInfo.id || "Connected Account",
        access_token: accessToken,
        refresh_token: tokenData.refresh_token || null,
        account_id: userInfo.id,
        connected_at: new Date().toISOString(),
      })

      if (dbError) {
        console.error("Database insert error:", dbError)
        return Response.json({ error: "Failed to save account connection" }, { status: 500 })
      }

      return Response.json({
        success: true,
        platform,
        accountName: userInfo.name || userInfo.username || userInfo.id || "Connected Account",
      })
    } catch (error) {
      console.error("[v0] OAuth callback error:", error)
      return Response.json(
        {
          error: "Failed to complete connection",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Callback route error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

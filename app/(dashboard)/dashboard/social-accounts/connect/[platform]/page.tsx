"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Check } from "lucide-react"

const platformConfigs: Record<string, any> = {
  facebook: {
    name: "Facebook",
    description: "Connect your Facebook business account",
    oauthUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    scopes: ["pages_manage_posts", "pages_read_engagement"],
  },
  instagram: {
    name: "Instagram Business",
    description: "Connect your Instagram business account",
    oauthUrl: "https://api.instagram.com/oauth/authorize",
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
    scopes: ["instagram_business_basic", "instagram_business_content_publish"],
  },
  twitter: {
    name: "Twitter/X",
    description: "Connect your Twitter account",
    oauthUrl: "https://twitter.com/i/oauth2/authorize",
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    scopes: ["tweet.write", "tweet.read"],
  },
  linkedin: {
    name: "LinkedIn",
    description: "Connect your LinkedIn account",
    oauthUrl: "https://www.linkedin.com/oauth/v2/authorization",
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    scopes: ["w_member_social", "r_liteprofile"],
  },
}

export default function ConnectPlatformPage({
  params,
}: {
  params: Promise<{ platform: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [platform, setPlatform] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [accountName, setAccountName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    params.then((p) => setPlatform(p.platform))

    // Check if we're returning from OAuth callback
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (code && state) {
      verifyOAuthCode(code, state)
    }
  }, [searchParams])

  const verifyOAuthCode = async (code: string, state: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      // In a real app, you'd exchange the code for tokens on your backend
      // This prevents exposing secrets to the client
      const response = await fetch("/api/social/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          code,
          state,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify OAuth code")
      }

      const data = await response.json()
      setAccountName(data.accountName)
      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/social-accounts")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleStartOAuth = () => {
    if (!platform) return

    const config = platformConfigs[platform]
    if (!config || !config.clientId) {
      setError(`${platform} OAuth not configured yet`)
      return
    }

    setIsConnecting(true)

    const redirectUri = `${window.location.origin}/dashboard/social-accounts/connect/${platform}`
    const state = Math.random().toString(36).substring(7)
    localStorage.setItem(`oauth_state_${platform}`, state)

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      state,
      response_type: "code",
      scope: config.scopes.join(" "),
    })

    window.location.href = `${config.oauthUrl}?${params.toString()}`
  }

  const config = platform && platformConfigs[platform]

  if (!platform) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-20">
      <Card>
        <CardHeader>
          <CardTitle>{config?.name}</CardTitle>
          <CardDescription>{config?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Successfully Connected!</h3>
                <p className="text-sm text-muted-foreground">{accountName}</p>
                <p className="text-xs text-muted-foreground">Redirecting to social accounts...</p>
              </div>
            </div>
          ) : isVerifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Verifying connection...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  You'll be redirected to {config?.name} to authorize AutoPost. Make sure to use your business account.
                </p>
              </div>

              <Button onClick={handleStartOAuth} disabled={isConnecting} className="w-full" size="lg">
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Connect with {config?.name}</>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your credentials are never stored. We only save access tokens for posting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

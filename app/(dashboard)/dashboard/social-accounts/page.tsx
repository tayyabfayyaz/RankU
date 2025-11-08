import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, X } from "lucide-react"
import Link from "next/link"

const platforms = [
  { id: "facebook", name: "Facebook", icon: "👍", color: "bg-blue-600" },
  { id: "instagram", name: "Instagram", icon: "📷", color: "bg-pink-600" },
  { id: "twitter", name: "Twitter/X", icon: "𝕏", color: "bg-black" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
]

export default async function SocialAccountsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch connected social accounts
  const { data: socialAccounts } = await supabase.from("social_accounts").select("*").eq("user_id", user.id)

  const connectedPlatforms = socialAccounts?.map((acc) => acc.platform) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Connected Social Accounts</h1>
        <p className="text-muted-foreground mt-1">Connect your social media accounts to enable automated posting</p>
      </div>

      {/* Connection Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const isConnected = connectedPlatforms.includes(platform.id)
          const account = socialAccounts?.find((acc) => acc.platform === platform.id)

          return (
            <Card key={platform.id} className={isConnected ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>
                        {isConnected ? (
                          <div className="flex items-center gap-1 mt-1 text-green-600">
                            <Check className="w-4 h-4" />
                            <span>Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                            <X className="w-4 h-4" />
                            <span>Not connected</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected && account && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="ml-2 font-medium">{account.account_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connected on {new Date(account.connected_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {isConnected ? (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Reconnect
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Link href={`/dashboard/social-accounts/connect/${platform.id}`} className="block">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Connect {platform.name}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Connection Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How to Connect</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900 space-y-2">
          <p>
            Click on any platform to start the OAuth connection process. You'll be redirected to the platform's login
            page to authorize AutoPost.
          </p>
          <p>Once connected, AutoPost can post to your accounts on the specified schedule.</p>
        </CardContent>
      </Card>

      {/* Connected Accounts Details */}
      {socialAccounts && socialAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Connections ({socialAccounts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{account.platform}</p>
                    <p className="text-sm text-muted-foreground">{account.account_name}</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

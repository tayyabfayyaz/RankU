import { createClient } from "@/lib/supabase/server"
import { StatsOverview } from "@/app/components/dashboard/stats-overview"
import { ContentCalendar } from "@/app/components/dashboard/content-calendar"
import { UpcomingPosts } from "@/app/components/dashboard/upcoming-posts"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch user's scheduled posts
  const { data: scheduledPosts } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: true })

  // Fetch user's products
  const { data: products } = await supabase.from("products").select("*").eq("user_id", user.id)

  // Fetch connected social accounts
  const { data: socialAccounts } = await supabase.from("social_accounts").select("*").eq("user_id", user.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Manage your automated posts.</p>
        </div>
        <Link href="/dashboard/campaigns">
          <Button size="lg">Create New Campaign</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        totalPosts={scheduledPosts?.length || 0}
        connectedAccounts={socialAccounts?.length || 0}
        totalProducts={products?.length || 0}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ContentCalendar posts={scheduledPosts || []} />
        </div>

        {/* Upcoming Posts - Takes 1 column */}
        <div>
          <UpcomingPosts posts={scheduledPosts?.slice(0, 5) || []} />
        </div>
      </div>
    </div>
  )
}

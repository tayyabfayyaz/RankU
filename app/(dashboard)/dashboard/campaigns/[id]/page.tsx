import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CampaignDetails from "@/app/components/dashboard/campaign-detail"
import ScheduledPostsList from "@/app/components/dashboard/schedule-posts-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return notFound()
  }

  // Fetch campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (campaignError || !campaign) {
    return notFound()
  }

  // Fetch scheduled posts
  const { data: scheduledPosts } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("campaign_id", id)
    .order("scheduled_date", { ascending: true })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
          <p className="text-muted-foreground mt-2">{campaign.description}</p>
        </div>

        {/* Campaign Details */}
        <CampaignDetails campaign={campaign} />

        {/* Scheduled Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
            <CardDescription>
              All posts scheduled for this campaign ({scheduledPosts?.length || 0} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduledPostsList posts={scheduledPosts || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

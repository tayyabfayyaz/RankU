import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Eye, Play, Trash2 } from "lucide-react"

interface Campaign {
  id: string
  name: string
  description?: string
  status: string
  platforms: string[]
  total_posts: number
  posted_count: number
  failed_count: number
  start_date: string
  end_date: string
  created_at: string
}

interface CampaignsListProps {
  campaigns: Campaign[]
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  paused: "bg-yellow-100 text-yellow-800",
}

export function CampaignsList({ campaigns }: CampaignsListProps) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <p className="text-muted-foreground mb-4">No campaigns yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first campaign to start automating your social media posts.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{campaign.name}</h3>
                  <Badge className={statusColors[campaign.status] || ""}>{campaign.status}</Badge>
                </div>

                {campaign.description && <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Platforms</p>
                    <p className="font-medium capitalize">{campaign.platforms.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Posts</p>
                    <p className="font-medium">
                      {campaign.posted_count}/{campaign.total_posts}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">{campaign.failed_count} failed</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(campaign.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${campaign.total_posts > 0 ? (campaign.posted_count / campaign.total_posts) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href={`/dashboard/campaigns/${campaign.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
                {campaign.status === "scheduled" && (
                  <Button size="sm" variant="default">
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                )}
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

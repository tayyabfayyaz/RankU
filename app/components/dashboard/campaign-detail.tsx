import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Campaign {
  id: string
  name: string
  description: string
  platforms: string[]
  status: string
  start_date: string
  end_date: string
  post_time: string
  schedule_type: string
  total_posts: number
  created_at: string
}

interface Props {
  campaign: Campaign
}

export default function CampaignDetails({ campaign }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const startDate = new Date(campaign.start_date)
  const endDate = new Date(campaign.end_date)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Campaign Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <p className="font-medium">{format(new Date(campaign.created_at), "MMM dd, yyyy")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Duration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-muted-foreground text-sm">Start Date:</span>
            <p className="font-medium">{format(startDate, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">End Date:</span>
            <p className="font-medium">{format(endDate, "MMM dd, yyyy")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Platforms & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {campaign.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">
                {platform}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-muted-foreground text-sm">Post Time:</span>
            <p className="font-medium">{campaign.post_time}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Total Posts:</span>
            <p className="font-medium">{campaign.total_posts}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

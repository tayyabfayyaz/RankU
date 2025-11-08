"use client"

import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useState } from "react"

interface ScheduledPost {
  id: string
  platform: string
  content: string
  scheduled_date: string
  status: string
  product_id: string
}

interface Props {
  posts: ScheduledPost[]
}

export default function ScheduledPostsList({ posts }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: "f",
      instagram: "ig",
      twitter: "x",
      linkedin: "in",
    }
    return icons[platform.toLowerCase()] || platform.substring(0, 2).toUpperCase()
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No scheduled posts yet</p>
      </div>
    )
  }

  // Group posts by date
  const groupedByDate = posts.reduce(
    (acc, post) => {
      const date = format(new Date(post.scheduled_date), "MMM dd, yyyy")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(post)
      return acc
    },
    {} as Record<string, ScheduledPost[]>,
  )

  return (
    <div className="space-y-4">
      {Object.entries(groupedByDate).map(([date, datePosts]) => (
        <div key={date} className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4">{date}</h3>
          <div className="space-y-3">
            {datePosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-3 bg-background border rounded cursor-pointer hover:bg-muted transition"
                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{post.platform}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(post.scheduled_date), "h:mm a")}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface ScheduledPost {
  id: string
  content: string
  platform: string
  scheduled_date: string
  status: string
}

interface UpcomingPostsProps {
  posts: ScheduledPost[]
}

const platformEmojis: Record<string, string> = {
  instagram: "📷",
  facebook: "👍",
  twitter: "🐦",
  linkedin: "💼",
  website: "🌐",
  youtube: "▶️",
}

export function UpcomingPosts({ posts }: UpcomingPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-3 bg-muted rounded-lg border border-border space-y-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{platformEmojis[post.platform.toLowerCase()] || "📱"}</span>
                  <span className="font-medium text-sm capitalize">{post.platform}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.scheduled_date), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No upcoming posts</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

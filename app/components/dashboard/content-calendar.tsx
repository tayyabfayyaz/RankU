"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfToday, addDays } from "date-fns"

interface ScheduledPost {
  id: string
  content: string
  platform: string
  scheduled_date: string
  status: string
  image_url?: string
}

interface ContentCalendarProps {
  posts: ScheduledPost[]
}

const platformColors: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-800",
  facebook: "bg-blue-100 text-blue-800",
  twitter: "bg-sky-100 text-sky-800",
  linkedin: "bg-indigo-100 text-indigo-800",
  website: "bg-green-100 text-green-800",
  youtube: "bg-red-100 text-red-800",
}

export function ContentCalendar({ posts }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(startOfToday())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Generate 10-day calendar
  const calendarDays = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => addDays(currentDate, i))
  }, [currentDate])

  // Group posts by date
  const postsByDate = useMemo(() => {
    const grouped: Record<string, ScheduledPost[]> = {}
    posts.forEach((post) => {
      const date = new Date(post.scheduled_date).toISOString().split("T")[0]
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(post)
    })
    return grouped
  }, [posts])

  const selectedDatePosts = selectedDate ? postsByDate[selectedDate] || [] : []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>10-Day Content Calendar</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -10))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 10))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-5 gap-3">
          {calendarDays.map((day, idx) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const dayPosts = postsByDate[dateStr] || []
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-xs font-semibold text-muted-foreground mb-2">{format(day, "EEE")}</div>
                <div className="text-lg font-bold text-foreground mb-2">{format(day, "d")}</div>
                {dayPosts.length > 0 && (
                  <div className="text-xs font-medium text-primary">
                    {dayPosts.length} post{dayPosts.length > 1 ? "s" : ""}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected Day Posts */}
        {selectedDate && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-sm text-foreground">
              Posts for {format(new Date(selectedDate), "MMMM d, yyyy")}
            </h4>
            {selectedDatePosts.length > 0 ? (
              <div className="space-y-2">
                {selectedDatePosts.map((post) => (
                  <div key={post.id} className="p-3 bg-muted rounded-lg border border-border text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={platformColors[post.platform.toLowerCase()] || "bg-gray-100"}>
                        {post.platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">{post.status}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No posts scheduled for this date.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

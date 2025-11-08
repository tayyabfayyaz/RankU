"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface SchedulerProps {
  startDate: string
  endDate: string
  postTime: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onPostTimeChange: (time: string) => void
}

export function CampaignScheduler({
  startDate,
  endDate,
  postTime,
  onStartDateChange,
  onEndDateChange,
  onPostTimeChange,
}: SchedulerProps) {
  const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posting Schedule</CardTitle>
        <CardDescription>
          Set when your campaign will run (automatically schedules {daysDiff} days of posts)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="postTime">Daily Posting Time</Label>
          <Input
            id="postTime"
            type="time"
            value={postTime}
            onChange={(e) => onPostTimeChange(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Campaign Duration:</span> {daysDiff} days
          </p>
          <p className="text-sm text-blue-800 mt-2">
            Posts will be automatically scheduled and distributed across this period.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface YouTubeData {
  videoContent: string
  targetAudience: string
  videoCategory: string
  videoDescription: string
  keyPoints: string
}

interface YouTubeFormProps {
  data: YouTubeData
  setData: (data: YouTubeData) => void
  onGenerate: () => void
  isLoading: boolean
}

export function YouTubeForm({ data, setData, onGenerate, isLoading }: YouTubeFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Video Content Topic *</label>
          <Textarea
            placeholder="What is your video about? Describe the main topic and content..."
            value={data.videoContent}
            onChange={(e) => setData({ ...data, videoContent: e.target.value })}
            className="border-red-200 focus:border-red-600 min-h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Target Audience *</label>
          <Input
            placeholder="e.g., Tech enthusiasts, beginners, professionals"
            value={data.targetAudience}
            onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
            className="border-red-200 focus:border-red-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Video Category *</label>
          <select
            value={data.videoCategory}
            onChange={(e) => setData({ ...data, videoCategory: e.target.value })}
            className="w-full border border-red-200 rounded-md px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
          >
            <option value="">Select a category</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="health">Health & Fitness</option>
            <option value="gaming">Gaming</option>
            <option value="music">Music</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Video Description</label>
          <Textarea
            placeholder="Additional description or key messages in your video..."
            value={data.videoDescription}
            onChange={(e) => setData({ ...data, videoDescription: e.target.value })}
            className="border-red-200 focus:border-red-600 min-h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Key Points / Highlights</label>
          <Textarea
            placeholder="Important points or topics covered in the video..."
            value={data.keyPoints}
            onChange={(e) => setData({ ...data, keyPoints: e.target.value })}
            className="border-red-200 focus:border-red-600 min-h-20"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold"
        >
          {isLoading ? "Generating..." : "Generate YouTube SEO Content"}
        </Button>
      </Card>
    </div>
  )
}

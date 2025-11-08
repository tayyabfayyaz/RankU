"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface WebsiteData {
  websiteLink: string
  category: string
  targetAudience: string
  description: string
  businessType: string
  mainKeywords: string
  competitors: string
}

interface WebsiteFormProps {
  data: WebsiteData
  setData: (data: WebsiteData) => void
  onGenerate: () => void
  isLoading: boolean
}

export function WebsiteForm({ data, setData, onGenerate, isLoading }: WebsiteFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Website Link *</label>
          <Input
            placeholder="https://example.com"
            type="url"
            value={data.websiteLink}
            onChange={(e) => setData({ ...data, websiteLink: e.target.value })}
            className="border-green-200 focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Business Category *</label>
          <select
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="w-full border border-green-200 rounded-md px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Select a category</option>
            <option value="ecommerce">E-commerce</option>
            <option value="saas">SaaS</option>
            <option value="services">Services</option>
            <option value="blog">Blog</option>
            <option value="portfolio">Portfolio</option>
            <option value="news">News/Media</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Target Audience *</label>
          <Input
            placeholder="e.g., Small business owners, startups, enterprises"
            value={data.targetAudience}
            onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
            className="border-green-200 focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Business Description *</label>
          <Textarea
            placeholder="Describe your business, products, and services..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="border-green-200 focus:border-green-600 min-h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Business Type</label>
          <Input
            placeholder="e.g., B2B, B2C, D2C"
            value={data.businessType}
            onChange={(e) => setData({ ...data, businessType: e.target.value })}
            className="border-green-200 focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Main Keywords</label>
          <Input
            placeholder="e.g., keyword1, keyword2, keyword3"
            value={data.mainKeywords}
            onChange={(e) => setData({ ...data, mainKeywords: e.target.value })}
            className="border-green-200 focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Competitors (comma separated)</label>
          <Input
            placeholder="e.g., competitor1.com, competitor2.com"
            value={data.competitors}
            onChange={(e) => setData({ ...data, competitors: e.target.value })}
            className="border-green-200 focus:border-green-600"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
        >
          {isLoading ? "Generating..." : "Generate Website SEO Strategy"}
        </Button>
      </Card>
    </div>
  )
}

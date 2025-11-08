"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { CampaignProductSelector } from "@/app/components/dashboard/campaign-product-selector"
import { CampaignScheduler } from "@/app/components/dashboard/campaign-scheduler"

const platforms = [
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "facebook", name: "Facebook", icon: "👍" },
  { id: "twitter", name: "Twitter/X", icon: "𝕏" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [isCreating, setIsCreating] = useState(false)

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    platforms: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    postTime: "09:00",
    selectedProducts: [] as string[],
    scheduleType: "daily",
  })

  const togglePlatform = (platformId: string) => {
    setCampaignData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }))
  }

  const handleCreate = async () => {
    if (!campaignData.name.trim()) {
      alert("Please enter a campaign name")
      return
    }

    if (campaignData.platforms.length === 0) {
      alert("Please select at least one platform")
      return
    }

    if (campaignData.selectedProducts.length === 0) {
      alert("Please select at least one product")
      return
    }

    setIsCreating(true)

    try {
      console.log("🟡 Sending campaign creation request...")
      
      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignData.name.trim(),
          description: campaignData.description.trim(),
          platforms: campaignData.platforms,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          postTime: campaignData.postTime,
          products: campaignData.selectedProducts,
          scheduleType: campaignData.scheduleType,
        }),
      })

      const data = await response.json()
      console.log("🟢 API Response:", data)

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create campaign")
      }

      if (data.success) {
        console.log("✅ Campaign created successfully, redirecting...")
        router.push(`/dashboard/campaigns/${data.campaignId}`)
      } else {
        throw new Error(data.error || "Failed to create campaign")
      }
    } catch (error) {
      console.error("🔴 Error creating campaign:", error)
      alert(`Failed to create campaign: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/campaigns">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground mt-2">Set up an automated 10-day posting campaign</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Campaign Details</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="products">Products & Schedule</TabsTrigger>
        </TabsList>

        {/* Campaign Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
              <CardDescription>Set up the basic information for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Product Launch"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign goals and targets"
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  className="mt-2"
                />
              </div>

              <Button onClick={() => setActiveTab("platforms")} className="w-full">
                Next: Select Platforms
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Select Platforms</CardTitle>
              <CardDescription>Choose which social media platforms to post to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted"
                  >
                    <Checkbox
                      id={platform.id}
                      checked={campaignData.platforms.includes(platform.id)}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="cursor-pointer flex items-center gap-2 flex-1">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab("products")}>Next: Select Products</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products & Schedule Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products & Schedule</CardTitle>
              <CardDescription>Select products and set up the posting schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CampaignProductSelector
                selectedProducts={campaignData.selectedProducts}
                onProductsChange={(products) => setCampaignData({ ...campaignData, selectedProducts: products })}
              />

              <CampaignScheduler
                startDate={campaignData.startDate}
                endDate={campaignData.endDate}
                postTime={campaignData.postTime}
                onStartDateChange={(date) => setCampaignData({ ...campaignData, startDate: date })}
                onEndDateChange={(date) => setCampaignData({ ...campaignData, endDate: date })}
                onPostTimeChange={(time) => setCampaignData({ ...campaignData, postTime: time })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setActiveTab("platforms")}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={isCreating} className="bg-green-600 hover:bg-green-700">
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
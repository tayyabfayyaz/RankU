"use client"

import { useState } from "react"
import { Navigation } from "@/app/components/navigation"
import { Footer } from "@/app/components/footer"
import { WebsiteForm } from "@/app/components/form/website-form"
import { SEOContentGenerator } from "@/app/components/seo-content-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface WebsiteData {
  websiteLink: string
  category: string
  targetAudience: string
  description: string
  businessType: string
  mainKeywords: string
  competitors: string
}

export default function WebsiteSEOPage() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    websiteLink: "",
    category: "",
    targetAudience: "",
    description: "",
    businessType: "",
    mainKeywords: "",
    competitors: "",
  })
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!websiteData.websiteLink || !websiteData.category || !websiteData.targetAudience) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-seo-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "website",
          websiteLink: websiteData.websiteLink,
          category: websiteData.category,
          targetAudience: websiteData.targetAudience,
          description: websiteData.description,
          businessType: websiteData.businessType,
          mainKeywords: websiteData.mainKeywords,
          competitors: websiteData.competitors,
        }),
      })

      const data = await response.json()
      setGeneratedContent(data)
      setShowGenerator(true)
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href="/services">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 sticky top-24 h-fit">
              <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Website SEO</h1>
                <p className="text-green-100 mb-6">Transform your website into a search engine powerhouse</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-green-200">Generate:</p>
                    <ul className="text-sm text-green-100 space-y-1 mt-2">
                      <li>✓ Meta descriptions</li>
                      <li>✓ Page titles</li>
                      <li>✓ Content strategy</li>
                      <li>✓ Backlink analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!showGenerator ? (
                <WebsiteForm
                  data={websiteData}
                  setData={setWebsiteData}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
              ) : (
                <div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGenerator(false)
                      setGeneratedContent(null)
                    }}
                    className="mb-6"
                  >
                    Generate New Content
                  </Button>
                  <SEOContentGenerator platform="website" {...({ content: generatedContent } as any)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

"use client"

import { useState } from "react"
import { Navigation } from "@/app/components/navigation"
import { Footer } from "@/app/components/footer"
import { InstagramForm } from "@/app/components/form/instagram-form"
import { SEOContentGenerator } from "@/app/components/seo-content-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface InstagramData {
  productImage: File | null
  productName: string
  productDescription: string
  targetAudience: string
}

export default function InstagramSEOPage() {
  const [instagramData, setInstagramData] = useState<InstagramData>({
    productImage: null,
    productName: "",
    productDescription: "",
    targetAudience: "",
  })
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!instagramData.productName || !instagramData.productDescription || !instagramData.targetAudience) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-seo-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "instagram",
          productName: instagramData.productName,
          productDescription: instagramData.productDescription,
          targetAudience: instagramData.targetAudience,
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
              <div className="bg-linear-to-br from-pink-500 to-purple-600 rounded-xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Instagram SEO</h1>
                <p className="text-pink-100 mb-6">
                  Optimize your product for Instagram discovery with AI-powered SEO content
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-pink-200">Generate:</p>
                    <ul className="text-sm text-pink-100 space-y-1 mt-2">
                      <li>✓ Optimized captions</li>
                      <li>✓ Relevant hashtags</li>
                      <li>✓ Keywords research</li>
                      <li>✓ Competitor analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!showGenerator ? (
                <InstagramForm
                  data={instagramData}
                  setData={setInstagramData}
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
                  <SEOContentGenerator platform="instagram" {...({ content: generatedContent } as any)} />
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

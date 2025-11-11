"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText } from "lucide-react"
import { CSVTemplateDownload } from "@/app/components/dashboard/csv-template-download"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BulkUploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState<"csv" | "json" | null>(null)

  const handleFileUpload = async (file: File, type: "csv" | "json") => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setResult(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("Upload response:", data)

      if (response.ok) {
        setResult(data)
        setUploadProgress(100)
      } else {
        setError(data.error || "Upload failed. Please try again.")
      }
    } catch (err) {
      console.log("Upload error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, type: "csv" | "json", active: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) {
      setDragActive(active ? type : null)
    }
  }

  const handleDropCSV = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.name.endsWith(".csv")) {
        handleFileUpload(file, "csv")
      } else {
        setError("Please drop a CSV file")
      }
    }
  }

  const handleDropJSON = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.name.endsWith(".json")) {
        handleFileUpload(file, "json")
      } else {
        setError("Please drop a JSON file")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: "csv" | "json") => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file, type)
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/products">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Bulk Upload Products</h1>
        <p className="text-muted-foreground mt-2">Upload multiple products at once using CSV or JSON format</p>
      </div>

      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          <TabsTrigger value="json">JSON Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>Import products from a CSV file. Download the template to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CSVTemplateDownload />

              <div
                onDragOver={(e) => handleDrag(e, "csv", true)}
                onDragLeave={(e) => handleDrag(e, "csv", false)}
                onDrop={handleDropCSV}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive === "csv" ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleInputChange(e, "csv")}
                  disabled={isUploading}
                  className="hidden"
                  id="csv-input"
                />
                <label htmlFor="csv-input" className="cursor-pointer block">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-semibold mb-2">Drag and drop your CSV file</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Button type="button" variant="outline" disabled={isUploading}>
                    Select CSV File
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Upload JSON File</CardTitle>
              <CardDescription>Import products from a JSON file with array of product objects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm font-mono text-foreground max-h-40 overflow-auto">
                {JSON.stringify(
                  [
                    {
                      name: "Product Name",
                      description: "Product description",
                      category: "Electronics",
                      target_audience: "Tech enthusiasts",
                      sku: "SKU-001",
                      price: 99.99,
                    },
                  ],
                  null,
                  2,
                )}
              </div>

              <div
                onDragOver={(e) => handleDrag(e, "json", true)}
                onDragLeave={(e) => handleDrag(e, "json", false)}
                onDrop={handleDropJSON}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive === "json" ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleInputChange(e, "json")}
                  disabled={isUploading}
                  className="hidden"
                  id="json-input"
                />
                <label htmlFor="json-input" className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-semibold mb-2">Drag and drop your JSON file</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Button type="button" variant="outline" disabled={isUploading}>
                    Select JSON File
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">Upload Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{result.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{result.successful}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-auto">
                <p className="font-semibold text-red-800 mb-2">Errors:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((err: any, idx: number) => (
                    <li key={idx}>
                      Row {err.index + 1}: {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => router.push("dashboard/products")} className="w-full">
              View Products
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

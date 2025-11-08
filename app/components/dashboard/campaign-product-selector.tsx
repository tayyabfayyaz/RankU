"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  image_url?: string
  category: string
}

interface ProductSelectorProps {
  selectedProducts: string[]
  onProductsChange: (products: string[]) => void
}

export function CampaignProductSelector({ selectedProducts, onProductsChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/list")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProduct = (productId: string) => {
    const updated = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId]
    onProductsChange(updated)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Products</CardTitle>
        <CardDescription>
          Choose which products to include in this campaign ({selectedProducts.length} selected)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                <Checkbox
                  id={product.id}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                  className="mt-1"
                />
                <Label htmlFor={product.id} className="cursor-pointer flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-2 text-center py-8">
              No products available. Create products first.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

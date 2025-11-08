import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch all products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.log("[v0] Error fetching products:", error)
  }

  const productList = products || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-2">Manage your uploaded products</p>
          </div>
        </div>
        <Link href="dashboard/products/bulk-upload">
          <Button>Upload More Products</Button>
        </Link>
      </div>

      {productList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No products yet. Start by uploading some!</p>
            <Link href="/products/bulk-upload">
              <Button>Upload Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">
            Total Products: <span className="font-semibold text-foreground">{productList.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productList.map((product: any) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm line-clamp-3">{product.description}</p>
                  </div>

                  {product.target_audience && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
                      <p className="text-sm">{product.target_audience}</p>
                    </div>
                  )}

                  {product.sku && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">SKU</p>
                      <p className="text-sm font-mono">{product.sku}</p>
                    </div>
                  )}

                  {product.price && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Added</p>
                    <p className="text-sm">{new Date(product.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

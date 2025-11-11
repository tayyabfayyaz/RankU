import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Package, Trash2 } from "lucide-react"
import { deleteProduct } from "@/app/(dashboard)/dashboard/products/action/delete-product"

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch all products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
  }

  const productList = products || []

  return (
    <div className="space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
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
        <Link href="/dashboard/products/bulk-upload">
          <Button>Upload More Products</Button>
        </Link>
      </div>

      {/* ---------- NO PRODUCTS STATE ---------- */}
      {productList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No products yet. Start by uploading some!
            </p>
            <Link href="/dashboard/products/bulk-upload">
              <Button>Upload Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ---------- TOTAL COUNT ---------- */}
          <div className="text-sm text-muted-foreground">
            Total Products:{" "}
            <span className="font-semibold text-foreground">{productList.length}</span>
          </div>

          {/* ---------- PRODUCT GRID ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productList.map((product: any) => (
              <form
                key={product.id}
                action={async () => {
                  "use server"
                  await deleteProduct(product.id)
                }}
              >
                <Card className="flex flex-col hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    {/* ---------- DESCRIPTION ---------- */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm line-clamp-3">{product.description}</p>
                    </div>

                    {/* ---------- OPTIONAL FIELDS ---------- */}
                    {product.target_audience && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Target Audience
                        </p>
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
                        <p className="text-sm font-semibold">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* ---------- CREATED AT ---------- */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Added</p>
                      <p className="text-sm">
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* ---------- DELETE BUTTON ---------- */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

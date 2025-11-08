import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  category: string
  target_audience: string
  image_url?: string
  price?: number
  sku?: string
  created_at: string
}

interface ProductsListProps {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <p className="text-sm text-muted-foreground">
            Start by uploading products in bulk or adding them individually.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {product.image_url && (
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          )}
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{product.category}</Badge>
              {product.price && <Badge variant="secondary">${product.price.toFixed(2)}</Badge>}
            </div>

            <p className="text-xs text-muted-foreground">Target: {product.target_audience}</p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

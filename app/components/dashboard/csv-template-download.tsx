"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function CSVTemplateDownload() {
  const handleDownload = () => {
    const template = `name,description,category,target_audience,sku,price,image_url
Premium Wireless Headphones,High-quality wireless headphones with noise cancellation,Electronics,Tech enthusiasts,SKU-001,199.99,
Organic Cotton T-Shirt,100% organic cotton comfortable t-shirt,Apparel,Eco-conscious shoppers,SKU-002,29.99,
Bamboo Water Bottle,Eco-friendly bamboo water bottle 500ml,Home,Environmentally conscious,SKU-003,39.99,`

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template))
    element.setAttribute("download", "products-template.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
      <Download className="w-4 h-4" />
      Download CSV Template
    </Button>
  )
}

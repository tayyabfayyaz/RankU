import { type NextRequest, NextResponse } from "next/server"
import Papa from "papaparse"
import { createClient } from "@/lib/supabase/server"

function validateProductData(product: any, index: number) {
  const errors: string[] = []

  if (!product.name || typeof product.name !== "string") {
    errors.push("name is required and must be a string")
  }

  if (!product.description || typeof product.description !== "string") {
    errors.push("description is required and must be a string")
  }

  if (!product.category || typeof product.category !== "string") {
    errors.push("category is required and must be a string")
  }

  return { isValid: errors.length === 0, errors }
}

// ✅ Utility wrapper to parse CSV asynchronously
async function parseCSV(fileContent: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => resolve(results.data),
      error: (error: any) => reject(error),
    })
  })
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (type !== "csv" && type !== "json") {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const fileContent = await file.text()
    const products: any[] = []
    const errors: any[] = []

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    const userId = user.id

    // ✅ CSV upload logic
    if (type === "csv") {
      let parsedRows: any[]
      try {
        parsedRows = await parseCSV(fileContent)
      } catch (parseError: any) {
        return NextResponse.json(
          { error: `CSV parsing error: ${parseError.message}` },
          { status: 400 }
        )
      }

      parsedRows.forEach((row, index) => {
        const validation = validateProductData(row, index)
        if (validation.isValid) {
          products.push({
            user_id: userId,
            name: row.name,
            description: row.description,
            category: row.category,
            target_audience: row.target_audience || null,
            sku: row.sku || null,
            price:
              row.price && !isNaN(Number.parseFloat(row.price))
                ? Number.parseFloat(row.price)
                : null,
          })
        } else {
          errors.push({ index, error: validation.errors.join(", ") })
        }
      })
    }

    // ✅ JSON upload logic
    if (type === "json") {
      try {
        const jsonData = JSON.parse(fileContent)
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]

        dataArray.forEach((item, index) => {
          const validation = validateProductData(item, index)
          if (validation.isValid) {
            products.push({
              user_id: userId,
              name: item.name,
              description: item.description,
              category: item.category,
              target_audience: item.target_audience || null,
              sku: item.sku || null,
              price:
                item.price && !isNaN(Number.parseFloat(item.price))
                  ? Number.parseFloat(item.price)
                  : null,
            })
          } else {
            errors.push({ index, error: validation.errors.join(", ") })
          }
        })
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 }
        )
      }
    }

    // ✅ Save to database
    if (products.length > 0) {
      const { error: insertError } = await supabase
        .from("products")
        .insert(products)

      if (insertError) {
        console.error("[v0] Supabase insert error:", insertError)
        return NextResponse.json(
          { error: `Failed to save products: ${insertError.message}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      total: products.length + errors.length,
      successful: products.length,
      failed: errors.length,
      errors,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

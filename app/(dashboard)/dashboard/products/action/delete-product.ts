"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient()

    // Delete product by ID
    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      console.error("❌ Error deleting product:", error.message)
      throw new Error(error.message)
    }

    // Revalidate the products page so it updates instantly
    revalidatePath("/dashboard/products")

    return { success: true }
  } catch (error: any) {
    console.error("⚠️ Delete failed:", error.message)
    return { success: false, error: error.message }
  }
}

import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/app/components/dashboard/sidebar"
import { DashboardHeader } from "@/app/components/dashboard/header"

// ✅ Add metadata for favicon + dynamic title
export const metadata = {
  title: {
    default: "RankU Dashboard",
    template: "%s | RankU", // This allows dynamic titles
  },
  icons: {
    icon: "/ranku.ico", // Place this icon file in the public/ directory
  },
  description: "AI-powered SEO and social media automation platform by RankU",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

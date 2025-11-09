"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Package, Share2, Settings, LogOut, LayoutDashboard, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Content Calendar" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/social-accounts", icon: Share2, label: "Social Accounts" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/ranku_logo_1.png" alt="Ranku Logo" width={100} height={24} />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-2">
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Create Campaign Button */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link href="/dashboard/create-campaign" className="w-full">
          <Button className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

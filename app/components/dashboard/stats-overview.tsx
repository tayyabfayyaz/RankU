import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Package, Share2, TrendingUp } from "lucide-react"

interface StatsOverviewProps {
  totalPosts: number
  connectedAccounts: number
  totalProducts: number
}

export function StatsOverview({ totalPosts, connectedAccounts, totalProducts }: StatsOverviewProps) {
  const stats = [
    {
      title: "Scheduled Posts",
      value: totalPosts,
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Connected Accounts",
      value: connectedAccounts,
      icon: Share2,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Posts This Month",
      value: "0",
      icon: TrendingUp,
      color: "bg-orange-500/10 text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.title === "Scheduled Posts"
                  ? "Upcoming in 10 days"
                  : stat.title === "Connected Accounts"
                    ? "Social platforms"
                    : "In database"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

import { Card } from "@/components/ui/card"
import { BookOpen, Search, TrendingUp, Zap } from "lucide-react"

const services = [
  {
    icon: BookOpen,
    title: "SEO Documentation",
    description: "Comprehensive SEO documentation for your products, optimized for search engines and user experience.",
  },
  {
    icon: Search,
    title: "Keyword Research",
    description: "Deep analysis of search keywords relevant to your products with volume and competition metrics.",
  },
  {
    icon: TrendingUp,
    title: "Product Matching",
    description: "Intelligent matching of your products with high-intent keywords and search queries.",
  },
  {
    icon: Zap,
    title: "Competitive Analysis",
    description: "Discover competing products and get actionable insights to outrank your competition.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our SEO Agent Provides
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage AI-powered tools to optimize your online presence and dominate search results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { CheckCircle2 } from "lucide-react"

const features = [
  {
    title: "Real-time Analysis",
    description: "Get instant SEO insights and recommendations as you add new products",
  },
  {
    title: "AI-Powered Suggestions",
    description: "Machine learning algorithms provide smart optimization suggestions",
  },
  {
    title: "Competitor Tracking",
    description: "Monitor competitor strategies and stay ahead of the curve",
  },
  {
    title: "Keyword Clustering",
    description: "Automatically group related keywords for better targeting",
  },
  {
    title: "Content Optimization",
    description: "Get recommendations to optimize your product descriptions",
  },
  {
    title: "Performance Metrics",
    description: "Track rankings, traffic, and conversions in one dashboard",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in search engine optimization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

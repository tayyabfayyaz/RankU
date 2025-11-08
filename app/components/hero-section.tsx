import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                ✨ AI-Powered SEO Intelligence
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Dominate Search Rankings with AI
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Our intelligent SEO agent analyzes your products, researches keywords, and provides competitive insights.
              Get comprehensive SEO documentation and actionable recommendations automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">10K+</p>
                <p>Active Users</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">98%</p>
                <p>Satisfaction</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">24/7</p>
                <p>Support</p>
              </div>
            </div>
          </div>

          {/* Right Video/Image */}
          <div className="relative">
            <div className="aspect-video bg-linear-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border border-border">
              <video autoPlay muted loop className="w-full h-full object-cover" poster="/ranku_dashboard.png">
                <source src="/ranku_dashboard.png" type="video/mp4" />
              </video>
              {/* Fallback image */}
              
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

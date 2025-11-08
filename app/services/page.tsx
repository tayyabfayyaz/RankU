import { Navigation } from "@/app/components/navigation"
import { Footer } from "@/app/components/footer"
import { ServiceCard } from "@/app/components/service-card"

export default function ServicesPage() {
  const services = [
    {
      id: "instagram",
      title: "Instagram SEO",
      description: "Optimize your Instagram content for maximum visibility and engagement",
      icon: "📸",
      color: "from-pink-500 to-rose-500",
      href: "/services/instagram",
    },
    {
      id: "facebook",
      title: "Facebook SEO",
      description: "Boost your Facebook presence with strategic SEO optimization",
      icon: "f",
      color: "from-blue-600 to-blue-400",
      href: "/services/facebook",
    },
    {
      id: "website",
      title: "Website SEO",
      description: "Create comprehensive SEO content for your website with competitive analysis",
      icon: "🌐",
      color: "from-purple-500 to-indigo-500",
      href: "/services/website",
    },
    {
      id: "youtube",
      title: "YouTube SEO",
      description: "Optimize your YouTube videos with AI-powered titles, descriptions, and tags",
      icon: "▶️",
      color: "from-red-500 to-red-600",
      href: "/services/youtube",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our SEO Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your platform and let our AI agent analyze your products to generate optimized SEO content with
              targeted keywords
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

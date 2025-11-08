import { Navigation } from "@/app/components/navigation"
import { HeroSection } from "@/app/components/hero-section"
import { ServicesSection } from "@/app/components/service-section"
import { FeaturesSection } from "@/app/components/feature-section"
import { HowItWorksSection } from "@/app/components/how-it-works-section"
import { PricingSection } from "@/app/components/prising-section"
import { TestimonialsSection } from "@/app/components/testimonials-section"
import { CTASection } from "@/app/components/cta-section"
import { Footer } from "@/app/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TrustSection } from "@/components/landing/trust-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <StatsSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  )
}

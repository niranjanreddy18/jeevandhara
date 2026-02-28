import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, HeartPulse } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-card">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Verified Medical Fundraising
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Life Flows When{" "}
            <span className="text-primary">Society Supports</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            JeevanDhara is an AI-powered medical fundraising platform that verifies
            patient documents to reduce fraud and ensures transparent donation
            tracking.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/apply">
              <Button size="lg" className="gap-2 px-8">
                <HeartPulse className="h-5 w-5" />
                Apply for Medical Support
              </Button>
            </Link>
            <Link href="/payment">
              <Button variant="outline" size="lg" className="gap-2 px-8">
                Donate Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

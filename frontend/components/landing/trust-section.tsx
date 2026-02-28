import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Eye, Lock, FileSearch } from "lucide-react"

const trustFeatures = [
  {
    title: "AI-Powered Verification",
    description:
      "Every application undergoes automated OCR extraction, duplicate detection, and cost anomaly analysis before it reaches donors.",
    icon: FileSearch,
  },
  {
    title: "Full Transparency",
    description:
      "Track every donation in real-time. Our public dashboard shows exactly where funds go, with a complete transaction ledger.",
    icon: Eye,
  },
  {
    title: "Secure & Private",
    description:
      "Patient documents and donor information are encrypted and handled with the highest privacy standards. Government IDs are masked.",
    icon: Lock,
  },
  {
    title: "Admin Oversight",
    description:
      "A dedicated admin team reviews every AI-verified case before approval, adding a critical human review layer to the process.",
    icon: ShieldCheck,
  },
]

export function TrustSection() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Transparency & Trust
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Built on a foundation of verification, transparency, and accountability at every step.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="border-border bg-background transition-shadow hover:shadow-md"
              >
                <CardContent className="flex gap-5 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

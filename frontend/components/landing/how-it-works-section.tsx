import { Card, CardContent } from "@/components/ui/card"
import { FileText, Brain, UserCheck, Users } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Patient Submits Details",
    description:
      "Patients submit their medical records, hospital details, and required treatment costs through our secure portal.",
    icon: FileText,
  },
  {
    step: "02",
    title: "AI Verifies Documents",
    description:
      "Our AI system performs OCR extraction, duplicate detection, hospital validation, and cost anomaly analysis.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Admin Review & Approval",
    description:
      "Verified applications are reviewed by our admin team for final approval before going live for fundraising.",
    icon: UserCheck,
  },
  {
    step: "04",
    title: "Public & Universities Contribute",
    description:
      "Approved cases are listed publicly. Individuals and university communities can donate transparently.",
    icon: Users,
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A simple, transparent, and AI-powered process to connect patients in need with generous donors.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.step}
                className="group relative overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-primary">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

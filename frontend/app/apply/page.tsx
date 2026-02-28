"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Brain,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type FormState = "form" | "submitting" | "verifying" | "complete"

interface VerificationStep {
  label: string
  status: "pending" | "active" | "done"
}

export default function ApplyPage() {
  const [formState, setFormState] = useState<FormState>("form")
  const [progress, setProgress] = useState(0)
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { label: "Document Upload Received", status: "pending" },
    { label: "OCR Text Extraction", status: "pending" },
    { label: "Hospital Name Validation", status: "pending" },
    { label: "Cost Anomaly Detection", status: "pending" },
    { label: "Duplicate Document Check", status: "pending" },
    { label: "Trust Score Calculation", status: "pending" },
  ])

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    hospitalName: "",
    disease: "",
    requiredAmount: "",
    description: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const simulateVerification = () => {
    setFormState("verifying")
    const steps = [...verificationSteps]

    steps.forEach((_, index) => {
      setTimeout(() => {
        setVerificationSteps((prev) =>
          prev.map((step, i) => {
            if (i === index) return { ...step, status: "active" }
            if (i < index) return { ...step, status: "done" }
            return step
          })
        )
        setProgress(((index + 1) / steps.length) * 100)

        if (index === steps.length - 1) {
          setTimeout(() => {
            setVerificationSteps((prev) =>
              prev.map((step) => ({ ...step, status: "done" }))
            )
            setFormState("complete")
            setProgress(100)
          }, 800)
        }
      }, (index + 1) * 1200)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.hospitalName || !formData.disease || !formData.requiredAmount) {
      toast.error("Please fill in all required fields")
      return
    }

    setFormState("submitting")
    setTimeout(() => {
      simulateVerification()
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Apply for Medical Support
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Submit your medical details below. Our AI system will verify your
              documents for a faster, transparent process.
            </p>
          </div>

          {formState === "form" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
                <CardDescription>
                  Fill in accurate information. All data is encrypted and handled
                  securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="+91-XXXXXXXXXX"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="hospitalName">
                        Hospital Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="hospitalName"
                        name="hospitalName"
                        placeholder="Name of the treating hospital"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="disease">
                        Disease / Condition <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="disease"
                        name="disease"
                        placeholder="e.g., Kidney Transplant"
                        value={formData.disease}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="requiredAmount">
                        Required Amount (INR) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="requiredAmount"
                        name="requiredAmount"
                        type="number"
                        placeholder="e.g., 500000"
                        value={formData.requiredAmount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Briefly describe the medical situation..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>Upload Medical Documents (PDF/Image)</Label>
                      <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload or drag & drop
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF, PNG, JPG up to 10MB
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Upload Government ID</Label>
                      <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload or drag & drop
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID will be masked for privacy
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {(formState === "submitting" || formState === "verifying" || formState === "complete") && (
            <Card className="border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {formState === "complete" ? (
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  ) : (
                    <Brain className="h-8 w-8 text-primary" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {formState === "submitting"
                    ? "Submitting Application..."
                    : formState === "complete"
                    ? "Verification Complete"
                    : "Application Under AI Verification"}
                </CardTitle>
                <CardDescription>
                  {formState === "complete"
                    ? "Your application has been submitted and verified. Our admin team will now review it."
                    : "Your documents are being analyzed by our AI verification system."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verification Progress</span>
                    <span className="font-medium text-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex flex-col gap-3">
                  {verificationSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                    >
                      {step.status === "done" ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                      ) : step.status === "active" ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={
                          step.status === "done"
                            ? "text-sm font-medium text-foreground"
                            : step.status === "active"
                            ? "text-sm font-medium text-primary"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {step.label}
                      </span>
                      {step.status === "done" && (
                        <Badge variant="secondary" className="ml-auto bg-success/10 text-success">
                          Passed
                        </Badge>
                      )}
                      {step.status === "active" && (
                        <Badge variant="secondary" className="ml-auto">
                          Processing
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {formState === "complete" && (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-success" />
                      <span className="font-semibold text-foreground">
                        AI Trust Score: 87/100
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your application has passed automated verification. It is now
                      pending admin review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

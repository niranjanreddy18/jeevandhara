"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ScanSearch,
  Building2,
  IndianRupee,
  Copy,
} from "lucide-react"

interface VerificationResult {
  ocrText: string
  fraudScore: number
  status: "verified" | "under-review" | "rejected"
  checks: {
    label: string
    passed: boolean
    detail: string
  }[]
}

const mockResults: Record<string, VerificationResult> = {
  verified: {
    ocrText: `PATIENT MEDICAL REPORT
---
Patient Name: Aarav Sharma
Hospital: AIIMS New Delhi (Reg: HOSP-DL-29841)
Date: 15 Jan 2026

Diagnosis: Chronic Kidney Disease (Stage 5)
Recommended Treatment: Kidney Transplant
Estimated Cost: INR 8,50,000

Doctor: Dr. Rajesh Kumar (MCI Reg: 45821)
Department: Nephrology

Notes: Patient requires immediate transplant.
Pre-operative tests completed. Donor matched.
Surgery scheduled pending financial clearance.`,
    fraudScore: 94,
    status: "verified",
    checks: [
      { label: "Duplicate Document Detection", passed: true, detail: "No duplicates found in database of 12,400+ documents" },
      { label: "Hospital Name Validation", passed: true, detail: "AIIMS New Delhi verified via NABH registry (Reg: HOSP-DL-29841)" },
      { label: "Cost Anomaly Detection", passed: true, detail: "INR 8,50,000 within expected range for kidney transplant (6L-12L)" },
      { label: "Doctor Registration Check", passed: true, detail: "Dr. Rajesh Kumar (MCI: 45821) verified in medical council registry" },
      { label: "OCR Confidence Score", passed: true, detail: "Text extraction confidence: 97.2%" },
    ],
  },
  "under-review": {
    ocrText: `TREATMENT ESTIMATE
---
Patient: Sanya Iyer
Hospital: Apollo Hospital Chennai
Date: 18 Feb 2026

Condition: Liver Disease
Treatment: Liver Transplant
Cost Estimate: INR 20,00,000

Doctor: Dr. Meena (details partially illegible)

Note: *** some text unreadable ***
Additional documents may be required.`,
    fraudScore: 72,
    status: "under-review",
    checks: [
      { label: "Duplicate Document Detection", passed: true, detail: "No duplicates found" },
      { label: "Hospital Name Validation", passed: true, detail: "Apollo Hospital Chennai verified via NABH registry" },
      { label: "Cost Anomaly Detection", passed: false, detail: "INR 20,00,000 is above typical range for liver transplant (8L-18L). Flagged for manual review." },
      { label: "Doctor Registration Check", passed: false, detail: "Doctor details partially illegible. Unable to verify MCI registration." },
      { label: "OCR Confidence Score", passed: false, detail: "Text extraction confidence: 68.4% (below threshold of 85%)" },
    ],
  },
  rejected: {
    ocrText: `MEDICAL CERTIFICATE
---
Name: [REDACTED]
Hospital: City General Hospital, Bangalore
Date: 20 Feb 2026

Diagnosis: Spinal Injury
Treatment: Surgery
Amount: INR 7,50,000

Note: Document appears to have inconsistencies
with previously submitted records.`,
    fraudScore: 23,
    status: "rejected",
    checks: [
      { label: "Duplicate Document Detection", passed: false, detail: "Document matches 87% with a previously flagged submission (Case #PT-389)" },
      { label: "Hospital Name Validation", passed: false, detail: "City General Hospital Bangalore not found in NABH or state health registry" },
      { label: "Cost Anomaly Detection", passed: false, detail: "Cost details inconsistent with standard spinal surgery estimates" },
      { label: "Doctor Registration Check", passed: false, detail: "No doctor details provided in the document" },
      { label: "OCR Confidence Score", passed: true, detail: "Text extraction confidence: 91.3%" },
    ],
  },
}

function StatusBadge({ status }: { status: string }) {
  if (status === "verified") {
    return (
      <Badge className="gap-1 bg-success/10 text-success hover:bg-success/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </Badge>
    )
  }
  if (status === "under-review") {
    return (
      <Badge className="gap-1 bg-warning/10 text-warning-foreground hover:bg-warning/20">
        <Clock className="h-3.5 w-3.5" />
        Under Review
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20">
      <XCircle className="h-3.5 w-3.5" />
      Rejected
    </Badge>
  )
}

function FraudScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-success"
      : score >= 50
      ? "text-warning-foreground"
      : "text-destructive"

  const bgColor =
    score >= 80
      ? "bg-success"
      : score >= 50
      ? "bg-warning"
      : "bg-destructive"

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 351.86} 351.86`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${bgColor}`} />
        <span className="text-sm font-medium text-foreground">
          {score >= 80 ? "High Trust" : score >= 50 ? "Needs Review" : "Low Trust"}
        </span>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  const [selectedCase, setSelectedCase] = useState<string>("verified")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const result = mockResults[selectedCase]

  const handleAnalyze = (caseId: string) => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setSelectedCase(caseId)
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              AI Verification System
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              See how our AI analyzes and verifies patient documents in real-time.
            </p>
          </div>

          {/* Case Selector */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {Object.entries(mockResults).map(([key, val]) => (
              <Button
                key={key}
                variant={selectedCase === key ? "default" : "outline"}
                onClick={() => handleAnalyze(key)}
                className="gap-2"
              >
                {key === "verified" && <CheckCircle2 className="h-4 w-4" />}
                {key === "under-review" && <Clock className="h-4 w-4" />}
                {key === "rejected" && <XCircle className="h-4 w-4" />}
                {key === "verified"
                  ? "Verified Case"
                  : key === "under-review"
                  ? "Under Review Case"
                  : "Rejected Case"}
              </Button>
            ))}
          </div>

          {isAnalyzing ? (
            <Card className="mx-auto max-w-md border-border">
              <CardContent className="flex flex-col items-center gap-4 py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-foreground">
                  Analyzing documents...
                </p>
                <p className="text-sm text-muted-foreground">
                  Running AI verification checks
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* OCR Panel */}
              <Card className="border-border lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ScanSearch className="h-5 w-5 text-primary" />
                    OCR Text Extraction
                  </CardTitle>
                  <CardDescription>
                    Extracted text from uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">
                      {result.ocrText}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Fraud Score & Checks */}
              <Card className="border-border lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Analysis Results
                    </CardTitle>
                    <StatusBadge status={result.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="score">
                    <TabsList className="mb-6 w-full">
                      <TabsTrigger value="score" className="flex-1">
                        Trust Score
                      </TabsTrigger>
                      <TabsTrigger value="checks" className="flex-1">
                        Verification Checks
                      </TabsTrigger>
                      <TabsTrigger value="logic" className="flex-1">
                        AI Logic
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="score" className="flex flex-col items-center gap-6">
                      <FraudScoreGauge score={result.fraudScore} />
                      <div className="w-full max-w-md">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fraud Detection Score</span>
                          <span className="font-medium text-foreground">{result.fraudScore}/100</span>
                        </div>
                        <Progress value={result.fraudScore} className="mt-2 h-2" />
                      </div>
                    </TabsContent>

                    <TabsContent value="checks" className="flex flex-col gap-3">
                      {result.checks.map((check, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border border-border p-4"
                        >
                          {check.passed ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                          ) : (
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {check.label}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {check.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="logic" className="flex flex-col gap-4">
                      <Card className="border-border bg-muted/30">
                        <CardContent className="flex gap-4 p-4">
                          <Copy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Duplicate Document Detection
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Uses perceptual hashing and text similarity to compare
                              submitted documents against our database of 12,400+
                              verified records. Flags documents with more than 75%
                              similarity.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border bg-muted/30">
                        <CardContent className="flex gap-4 p-4">
                          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Hospital Name Validation
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Cross-references hospital names with NABH (National
                              Accreditation Board for Hospitals) and state health
                              department registries. Fuzzy matching handles typos.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border bg-muted/30">
                        <CardContent className="flex gap-4 p-4">
                          <IndianRupee className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Cost Anomaly Detection
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Compares requested amounts against historical treatment
                              cost data for the specific diagnosis and hospital tier.
                              Flags amounts outside 2 standard deviations from the
                              mean.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

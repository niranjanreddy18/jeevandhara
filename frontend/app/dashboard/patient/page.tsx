"use client"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ShieldCheck,
  Download,
  IndianRupee,
  Users,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { patients, formatCurrencyFull } from "@/lib/data"

export default function PatientDashboardPage() {
  // Demo: show the first patient
  const patient = patients[0]
  const progressPercent = Math.round(
    (patient.raisedAmount / patient.requiredAmount) * 100
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Patient Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back, {patient.name}
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>

          {/* Status Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Status</p>
                  <Badge className="mt-1 gap-1 bg-success/10 text-success hover:bg-success/20">
                    <CheckCircle2 className="h-3 w-3" />
                    {patient.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Trust Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {patient.aiTrustScore}
                    <span className="text-sm font-normal text-muted-foreground">
                      /100
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Raised</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrencyFull(patient.raisedAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Donors</p>
                  <p className="text-2xl font-bold text-foreground">
                    {patient.donors.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Fundraising Progress */}
            <Card className="border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Fundraising Progress
                </CardTitle>
                <CardDescription>
                  {patient.disease} at {patient.hospitalName}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrencyFull(patient.raisedAmount)} raised of{" "}
                      {formatCurrencyFull(patient.requiredAmount)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {progressPercent}%
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Required</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrencyFull(patient.requiredAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Raised</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrencyFull(patient.raisedAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrencyFull(
                        patient.requiredAmount - patient.raisedAmount
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Details */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Case ID</span>
                  <span className="text-sm font-medium text-foreground">{patient.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Hospital</span>
                  <span className="text-sm font-medium text-foreground">{patient.hospitalName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Condition</span>
                  <span className="text-sm font-medium text-foreground">{patient.disease}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Submitted</span>
                  <span className="text-sm font-medium text-foreground">{patient.submittedAt}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Documents</span>
                  <div className="flex flex-col gap-1">
                    {patient.documents.map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center gap-2 text-sm text-primary"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation History */}
          <Card className="mt-6 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Donation History
              </CardTitle>
              <CardDescription>
                All donations received for this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">
                        {donor.anonymous ? "Anonymous Donor" : donor.name}
                      </TableCell>
                      <TableCell>{formatCurrencyFull(donor.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{donor.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-success/10 text-success"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {patient.donors.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No donations received yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

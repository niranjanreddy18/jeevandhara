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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Clock,
  Users,
  IndianRupee,
  FileText,
  Mail,
  TrendingUp,
  AlertTriangle,
  Eye,
  Brain,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { patients, stats, formatCurrencyFull, formatCurrency } from "@/lib/data"
import { toast } from "sonner"

const monthlyData = [
  { month: "Sep", amount: 1200000 },
  { month: "Oct", amount: 1800000 },
  { month: "Nov", amount: 2400000 },
  { month: "Dec", amount: 3100000 },
  { month: "Jan", amount: 4200000 },
  { month: "Feb", amount: 3800000 },
]

const statusDistribution = [
  { name: "Verified", value: 124, color: "oklch(0.72 0.14 155)" },
  { name: "Under Review", value: 12, color: "oklch(0.80 0.15 75)" },
  { name: "Pending", value: 8, color: "oklch(0.55 0.18 245)" },
  { name: "Rejected", value: 6, color: "oklch(0.577 0.245 27.325)" },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "verified") {
    return (
      <Badge className="gap-1 bg-success/10 text-success hover:bg-success/20">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    )
  }
  if (status === "under-review") {
    return (
      <Badge className="gap-1 bg-warning/10 text-warning-foreground hover:bg-warning/20">
        <Clock className="h-3 w-3" />
        Under Review
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20">
      <XCircle className="h-3 w-3" />
      Rejected
    </Badge>
  )
}

export default function AdminPage() {
  const [patientList, setPatientList] = useState(patients)

  const handleApprove = (id: string) => {
    setPatientList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "verified" as const } : p))
    )
    toast.success("Application approved successfully")
  }

  const handleReject = (id: string) => {
    setPatientList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p))
    )
    toast.error("Application rejected")
  }

  const handleSendEmails = () => {
    toast.success("University email notifications sent to 24 institutions")
  }

  const pendingReview = patientList.filter(
    (p) => p.status === "pending" || p.status === "under-review"
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
                Admin Panel
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage applications, review AI scores, and monitor platform analytics.
              </p>
            </div>
            <Button onClick={handleSendEmails} className="gap-2">
              <Mail className="h-4 w-4" />
              Send University Notifications
            </Button>
          </div>

          {/* Analytics Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Funds</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.totalFundsRaised)}
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
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalPatientsSupported}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-foreground">
                    {pendingReview.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                  <ShieldCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.verifiedCases}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applications">
            <TabsList className="mb-6">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    All Applications
                  </CardTitle>
                  <CardDescription>
                    Review, approve, or reject patient applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Disease</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>AI Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientList.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-mono text-xs">
                            {patient.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {patient.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {patient.hospitalName}
                          </TableCell>
                          <TableCell className="text-sm">
                            {patient.disease}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatCurrencyFull(patient.requiredAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Brain className="h-3.5 w-3.5 text-primary" />
                              <span
                                className={`text-sm font-medium ${
                                  patient.aiTrustScore >= 80
                                    ? "text-success"
                                    : patient.aiTrustScore >= 50
                                    ? "text-warning-foreground"
                                    : patient.aiTrustScore > 0
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {patient.aiTrustScore > 0
                                  ? patient.aiTrustScore
                                  : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={patient.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      {patient.name} - {patient.id}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Full application details
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-muted-foreground">Hospital</p>
                                        <p className="font-medium text-foreground">{patient.hospitalName}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Location</p>
                                        <p className="font-medium text-foreground">{patient.location}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Disease</p>
                                        <p className="font-medium text-foreground">{patient.disease}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Required</p>
                                        <p className="font-medium text-foreground">
                                          {formatCurrencyFull(patient.requiredAmount)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium text-foreground">{patient.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Government ID</p>
                                        <p className="font-medium text-foreground">{patient.governmentId}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Documents</p>
                                      <div className="mt-1 flex flex-col gap-1">
                                        {patient.documents.map((doc) => (
                                          <span key={doc} className="flex items-center gap-1.5 text-sm text-primary">
                                            <FileText className="h-3.5 w-3.5" />
                                            {doc}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Close</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              {(patient.status === "pending" || patient.status === "under-review") && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-success hover:text-success"
                                    onClick={() => handleApprove(patient.id)}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-destructive hover:text-destructive"
                                    onClick={() => handleReject(patient.id)}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Monthly Donations
                    </CardTitle>
                    <CardDescription>Donation trends over recent months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 240)" />
                          <XAxis dataKey="month" stroke="oklch(0.50 0.02 250)" fontSize={12} />
                          <YAxis
                            stroke="oklch(0.50 0.02 250)"
                            fontSize={12}
                            tickFormatter={(v) => formatCurrency(v)}
                          />
                          <Tooltip
                            formatter={(value: number) => [formatCurrencyFull(value), "Donations"]}
                            contentStyle={{
                              backgroundColor: "oklch(1 0 0)",
                              border: "1px solid oklch(0.91 0.01 240)",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Bar
                            dataKey="amount"
                            fill="oklch(0.55 0.18 245)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Case Status Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of all application statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {statusDistribution.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [value, name]}
                            contentStyle={{
                              backgroundColor: "oklch(1 0 0)",
                              border: "1px solid oklch(0.91 0.01 240)",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                      {statusDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.name} ({item.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Globe,
  Search,
  MapPin,
  IndianRupee,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react"
import {
  patients,
  donationFeed,
  stats,
  formatCurrencyFull,
  formatCurrency,
} from "@/lib/data"

export default function PublicDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [diseaseFilter, setDiseaseFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const verifiedPatients = patients.filter((p) => p.status === "verified")

  const filteredPatients = verifiedPatients.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDisease =
      diseaseFilter === "all" ||
      p.disease.toLowerCase().includes(diseaseFilter.toLowerCase())

    const matchesLocation =
      locationFilter === "all" ||
      p.location.toLowerCase() === locationFilter.toLowerCase()

    return matchesSearch && matchesDisease && matchesLocation
  })

  const diseases = [...new Set(verifiedPatients.map((p) => p.disease))]
  const locations = [...new Set(verifiedPatients.map((p) => p.location))]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Public Transparency Dashboard
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Full visibility into every verified case and donation. Trust through transparency.
            </p>
          </div>

          {/* Stats Row */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <IndianRupee className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Raised</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(stats.totalFundsRaised)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <HeartPulse className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Patients Supported</p>
                  <p className="text-xl font-bold text-foreground">{stats.totalPatientsSupported}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Cases</p>
                  <p className="text-xl font-bold text-foreground">{stats.activeCases}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-xl font-bold text-foreground">{stats.verifiedCases}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cases List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <Card className="mb-6 border-border">
                <CardContent className="flex flex-col gap-3 p-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, disease, or hospital..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by disease" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Diseases</SelectItem>
                      {diseases.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Verified Cases */}
              <div className="flex flex-col gap-4">
                {filteredPatients.map((patient) => {
                  const percent = Math.round(
                    (patient.raisedAmount / patient.requiredAmount) * 100
                  )
                  return (
                    <Card key={patient.id} className="border-border transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {patient.disease}
                            </p>
                          </div>
                          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/20">
                            <ShieldCheck className="h-3 w-3" />
                            Score: {patient.aiTrustScore}
                          </Badge>
                        </div>

                        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {patient.location}
                          </span>
                          <span>{patient.hospitalName}</span>
                        </div>

                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatCurrencyFull(patient.raisedAmount)} of{" "}
                            {formatCurrencyFull(patient.requiredAmount)}
                          </span>
                          <span className="font-medium text-foreground">
                            {percent}%
                          </span>
                        </div>
                        <Progress value={percent} className="h-2" />

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {patient.donors.length} donors
                          </span>
                          <Link href="/payment">
                            <Button size="sm" variant="outline" className="gap-1">
                              Donate
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredPatients.length === 0 && (
                  <Card className="border-border">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No cases match your search criteria.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Side: Live Feed + Ledger */}
            <div className="flex flex-col gap-6">
              {/* Live Donation Feed */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Live Donation Feed
                  </CardTitle>
                  <CardDescription>Real-time donations as they happen</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {donationFeed.slice(0, 6).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.donorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          to {entry.patientName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-success">
                          +{formatCurrencyFull(entry.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Transaction Ledger */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-primary" />
                    Transaction Ledger
                  </CardTitle>
                  <CardDescription>Transparent record of all transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">From</TableHead>
                        <TableHead className="text-xs">To</TableHead>
                        <TableHead className="text-right text-xs">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donationFeed.slice(0, 5).map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="py-2 text-xs">
                            {entry.donorName}
                          </TableCell>
                          <TableCell className="py-2 text-xs">
                            {entry.patientName}
                          </TableCell>
                          <TableCell className="py-2 text-right text-xs font-medium">
                            {formatCurrencyFull(entry.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

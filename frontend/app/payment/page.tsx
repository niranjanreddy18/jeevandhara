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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Lock,
  IndianRupee,
  HeartPulse,
  Mail,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react"
import { patients, formatCurrencyFull } from "@/lib/data"
import { toast } from "sonner"

export default function PaymentPage() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id)
  const [amount, setAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const patient = patients.find((p) => p.id === selectedPatient) || patients[0]

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !donorName) {
      toast.error("Please fill in your name and amount")
      return
    }
    setShowSuccess(true)
    toast.success("Payment processed successfully (Demo)")
  }

  const presetAmounts = [500, 1000, 5000, 10000, 25000, 50000]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8 lg:py-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Make a Donation
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Every contribution makes a difference. Choose a patient and donate securely.
            </p>
          </div>

          {!showSuccess ? (
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Payment Form */}
              <div className="lg:col-span-3">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Details
                    </CardTitle>
                    <CardDescription>
                      All transactions are secure and encrypted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePayment} className="flex flex-col gap-6">
                      {/* Select Patient */}
                      <div className="flex flex-col gap-2">
                        <Label>Donate to Patient</Label>
                        <Select
                          value={selectedPatient}
                          onValueChange={setSelectedPatient}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {patients
                              .filter((p) => p.status === "verified")
                              .map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} - {p.disease}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Donor Info */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="donorName">Your Name</Label>
                          <Input
                            id="donorName"
                            placeholder="Enter your name"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="donorEmail">Your Email</Label>
                          <Input
                            id="donorEmail"
                            type="email"
                            placeholder="your@email.com"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col gap-3">
                        <Label>Donation Amount (INR)</Label>
                        <div className="flex flex-wrap gap-2">
                          {presetAmounts.map((preset) => (
                            <Button
                              key={preset}
                              type="button"
                              variant={
                                amount === preset.toString()
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setAmount(preset.toString())}
                            >
                              {formatCurrencyFull(preset)}
                            </Button>
                          ))}
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Or enter custom amount"
                            className="pl-9"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Payment Methods */}
                      <Tabs defaultValue="upi">
                        <TabsList className="w-full">
                          <TabsTrigger value="upi" className="flex-1">
                            UPI / QR
                          </TabsTrigger>
                          <TabsTrigger value="card" className="flex-1">
                            Card / Razorpay
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upi" className="flex flex-col items-center gap-4 pt-4">
                          {/* QR Placeholder */}
                          <div className="flex h-48 w-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
                            <QrCode className="mb-2 h-16 w-16 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              UPI QR Code
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              jeevandhara@upi
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText("jeevandhara@upi")
                                toast.success("UPI ID copied")
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-center text-xs text-muted-foreground">
                            Scan the QR code or use the UPI ID to pay directly
                          </p>
                        </TabsContent>

                        <TabsContent value="card" className="flex flex-col gap-4 pt-4">
                          <div className="grid gap-4">
                            <div className="flex flex-col gap-2">
                              <Label>Card Number</Label>
                              <Input placeholder="4242 4242 4242 4242" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-2">
                                <Label>Expiry</Label>
                                <Input placeholder="MM/YY" />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label>CVV</Label>
                                <Input placeholder="123" type="password" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Powered by Razorpay (Demo Mode)
                            </span>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <Button type="submit" size="lg" className="w-full gap-2">
                        <Lock className="h-4 w-4" />
                        Donate{" "}
                        {amount ? formatCurrencyFull(parseInt(amount)) : "Now"}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        256-bit SSL encrypted. Your data is safe.
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Patient Summary Sidebar */}
              <div className="lg:col-span-2">
                <Card className="sticky top-24 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <HeartPulse className="h-5 w-5 text-primary" />
                      Patient Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Patient</span>
                      <span className="text-sm font-semibold text-foreground">
                        {patient.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Condition</span>
                      <span className="text-sm text-foreground">
                        {patient.disease}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Hospital</span>
                      <span className="text-sm text-foreground">
                        {patient.hospitalName}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Required</span>
                      <span className="font-medium text-foreground">
                        {formatCurrencyFull(patient.requiredAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="font-medium text-success">
                        {formatCurrencyFull(patient.raisedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrencyFull(
                          patient.requiredAmount - patient.raisedAmount
                        )}
                      </span>
                    </div>
                    <Badge className="mt-2 w-fit gap-1 bg-success/10 text-success hover:bg-success/20">
                      <ShieldCheck className="h-3 w-3" />
                      AI Trust Score: {patient.aiTrustScore}/100
                    </Badge>

                    <Button
                      variant="outline"
                      className="mt-2 gap-2"
                      onClick={() => setShowEmail(!showEmail)}
                    >
                      <Mail className="h-4 w-4" />
                      Preview Email Template
                    </Button>
                  </CardContent>
                </Card>

                {/* Email Preview */}
                {showEmail && (
                  <Card className="mt-4 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-5 w-5 text-primary" />
                        Email Template Preview
                      </CardTitle>
                      <CardDescription>
                        Automated email sent to university partners
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="mb-4 flex flex-col gap-1 text-sm">
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground">
                              Subject:
                            </span>
                            <span className="text-foreground">
                              Urgent Medical Support Needed - {patient.name}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground">
                              From:
                            </span>
                            <span className="text-foreground">
                              notifications@jeevandhara.org
                            </span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex flex-col gap-3 text-sm text-foreground">
                          <p>Dear University Partner,</p>
                          <p>
                            A verified patient case requires immediate financial
                            support. Below are the details:
                          </p>
                          <div className="rounded-lg bg-background p-3">
                            <div className="flex flex-col gap-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Patient:</span>
                                <span className="font-medium">{patient.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Hospital:</span>
                                <span className="font-medium">{patient.hospitalName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Condition:</span>
                                <span className="font-medium">{patient.disease}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Required:</span>
                                <span className="font-semibold text-foreground">
                                  {formatCurrencyFull(patient.requiredAmount)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">AI Trust Score:</span>
                                <span className="font-medium text-success">
                                  {patient.aiTrustScore}/100
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                            <QrCode className="h-12 w-12 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Payment QR Code
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Secure Donation Link: jeevandhara.org/donate/{patient.id}
                          </p>
                          <p>Thank you for your support.</p>
                          <p className="text-muted-foreground">
                            - JeevanDhara Team
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            /* Success State */
            <Card className="mx-auto max-w-lg border-border">
              <CardContent className="flex flex-col items-center gap-6 py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    Thank You!
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Your donation of{" "}
                    <span className="font-semibold text-foreground">
                      {formatCurrencyFull(parseInt(amount || "0"))}
                    </span>{" "}
                    to <span className="font-semibold text-foreground">{patient.name}</span> has been
                    processed successfully.
                  </p>
                </div>
                <div className="w-full rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-foreground">TXN-2026-0000847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donor</span>
                      <span className="text-foreground">{donorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient</span>
                      <span className="text-foreground">{patient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-success">
                        {formatCurrencyFull(parseInt(amount || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="bg-success/10 text-success">Completed</Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccess(false)
                    setAmount("")
                    setDonorName("")
                    setDonorEmail("")
                  }}
                >
                  Make Another Donation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export interface Patient {
  id: string
  name: string
  contactNumber: string
  email: string
  hospitalName: string
  disease: string
  requiredAmount: number
  raisedAmount: number
  status: "pending" | "verified" | "under-review" | "rejected"
  aiTrustScore: number
  location: string
  submittedAt: string
  documents: string[]
  governmentId: string
  donors: Donor[]
}

export interface Donor {
  id: string
  name: string
  amount: number
  date: string
  anonymous: boolean
}

export interface DonationFeed {
  id: string
  donorName: string
  patientName: string
  amount: number
  timestamp: string
}

// Simulated data
export const patients: Patient[] = [
  {
    id: "PT-001",
    name: "Aarav Sharma",
    contactNumber: "+91-9876543210",
    email: "aarav.sharma@email.com",
    hospitalName: "AIIMS New Delhi",
    disease: "Kidney Transplant",
    requiredAmount: 850000,
    raisedAmount: 623000,
    status: "verified",
    aiTrustScore: 94,
    location: "New Delhi",
    submittedAt: "2026-01-15",
    documents: ["medical-report.pdf", "hospital-bill.pdf"],
    governmentId: "XXXX-XXXX-4521",
    donors: [
      { id: "D-001", name: "Priya Mehta", amount: 50000, date: "2026-02-10", anonymous: false },
      { id: "D-002", name: "Anonymous", amount: 100000, date: "2026-02-08", anonymous: true },
      { id: "D-003", name: "Rahul Verma", amount: 25000, date: "2026-02-05", anonymous: false },
      { id: "D-004", name: "Sunita Gupta", amount: 75000, date: "2026-01-28", anonymous: false },
      { id: "D-005", name: "Anonymous", amount: 200000, date: "2026-01-20", anonymous: true },
    ],
  },
  {
    id: "PT-002",
    name: "Meera Patel",
    contactNumber: "+91-9123456789",
    email: "meera.patel@email.com",
    hospitalName: "Tata Memorial Hospital",
    disease: "Breast Cancer Treatment",
    requiredAmount: 1200000,
    raisedAmount: 456000,
    status: "verified",
    aiTrustScore: 91,
    location: "Mumbai",
    submittedAt: "2026-01-22",
    documents: ["biopsy-report.pdf", "treatment-plan.pdf"],
    governmentId: "XXXX-XXXX-7892",
    donors: [
      { id: "D-006", name: "Vikram Singh", amount: 100000, date: "2026-02-12", anonymous: false },
      { id: "D-007", name: "Anonymous", amount: 150000, date: "2026-02-01", anonymous: true },
    ],
  },
  {
    id: "PT-003",
    name: "Rohan Desai",
    contactNumber: "+91-9988776655",
    email: "rohan.desai@email.com",
    hospitalName: "CMC Vellore",
    disease: "Heart Valve Replacement",
    requiredAmount: 600000,
    raisedAmount: 590000,
    status: "verified",
    aiTrustScore: 97,
    location: "Vellore",
    submittedAt: "2025-12-10",
    documents: ["ecg-report.pdf", "surgery-estimate.pdf"],
    governmentId: "XXXX-XXXX-3345",
    donors: [
      { id: "D-008", name: "Anita Nair", amount: 200000, date: "2026-01-15", anonymous: false },
      { id: "D-009", name: "University of Delhi Fund", amount: 250000, date: "2026-01-10", anonymous: false },
    ],
  },
  {
    id: "PT-004",
    name: "Sanya Iyer",
    contactNumber: "+91-9001234567",
    email: "sanya.iyer@email.com",
    hospitalName: "Apollo Hospital Chennai",
    disease: "Liver Transplant",
    requiredAmount: 2000000,
    raisedAmount: 340000,
    status: "under-review",
    aiTrustScore: 72,
    location: "Chennai",
    submittedAt: "2026-02-18",
    documents: ["liver-scan.pdf", "doctor-prescription.pdf"],
    governmentId: "XXXX-XXXX-9012",
    donors: [
      { id: "D-010", name: "Karthik Rajan", amount: 50000, date: "2026-02-25", anonymous: false },
    ],
  },
  {
    id: "PT-005",
    name: "Arjun Reddy",
    contactNumber: "+91-9876501234",
    email: "arjun.reddy@email.com",
    hospitalName: "NIMS Hyderabad",
    disease: "Bone Marrow Transplant",
    requiredAmount: 1500000,
    raisedAmount: 120000,
    status: "pending",
    aiTrustScore: 0,
    location: "Hyderabad",
    submittedAt: "2026-02-25",
    documents: ["blood-test.pdf"],
    governmentId: "XXXX-XXXX-5567",
    donors: [],
  },
  {
    id: "PT-006",
    name: "Fatima Begum",
    contactNumber: "+91-9312345678",
    email: "fatima.begum@email.com",
    hospitalName: "Fortis Hospital Bangalore",
    disease: "Spinal Surgery",
    requiredAmount: 750000,
    raisedAmount: 0,
    status: "rejected",
    aiTrustScore: 23,
    location: "Bangalore",
    submittedAt: "2026-02-20",
    documents: ["mri-report.pdf"],
    governmentId: "XXXX-XXXX-1189",
    donors: [],
  },
]

export const donationFeed: DonationFeed[] = [
  { id: "DF-1", donorName: "Priya M.", patientName: "Aarav Sharma", amount: 50000, timestamp: "2 minutes ago" },
  { id: "DF-2", donorName: "Anonymous", patientName: "Meera Patel", amount: 15000, timestamp: "8 minutes ago" },
  { id: "DF-3", donorName: "Vikram S.", patientName: "Meera Patel", amount: 100000, timestamp: "15 minutes ago" },
  { id: "DF-4", donorName: "Karthik R.", patientName: "Sanya Iyer", amount: 50000, timestamp: "32 minutes ago" },
  { id: "DF-5", donorName: "Anonymous", patientName: "Aarav Sharma", amount: 25000, timestamp: "1 hour ago" },
  { id: "DF-6", donorName: "Anita N.", patientName: "Rohan Desai", amount: 200000, timestamp: "2 hours ago" },
  { id: "DF-7", donorName: "University Fund", patientName: "Rohan Desai", amount: 250000, timestamp: "3 hours ago" },
  { id: "DF-8", donorName: "Sunita G.", patientName: "Aarav Sharma", amount: 75000, timestamp: "5 hours ago" },
]

export const stats = {
  totalFundsRaised: 21290000,
  totalPatientsSupported: 142,
  activeCases: 38,
  verifiedCases: 124,
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Cr`
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toLocaleString("en-IN")
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

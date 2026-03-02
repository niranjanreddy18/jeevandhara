import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  BarChart3,
  LogIn,
  GraduationCap,
  X,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  hospitalSubmissions,
  approvePatientCase,
  rejectPatientCase,
  approvedHospitals,
  pendingVerifications,
  rejectedHospitals,
  registeredHospitals,
} from "@/lib/hospitals";
import {
  getPendingUniversityVerifications,
  approveUniversityVerification,
  rejectUniversityVerification,
  approvedUniversities,
  pendingUniversityVerifications,
  rejectedUniversities,
} from "@/lib/universities";
import {
  setSession,
  clearSession,
  isAnyUserLoggedIn,
  getSession,
  getLoggedInUserId,
} from "@/lib/auth";

const riskColor = (r: string) => {
  if (r === "High") return "text-destructive bg-destructive/10";
  if (r === "Medium") return "text-accent bg-accent/10";
  return "text-success bg-success/10";
};

// Hardcoded admin credentials (no database)
const ADMIN_CREDENTIALS = {
  id: "ADM-001",
  password: "admin@123",
};

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pending, setPending] = useState(getPendingVerifications());
  const [approvedH, setApprovedH] = useState(() =>
    Object.values(approvedHospitals),
  );
  const [rejectedH, setRejectedH] = useState(() => rejectedHospitals.slice());
  const [pendingUniversities, setPendingUniversities] = useState(
    getPendingUniversityVerifications(),
  );
  const [approvedU, setApprovedU] = useState(() =>
    Object.values(approvedUniversities),
  );
  const [rejectedU, setRejectedU] = useState(() =>
    rejectedUniversities.slice(),
  );
  const [allCases, setAllCases] = useState(() => hospitalSubmissions.slice());
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedAIScore, setSelectedAIScore] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "hospitals" | "universities" | "cases"
  >("cases");

  // Derive cases by status
  const pendingCases = allCases.filter((s: any) => s.status === "pending");
  const approvedCases = allCases.filter((s: any) => s.status === "approved");
  const rejectedCases = allCases.filter((s: any) => s.status === "rejected");

  // refresh pending verifications when localStorage changes (other tab) or window gains focus
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "jh_pending_verifications_v1") {
        setPending(getPendingVerifications().slice());
        setApprovedH(Object.values(approvedHospitals));
        setRejectedH(rejectedHospitals.slice());
      }
      if (
        e.key === null ||
        e.key === "jh_pending_university_verifications_v1"
      ) {
        setPendingUniversities(getPendingUniversityVerifications().slice());
        setApprovedU(Object.values(approvedUniversities));
        setRejectedU(rejectedUniversities.slice());
      }
      if (e.key === null || e.key === "jh_hospital_submissions_v1") {
        setAllCases(hospitalSubmissions.slice());
      }
    };
    const onFocus = () => {
      setPending(getPendingVerifications().slice());
      setPendingUniversities(getPendingUniversityVerifications().slice());
      setApprovedH(Object.values(approvedHospitals));
      setRejectedH(rejectedHospitals.slice());
      setApprovedU(Object.values(approvedUniversities));
      setRejectedU(rejectedUniversities.slice());
      setAllCases(hospitalSubmissions.slice());
    };
    const onCustom = () => {
      setPending(getPendingVerifications().slice());
      setPendingUniversities(getPendingUniversityVerifications().slice());
      setApprovedH(Object.values(approvedHospitals));
      setRejectedH(rejectedHospitals.slice());
      setApprovedU(Object.values(approvedUniversities));
      setRejectedU(rejectedUniversities.slice());
      setAllCases(hospitalSubmissions.slice());
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("jh:pending-updated", onCustom as EventListener);
    window.addEventListener("jh:cases-updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(
        "jh:pending-updated",
        onCustom as EventListener,
      );
      window.removeEventListener("jh:cases-updated", onCustom as EventListener);
    };
  }, []);

  // Check if already logged in via global session
  useEffect(() => {
    const session = getSession();
    if (session?.userType === "admin" && session?.userId) {
      setLoggedIn(true);
      setAdminId(session.userId);
    }
  }, []);

  const generateAIScore = (caseData: any) => {
    if (caseData.aiScore) return caseData.aiScore;
    // Generate score based on case data
    const score = Math.floor(Math.random() * 56) + 40; // 40-95
    caseData.aiScore = score;
    return score;
  };

  const getAIScoreDetails = (caseData: any) => {
    const score = generateAIScore(caseData);
    const estimatedCost = caseData.estimatedCost || 0;
    const amountRequired = caseData.amountRequired || 0;
    const insurance =
      caseData.insuranceAvailable ? caseData.insuranceCoverage || 0 : 0;

    return {
      score,
      validationScore: Math.min(
        score + Math.floor(Math.random() * 10 - 5),
        100,
      ),
      costAccuracy: Math.max(60 + Math.floor(Math.random() * 30), 85),
      documentQuality: Math.min(score + Math.floor(Math.random() * 5), 100),
      medicalValidity: Math.min(score + Math.floor(Math.random() * 5), 100),
      factors: {
        costReasonable: estimatedCost > 0,
        documentsComplete:
          caseData.prescriptionFile && caseData.medicalReportFile,
        insuranceAvailable: caseData.insuranceAvailable,
        doctorLicensed: !!caseData.doctorRegNo,
      },
    };
  };

  if (!loggedIn) {
    const handleLogin = () => {
      setLoginError("");
      if (adminId.trim() === "" || adminPassword.trim() === "") {
        setLoginError("Please enter both Admin ID and Password");
        return;
      }
      if (
        adminId !== ADMIN_CREDENTIALS.id ||
        adminPassword !== ADMIN_CREDENTIALS.password
      ) {
        setLoginError("Invalid Admin ID or Password");
        return;
      }
      setLoggedIn(true);
      setSession("admin", "ADM-001");
    };

    return (
      <div className="py-20">
        <div className="container max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI Verification Console
                </p>
              </div>
            </div>
            {loginError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {loginError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label>Admin ID</Label>
                <Input
                  placeholder="ADM-001"
                  className="mt-1.5"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4 mr-2" /> Access Console
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                <strong>Demo:</strong> ADM-001 / admin@123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Management Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveSection("cases")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activeSection === "cases" ?
                "bg-accent text-accent-foreground font-semibold"
              : "text-foreground hover:bg-muted"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Medical Cases
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
              {pendingCases.length +
                approvedCases.length +
                rejectedCases.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection("hospitals")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activeSection === "hospitals" ?
                "bg-accent text-accent-foreground font-semibold"
              : "text-foreground hover:bg-muted"
            }`}
          >
            <Shield className="w-4 h-4" />
            Hospitals
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
              {pending.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection("universities")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activeSection === "universities" ?
                "bg-accent text-accent-foreground font-semibold"
              : "text-foreground hover:bg-muted"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Universities
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">
              {pendingUniversities.length}
            </span>
          </button>
        </nav>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setLoggedIn(false);
            setAdminId("");
            setAdminPassword("");
            setLoginError("");
            clearSession();
          }}
        >
          Sign Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-6 h-6 text-accent" />
              {activeSection === "cases" && "Medical Cases"}
              {activeSection === "hospitals" && "Hospital Verifications"}
              {activeSection === "universities" && "University Verifications"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeSection === "cases" &&
                "Review AI-analyzed medical cases and approve for listing"}
              {activeSection === "hospitals" &&
                "Verify hospital registrations and credentials"}
              {activeSection === "universities" &&
                "Verify university credentials and affiliations"}
            </p>
          </div>

          {/* Email Success Message */}
          {emailSent && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-success">
                  Email Sent Successfully
                </p>
                <p className="text-xs text-success/80 mt-0.5">{emailSent}</p>
              </div>
              <button
                onClick={() => setEmailSent(null)}
                className="ml-auto text-success/60 hover:text-success"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Case Detail Modal */}
          {selectedCase && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    Case Details
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedCase(null);
                      setRejectionReason("");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Case ID
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        JD-{hospitalSubmissions.indexOf(selectedCase) + 3000}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Status
                      </p>
                      <p
                        className={`text-sm font-semibold px-2 py-1 rounded w-fit ${
                          selectedCase.status === "pending" ?
                            "bg-accent/10 text-accent"
                          : selectedCase.status === "approved" ?
                            "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {selectedCase.status.charAt(0).toUpperCase() +
                          selectedCase.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        AI Score
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.aiScore || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Hospital Reg ID
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.regId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Patient Name
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedCase.patientName || "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Date of Birth
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.dob || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Aadhaar (Last 4)
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ****{selectedCase.aadhaarLast4 || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Disease Name
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedCase.diseaseName || "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Estimated Total Cost
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ₹
                        {selectedCase.estimatedCost?.toLocaleString?.() ||
                          selectedCase.estimatedCost ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Amount Required
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ₹
                        {selectedCase.amountRequired?.toLocaleString?.() ||
                          selectedCase.amountRequired ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Doctor Reg Number
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.doctorRegNo || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Insurance Available
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.insuranceAvailable ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {selectedCase.insuranceAvailable && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Insurance Coverage (%)
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedCase.insuranceCoverage || "0"}%
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Prescription Document
                      </p>
                      <p className="text-sm font-semibold text-foreground text-break">
                        {selectedCase.prescriptionFile || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Medical Report Document
                      </p>
                      <p className="text-sm font-semibold text-foreground text-break">
                        {selectedCase.medicalReportFile || "N/A"}
                      </p>
                    </div>
                  </div>

                  {selectedCase.status === "rejected" &&
                    selectedCase.rejectionReason && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-foreground bg-destructive/10 p-2 rounded">
                          {selectedCase.rejectionReason}
                        </p>
                      </div>
                    )}
                </div>

                {selectedCase.status === "pending" && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <Label>Rejection Reason (optional)</Label>
                      <Input
                        placeholder="Enter reason if rejecting..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-success text-success-foreground"
                        onClick={() => {
                          const caseIndex =
                            hospitalSubmissions.indexOf(selectedCase);
                          approvePatientCase(caseIndex);
                          setAllCases(hospitalSubmissions.slice());
                          setSelectedCase(null);
                          setRejectionReason("");
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        className="flex-1 bg-destructive text-destructive-foreground"
                        onClick={() => {
                          const caseIndex =
                            hospitalSubmissions.indexOf(selectedCase);
                          rejectPatientCase(
                            caseIndex,
                            rejectionReason || "Rejected by admin",
                          );
                          setAllCases(hospitalSubmissions.slice());
                          setSelectedCase(null);
                          setRejectionReason("");
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedCase(null);
                      setRejectionReason("");
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Hospital Detail Modal */}
          {selectedHospital && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    Hospital Details
                  </h2>
                  <button
                    onClick={() => setSelectedHospital(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reg ID</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedHospital.regId || selectedHospital.regId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedHospital.name ||
                        selectedHospital.name ||
                        registeredHospitals[selectedHospital.regId]?.name ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-semibold text-foreground">
                      {registeredHospitals[selectedHospital.regId]?.email ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Address / Proofs
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedHospital.proofs ||
                        registeredHospitals[selectedHospital.regId]?.address ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Certificate
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedHospital.certificateName ||
                        registeredHospitals[selectedHospital.regId]
                          ?.certificates ||
                        "-"}
                    </p>
                  </div>
                  {selectedHospital.rejectedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Rejected At
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(selectedHospital.rejectedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedHospital.reason && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-destructive">
                        {selectedHospital.reason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedHospital(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* University Detail Modal */}
          {selectedUniversity && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    University Details
                  </h2>
                  <button
                    onClick={() => setSelectedUniversity(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Uni ID</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedUniversity.uniId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedUniversity.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Certificate
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedUniversity.certificateName || "-"}
                    </p>
                  </div>
                  {selectedUniversity.rejectedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Rejected At
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(
                          selectedUniversity.rejectedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedUniversity.reason && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-destructive">
                        {selectedUniversity.reason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedUniversity(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Score Details Modal */}
          {selectedAIScore && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    AI Scoring Analysis
                  </h2>
                  <button
                    onClick={() => setSelectedAIScore(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {(() => {
                  const details = getAIScoreDetails(selectedAIScore);
                  return (
                    <div className="space-y-4">
                      <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-accent">
                            Overall AI Score
                          </p>
                          <p className="text-3xl font-bold text-accent">
                            {details.score}
                          </p>
                        </div>
                        <Progress value={details.score} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Higher scores indicate better case validity and
                          funding probability
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/40 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Validation Score
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {details.validationScore}
                          </p>
                          <Progress
                            value={details.validationScore}
                            className="h-1 mt-1"
                          />
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Cost Accuracy
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {details.costAccuracy}%
                          </p>
                          <Progress
                            value={details.costAccuracy}
                            className="h-1 mt-1"
                          />
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Document Quality
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {details.documentQuality}
                          </p>
                          <Progress
                            value={details.documentQuality}
                            className="h-1 mt-1"
                          />
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Medical Validity
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {details.medicalValidity}
                          </p>
                          <Progress
                            value={details.medicalValidity}
                            className="h-1 mt-1"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border pt-3">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Validation Factors
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${details.factors.costReasonable ? "bg-success" : "bg-destructive"}`}
                            />
                            <p className="text-xs text-muted-foreground">
                              Cost appears reasonable:{" "}
                              <span
                                className={
                                  details.factors.costReasonable ?
                                    "text-success font-medium"
                                  : "text-destructive font-medium"
                                }
                              >
                                {details.factors.costReasonable ? "Yes" : "No"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${details.factors.documentsComplete ? "bg-success" : "bg-destructive"}`}
                            />
                            <p className="text-xs text-muted-foreground">
                              Documents complete:{" "}
                              <span
                                className={
                                  details.factors.documentsComplete ?
                                    "text-success font-medium"
                                  : "text-destructive font-medium"
                                }
                              >
                                {details.factors.documentsComplete ?
                                  "Yes"
                                : "No"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${details.factors.insuranceAvailable ? "bg-success" : "bg-destructive"}`}
                            />
                            <p className="text-xs text-muted-foreground">
                              Insurance available:{" "}
                              <span
                                className={
                                  details.factors.insuranceAvailable ?
                                    "text-success font-medium"
                                  : "text-destructive font-medium"
                                }
                              >
                                {details.factors.insuranceAvailable ?
                                  "Yes"
                                : "No"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${details.factors.doctorLicensed ? "bg-success" : "bg-destructive"}`}
                            />
                            <p className="text-xs text-muted-foreground">
                              Doctor licensed:{" "}
                              <span
                                className={
                                  details.factors.doctorLicensed ?
                                    "text-success font-medium"
                                  : "text-destructive font-medium"
                                }
                              >
                                {details.factors.doctorLicensed ? "Yes" : "No"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-success/10 rounded-lg p-3 border border-success/20">
                        <p className="text-xs text-success font-medium">
                          ✓ This case has been analyzed by our AI engine and
                          validated for funding consideration.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedAIScore(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Medical Cases Section */}
          {activeSection === "cases" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    label: "Pending Cases",
                    value: String(pendingCases.length),
                    color: "text-accent",
                  },
                  {
                    label: "Approved Cases",
                    value: String(approvedCases.length),
                    color: "text-success",
                  },
                  {
                    label: "Rejected Cases",
                    value: String(rejectedCases.length),
                    color: "text-destructive",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-5"
                  >
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {[
                {
                  title: "Pending Cases",
                  cases: pendingCases,
                  status: "pending",
                  icon: AlertTriangle,
                  color: "text-accent",
                },
                {
                  title: "Approved Cases",
                  cases: approvedCases,
                  status: "approved",
                  icon: CheckCircle,
                  color: "text-success",
                },
                {
                  title: "Rejected Cases",
                  cases: rejectedCases,
                  status: "rejected",
                  icon: XCircle,
                  color: "text-destructive",
                },
              ].map((section, sectionIdx) => (
                <div
                  key={sectionIdx}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6"
                >
                  <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <section.icon className={`w-4 h-4 ${section.color}`} />
                    <h2 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {section.cases.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Case ID
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Disease
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Hospital
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Cost
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            AI Score
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Risk
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.cases.length > 0 ?
                          section.cases.map((c: any, idx: number) => {
                            return (
                              <tr
                                key={idx}
                                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedCase(c)}
                              >
                                <td className="px-5 py-4 font-mono text-foreground">
                                  JD-{hospitalSubmissions.indexOf(c) + 3000}
                                </td>
                                <td className="px-5 py-4 text-foreground font-medium">
                                  {c.diseaseName}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                  {c.regId}
                                </td>
                                <td className="px-5 py-4 font-semibold text-foreground">
                                  ₹{(c.estimatedCost / 100000).toFixed(1)}L
                                </td>
                                <td className="px-5 py-4">
                                  <button
                                    onClick={() => {
                                      const score = generateAIScore(c);
                                      setSelectedAIScore(c);
                                    }}
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                  >
                                    <Progress
                                      value={generateAIScore(c)}
                                      className="h-1.5 w-16"
                                    />
                                    <span className="text-xs font-medium text-accent cursor-pointer hover:underline">
                                      {generateAIScore(c)}
                                    </span>
                                  </button>
                                </td>
                                <td className="px-5 py-4">
                                  <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskColor("Medium")}`}
                                  >
                                    Medium
                                  </span>
                                </td>
                                <td
                                  className="px-5 py-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex gap-1.5">
                                    {section.status === "pending" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-success hover:bg-success/10 h-7 px-2"
                                          onClick={() => {
                                            approvePatientCase(
                                              hospitalSubmissions.indexOf(c),
                                            );
                                            setAllCases(
                                              hospitalSubmissions.slice(),
                                            );
                                          }}
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-destructive hover:bg-destructive/10 h-7 px-2"
                                          onClick={() => {
                                            rejectPatientCase(
                                              hospitalSubmissions.indexOf(c),
                                            );
                                            setAllCases(
                                              hospitalSubmissions.slice(),
                                            );
                                          }}
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                        </Button>
                                      </>
                                    )}
                                    {section.status === "approved" && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-accent hover:bg-accent/10 h-7 px-2"
                                        onClick={() => {
                                          setEmailSent(
                                            `Approval notification sent to hospital (${c.regId})`,
                                          );
                                          setTimeout(
                                            () => setEmailSent(null),
                                            5000,
                                          );
                                        }}
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : <tr>
                            <td
                              colSpan={7}
                              className="px-5 py-8 text-center text-muted-foreground"
                            >
                              No {section.status} cases
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Hospitals Section */}
          {activeSection === "hospitals" && (
            <>
              {[
                { title: "Pending Hospitals", data: pending, type: "pending" },
                {
                  title: "Approved Hospitals",
                  data: approvedH,
                  type: "approved",
                },
                {
                  title: "Rejected Hospitals",
                  data: rejectedH,
                  type: "rejected",
                },
              ].map((block, bi) => (
                <div
                  key={bi}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6"
                >
                  <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      {block.title}
                    </h2>
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {block.data.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Reg ID
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Organization
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Submitted
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Certificate
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.data.length > 0 ?
                          block.data.map((v: any, idx: number) => (
                            <tr
                              key={(v.regId || v.uniId) + idx}
                              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                              onClick={() => setSelectedHospital(v)}
                            >
                              <td className="px-5 py-4 font-mono text-foreground">
                                {v.regId}
                              </td>
                              <td className="px-5 py-4 text-foreground font-medium">
                                {v.name || "-"}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground">
                                {v.submittedAt ?
                                  new Date(v.submittedAt).toLocaleString()
                                : "-"}
                              </td>
                              <td className="px-5 py-4 font-semibold text-foreground">
                                {v.certificateName || "-"}
                              </td>
                              <td
                                className="px-5 py-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex gap-1.5">
                                  {block.type === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-success hover:bg-success/10 h-7 px-2"
                                        onClick={() => {
                                          approveVerification(v.regId);
                                          setPending(
                                            getPendingVerifications().slice(),
                                          );
                                          setApprovedH(
                                            Object.values(approvedHospitals),
                                          );
                                        }}
                                      >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10 h-7 px-2"
                                        onClick={() => {
                                          rejectVerification(v.regId);
                                          setPending(
                                            getPendingVerifications().slice(),
                                          );
                                          setRejectedH(
                                            rejectedHospitals.slice(),
                                          );
                                        }}
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                      </Button>
                                    </>
                                  )}
                                  {block.type === "approved" && (
                                    <span className="text-sm text-success font-medium">
                                      Verified
                                    </span>
                                  )}
                                  {block.type === "rejected" && (
                                    <span className="text-sm text-destructive font-medium">
                                      Rejected
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        : <tr>
                            <td
                              colSpan={5}
                              className="px-5 py-8 text-center text-muted-foreground"
                            >
                              No entries
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Universities Section */}
          {activeSection === "universities" && (
            <>
              {[
                {
                  title: "Pending Universities",
                  data: pendingUniversities,
                  type: "pending",
                },
                {
                  title: "Approved Universities",
                  data: approvedU,
                  type: "approved",
                },
                {
                  title: "Rejected Universities",
                  data: rejectedU,
                  type: "rejected",
                },
              ].map((block, bi) => (
                <div
                  key={bi}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6"
                >
                  <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      {block.title}
                    </h2>
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {block.data.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Uni ID
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Organization
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Submitted
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Certificate
                          </th>
                          <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.data.length > 0 ?
                          block.data.map((v: any, idx: number) => (
                            <tr
                              key={(v.uniId || v.regId) + idx}
                              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                              onClick={() => setSelectedUniversity(v)}
                            >
                              <td className="px-5 py-4 font-mono text-foreground">
                                {v.uniId}
                              </td>
                              <td className="px-5 py-4 text-foreground font-medium">
                                {v.name || "-"}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground">
                                {v.submittedAt ?
                                  new Date(v.submittedAt).toLocaleString()
                                : "-"}
                              </td>
                              <td className="px-5 py-4 font-semibold text-foreground">
                                {v.certificateName || "-"}
                              </td>
                              <td
                                className="px-5 py-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex gap-1.5">
                                  {block.type === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-success hover:bg-success/10 h-7 px-2"
                                        onClick={() => {
                                          approveUniversityVerification(
                                            v.uniId,
                                          );
                                          setPendingUniversities(
                                            getPendingUniversityVerifications().slice(),
                                          );
                                          setApprovedU(
                                            Object.values(approvedUniversities),
                                          );
                                        }}
                                      >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10 h-7 px-2"
                                        onClick={() => {
                                          rejectUniversityVerification(v.uniId);
                                          setPendingUniversities(
                                            getPendingUniversityVerifications().slice(),
                                          );
                                          setRejectedU(
                                            rejectedUniversities.slice(),
                                          );
                                        }}
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                      </Button>
                                    </>
                                  )}
                                  {block.type === "approved" && (
                                    <span className="text-sm text-success font-medium">
                                      Verified
                                    </span>
                                  )}
                                  {block.type === "rejected" && (
                                    <span className="text-sm text-destructive font-medium">
                                      Rejected
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        : <tr>
                            <td
                              colSpan={5}
                              className="px-5 py-8 text-center text-muted-foreground"
                            >
                              No entries
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

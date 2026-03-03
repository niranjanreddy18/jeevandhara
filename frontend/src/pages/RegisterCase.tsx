import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  FileText,
  Hospital,
  User,
  FileUp,
} from "lucide-react";
import { getSession } from "@/lib/auth";

const RegisterCase = () => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState(getSession());
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const session = getSession();
    setCurrentSession(session);
    setIsLoading(false);

    // If not logged in, redirect to login
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

  // Listen for session changes
  useEffect(() => {
    const onSessionChange = (e: any) => {
      setCurrentSession(e.detail);
      if (!e.detail) {
        navigate("/login");
      }
    };
    window.addEventListener("jh:session-changed", onSessionChange);
    return () =>
      window.removeEventListener("jh:session-changed", onSessionChange);
  }, [navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Additional check - if still no session, return null (navigate will handle redirect)
  if (!currentSession) {
    return null;
  }

  // Check if user is normal user type, restrict for hospital/university/admin
  if (currentSession.userType !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Only registered patients can submit medical cases.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-primary text-primary-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Form state - Patient Information
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [gender, setGender] = useState("male");

  // Medical Details
  const [medicalCondition, setMedicalCondition] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatmentRequired, setTreatmentRequired] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  // Hospital Details
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalEmail, setHospitalEmail] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");

  // Doctor Details
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");

  // Files
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);
  const [labTestFile, setLabTestFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string>("");

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview?: (preview: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(["File size must be less than 10MB"]);
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors(["Only JPG, PNG, WebP, or PDF files are allowed"]);
        return;
      }

      setFile(file);
      setErrors([]);

      // Create preview for images
      if (file.type.startsWith("image/") && setPreview) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    if (step === 1) {
      // Patient info validation
      if (!patientName.trim()) newErrors.push("Patient name is required");
      if (!patientAge.trim() || isNaN(Number(patientAge)))
        newErrors.push("Valid age is required");
      if (Number(patientAge) < 1 || Number(patientAge) > 150)
        newErrors.push("Age must be between 1 and 150");
      if (!patientPhone.trim()) newErrors.push("Patient phone is required");
      if (!patientEmail.trim()) newErrors.push("Patient email is required");
      if (!medicalCondition.trim())
        newErrors.push("Medical condition is required");
    } else if (step === 2) {
      // Medical details validation
      if (!diagnosis.trim()) newErrors.push("Diagnosis is required");
      if (!symptoms.trim()) newErrors.push("Symptoms description is required");
      if (!treatmentRequired.trim())
        newErrors.push("Treatment required is required");
      if (!estimatedCost.trim() || isNaN(Number(estimatedCost)))
        newErrors.push("Valid estimated cost is required");
      if (!prescriptionFile && !prescriptionPreview)
        newErrors.push("Prescription document/image is required");
    } else if (step === 3) {
      // Hospital details validation
      if (!hospitalName.trim()) newErrors.push("Hospital name is required");
      if (!hospitalEmail.trim()) newErrors.push("Hospital email is required");
      if (!hospitalPhone.trim()) newErrors.push("Hospital phone is required");
      if (!hospitalAddress.trim())
        newErrors.push("Hospital address is required");
      if (!hospitalCity.trim()) newErrors.push("Hospital city is required");
      if (!doctorName.trim()) newErrors.push("Doctor name is required");
      if (!doctorSpecialization.trim())
        newErrors.push("Doctor specialization is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      // Prepare form data with files
      const formData = new FormData();

      // Patient info
      formData.append("patientName", patientName);
      formData.append("patientAge", patientAge);
      formData.append("patientPhone", patientPhone);
      formData.append("patientEmail", patientEmail);
      formData.append("gender", gender);

      // Medical details
      formData.append("medicalCondition", medicalCondition);
      formData.append("diagnosis", diagnosis);
      formData.append("symptoms", symptoms);
      formData.append("treatmentRequired", treatmentRequired);
      formData.append("estimatedCost", estimatedCost);

      // Hospital details
      formData.append("hospitalName", hospitalName);
      formData.append("hospitalEmail", hospitalEmail);
      formData.append("hospitalPhone", hospitalPhone);
      formData.append("hospitalAddress", hospitalAddress);
      formData.append("hospitalCity", hospitalCity);

      // Doctor details
      formData.append("doctorName", doctorName);
      formData.append("doctorSpecialization", doctorSpecialization);
      formData.append("doctorLicense", doctorLicense);
      formData.append("doctorPhone", doctorPhone);

      // Files
      if (prescriptionFile) {
        formData.append("prescriptionFile", prescriptionFile);
      }
      if (medicalReportFile) {
        formData.append("medicalReportFile", medicalReportFile);
      }
      if (labTestFile) {
        formData.append("labTestFile", labTestFile);
      }

      formData.append("userId", currentSession.userId);

      // TODO: Send to backend API
      console.log("Submitting medical case:", {
        patientName,
        patientAge,
        medicalCondition,
        hospitalName,
        estimatedCost,
        userId: currentSession.userId,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err: any) {
      setErrors([err.message || "Failed to submit case"]);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Case Registered Successfully!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your medical case has been submitted for AI verification. You will
            receive an update within 24 hours.
          </p>
          <p className="text-xs text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Register Medical Case
          </h1>
          <p className="text-muted-foreground">
            Help us verify your case with AI-driven analysis and hospital
            validation
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
              <p className="text-xs mt-2 text-center text-muted-foreground">
                {step === 1 && "Patient Info"}
                {step === 2 && "Medical Details"}
                {step === 3 && "Hospital & Doctor"}
              </p>
            </div>
          ))}
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            {errors.map((error, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-sm text-destructive"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Patient Information */}
          {currentStep === 1 && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    placeholder="Full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="patientAge">Age *</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    placeholder="Years"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  placeholder="+91 9876543210"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="patientEmail">Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  placeholder="patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="medicalCondition">
                  Primary Medical Condition *
                </Label>
                <textarea
                  id="medicalCondition"
                  placeholder="e.g., Heart disease, Cancer, Diabetes complication..."
                  value={medicalCondition}
                  onChange={(e) => setMedicalCondition(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This helps AI understand the case category
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Medical Details */}
          {currentStep === 2 && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Medical Details
              </h2>

              <div>
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <textarea
                  id="diagnosis"
                  placeholder="Doctor's diagnosis and findings..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  AI analyzes this for case verification
                </p>
              </div>

              <div>
                <Label htmlFor="symptoms">Symptoms & Severity *</Label>
                <textarea
                  id="symptoms"
                  placeholder="Describe symptoms, duration, and severity..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="treatmentRequired">Treatment Required *</Label>
                <textarea
                  id="treatmentRequired"
                  placeholder="e.g., Emergency surgery, Radiation therapy, Medication..."
                  value={treatmentRequired}
                  onChange={(e) => setTreatmentRequired(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="estimatedCost">Estimated Cost (₹) *</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  placeholder="e.g., 500000"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  AI validates this against hospital pricing benchmarks
                </p>
              </div>

              {/* Prescription Upload */}
              <div className="border border-dashed border-border rounded-lg p-4">
                <label className="cursor-pointer block">
                  <div className="flex items-center justify-center gap-2">
                    <FileUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Prescription Document / Image *
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    JPG, PNG, PDF (Max 10MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) =>
                      handleFileSelect(
                        e,
                        setPrescriptionFile,
                        setPrescriptionPreview,
                      )
                    }
                  />
                </label>

                {prescriptionPreview && (
                  <div className="mt-4 relative">
                    <img
                      src={prescriptionPreview}
                      alt="Prescription preview"
                      className="max-h-48 rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPrescriptionFile(null);
                        setPrescriptionPreview("");
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {prescriptionFile && !prescriptionPreview && (
                  <div className="mt-2 flex items-center justify-between bg-success/10 p-2 rounded text-xs text-success">
                    <span>✓ {prescriptionFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setPrescriptionFile(null)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Documents */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-dashed border-border rounded-lg p-3">
                  <label className="cursor-pointer block text-center">
                    <p className="text-xs font-medium text-foreground">
                      Medical Report (Optional)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) =>
                        handleFileSelect(e, setMedicalReportFile)
                      }
                    />
                  </label>
                  {medicalReportFile && (
                    <div className="text-xs text-success mt-1">
                      ✓ {medicalReportFile.name}
                    </div>
                  )}
                </div>

                <div className="border border-dashed border-border rounded-lg p-3">
                  <label className="cursor-pointer block text-center">
                    <p className="text-xs font-medium text-foreground">
                      Lab Test Results (Optional)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileSelect(e, setLabTestFile)}
                    />
                  </label>
                  {labTestFile && (
                    <div className="text-xs text-success mt-1">
                      ✓ {labTestFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Hospital & Doctor Details */}
          {currentStep === 3 && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Hospital className="w-5 h-5" />
                  Hospital Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      placeholder="e.g., Apollo Hospitals"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      AI verifies against registered hospitals database
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hospitalCity">City *</Label>
                      <Input
                        id="hospitalCity"
                        placeholder="e.g., Delhi"
                        value={hospitalCity}
                        onChange={(e) => setHospitalCity(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospitalPhone">Phone *</Label>
                      <Input
                        id="hospitalPhone"
                        placeholder="+91 XXXXX XXXXX"
                        value={hospitalPhone}
                        onChange={(e) => setHospitalPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hospitalEmail">Official Email *</Label>
                    <Input
                      id="hospitalEmail"
                      type="email"
                      placeholder="contact@hospital.com"
                      value={hospitalEmail}
                      onChange={(e) => setHospitalEmail(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For verification and contact
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="hospitalAddress">Full Address *</Label>
                    <textarea
                      id="hospitalAddress"
                      placeholder="Street address, area, landmark..."
                      value={hospitalAddress}
                      onChange={(e) => setHospitalAddress(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Doctor Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor Name *</Label>
                    <Input
                      id="doctorName"
                      placeholder="Full name"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorSpecialization">
                      Specialization *
                    </Label>
                    <Input
                      id="doctorSpecialization"
                      placeholder="e.g., Cardiologist, Oncologist"
                      value={doctorSpecialization}
                      onChange={(e) => setDoctorSpecialization(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorPhone">Doctor Phone (Optional)</Label>
                    <Input
                      id="doctorPhone"
                      placeholder="+91 XXXXX XXXXX"
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorLicense">
                      License Number (Optional)
                    </Label>
                    <Input
                      id="doctorLicense"
                      placeholder="Medical Council registration"
                      value={doctorLicense}
                      onChange={(e) => setDoctorLicense(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      AI can verify against medical board records
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="w-full"
              >
                Previous
              </Button>
            )}

            {currentStep < 3 ?
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            : <Button
                type="submit"
                disabled={loading}
                className="w-full bg-success text-success-foreground hover:bg-success/90"
              >
                {loading ? "Submitting..." : "Submit Case"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            }
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            🤖 AI Verification Process
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              ✓ Prescription validation - AI analyzes document clarity and
              authenticity
            </li>
            <li>
              ✓ Hospital verification - Cross-check against registered hospitals
            </li>
            <li>
              ✓ Cost benchmarking - Compare treatment cost against industry
              standards
            </li>
            <li>
              ✓ Doctor credentials - Verify against medical council database
            </li>
            <li>✓ Case authenticity - ML model detects fraud indicators</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterCase;

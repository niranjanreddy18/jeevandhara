import { Building2, FileText, Upload, Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  
  authenticateHospital,
  registerHospital,
  validateHospitalEmail,
  validateHospitalRegNumber,
  submitPatientCase,
  hospitalSubmissions,
} from "@/lib/hospitals";

type RegisterFormProps = { onRegistered: (regId: string, password: string) => void };

const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [certificates, setCertificates] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const tryRegister = () => {
    if (!name || !email || !regNumber || !password) { alert('Please fill required fields'); return; }
    if (!validateHospitalEmail(email)) { alert('Please use a professional hospital email (hospital/health/clinic or .edu/.org)'); return; }
    if (!validateHospitalRegNumber(regNumber)) { alert('Registration number must follow HOSP-YYYY-NNNN'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    const ok = registerHospital({ regId: regNumber, name, email, address, certificates, password });
    if (ok) {
      alert('Registration successful — you are logged in');
      onRegistered(regNumber, password);
    } else {
      alert('Registration failed: hospital already registered or approved');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Hospital Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Hospital Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourhospital.org" className="mt-1" />
      </div>
      <div>
        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Verified Certificates (document)</Label>
        <Input type="file" onChange={(e) => {
          const f = (e.target as HTMLInputElement).files?.[0];
          setCertificates(f ? f.name : '');
        }} className="mt-1" />
        {certificates && <p className="text-xs text-muted-foreground mt-1">Selected: {certificates}</p>}
      </div>
      <div>
        <Label>Hospital Registration Number</Label>
        <Input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="HOSP-2024-0156" className="mt-1" />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" />
      </div>
      <Button className="w-full bg-accent text-accent-foreground" onClick={tryRegister}>Create Account</Button>
    </div>
  );
};

const HospitalPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [regId, setRegId] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [view, setView] = useState<'dashboard' | 'submit' | 'my' | 'profile'>('dashboard');
  // whether the card is showing login or register form
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  // submission form state
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [amountRequired, setAmountRequired] = useState('');
  const [insuranceAvailable, setInsuranceAvailable] = useState(false);
  const [insuranceCoverage, setInsuranceCoverage] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState('');
  const [medicalReportFile, setMedicalReportFile] = useState('');

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'dashboard';
    if (['dashboard', 'submit', 'my', 'profile'].includes(last)) {
      setView(last as any);
    } else if (location.pathname.endsWith('/hospital')) {
      setView('dashboard');
    }
  }, [location.pathname]);

  if (!loggedIn) {
    return (
      <div className="py-10">
        <div className="container max-w-3xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Hospital Login / Register</h1>
                <p className="text-sm text-muted-foreground">Sign in with your Hospital ID or register a new account</p>
              </div>
            </div>

            {/* toggle buttons */}
          <div className="flex space-x-2 mb-6">
            <button
              className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-muted/10'}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-muted/10'}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <div className="p-4 bg-muted/10 rounded-md">
              <h2 className="font-semibold mb-3">Hospital Login</h2>
              <div className="space-y-3">
                <div>
                  <Label>Hospital Registration ID</Label>
                  <Input value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="HOSP-2024-0042" className="mt-1" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" id="hospital-pass" placeholder="••••••" className="mt-1" />
                </div>
                <Button className="w-full bg-primary text-primary-foreground" onClick={() => {
                  const passEl = document.getElementById('hospital-pass') as HTMLInputElement | null;
                  const pwd = passEl?.value || '';
                  if (!regId || !pwd) { alert('Please enter registration ID and password'); return; }
                  if (authenticateHospital(regId, pwd)) {
                    setLoggedIn(true);
                    navigate('/hospital/dashboard');
                  } else {
                    alert('Invalid credentials or not registered');
                  }
                }}>
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/10 rounded-md">
              <h2 className="font-semibold mb-3">Hospital Registration</h2>
              <RegisterForm onRegistered={(rId, pwd) => { setRegId(rId); setLoggedIn(true); navigate('/hospital/dashboard'); }} />
            </div>
          )}
          </div>
        </div>
      </div>
    );
    }
    return (
      <div className="flex min-h-screen">
      {/* sidebar */}
      <nav className="w-64 bg-slate-50 border-r border-border p-6">
        <h2 className="text-lg font-bold mb-6">HMS Portal</h2>
        <ul className="space-y-3 text-sm">
          <li>
            <button className={`w-full text-left ${view === 'dashboard' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/hospital/dashboard')}>Dashboard</button>
          </li>
          <li>
            <button className={`w-full text-left ${view === 'submit' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/hospital/submit')}>Submit Patient</button>
          </li>
          <li>
            <button className={`w-full text-left ${view === 'my' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/hospital/my')}>My Submissions</button>
          </li>
          <li>
            <button className={`w-full text-left ${view === 'profile' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/hospital/profile')}>Profile</button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">{view === 'dashboard' ? 'Dashboard' : view === 'submit' ? 'Submit Patient' : view === 'my' ? 'My Submissions' : 'Profile'}</h1>
          <Button variant="outline" size="sm" onClick={() => { setLoggedIn(false); navigate('/hospital'); }}>Sign Out</Button>
        </div>

        {view === 'dashboard' && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Patients", value: "4", icon: FileText },
                { label: "Approved", value: "2", icon: Clock },
                { label: "Pending", value: "1", icon: Upload },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Recent Submissions</h3>
              <ul className="space-y-3">
                <li className="p-4 bg-muted/10 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">Rahul Sharma</div>
                    <div className="text-xs text-muted-foreground">Cardiac Arrhythmia</div>
                  </div>
                  <div className="text-sm text-success">approved</div>
                </li>
                <li className="p-4 bg-muted/10 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">Priya Patel</div>
                    <div className="text-xs text-muted-foreground">Kidney Stones</div>
                  </div>
                  <div className="text-sm text-amber-600">pending</div>
                </li>
              </ul>
            </div>
          </>
        )}

        {view === 'submit' && (
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Submit Patient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Patient Name</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Last 4 digits of Aadhaar</Label>
                <Input value={aadhaarLast4} onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))} maxLength={4} placeholder="1234" className="mt-1" />
              </div>
              <div>
                <Label>Disease Name</Label>
                <Input value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Estimated Total Cost (₹)</Label>
                <Input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Doctor Registration Number</Label>
                <Input value={doctorRegNo} onChange={(e) => setDoctorRegNo(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Amount Required (₹)</Label>
                <Input type="number" value={amountRequired} onChange={(e) => setAmountRequired(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Insurance Available</Label>
                <div className="mt-1">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={insuranceAvailable} onChange={(e) => setInsuranceAvailable(e.target.checked)} />
                    <span className="text-sm">Has Insurance</span>
                  </label>
                </div>
              </div>
              {insuranceAvailable && (
                <div>
                  <Label>Insurance Coverage (%)</Label>
                  <Input type="number" value={insuranceCoverage} onChange={(e) => setInsuranceCoverage(e.target.value)} className="mt-1" />
                </div>
              )}
              <div>
                <Label>Prescription Document</Label>
                <Input type="file" onChange={(e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  setPrescriptionFile(f ? f.name : '');
                }} className="mt-1" />
                {prescriptionFile && <p className="text-xs text-muted-foreground mt-1">Selected: {prescriptionFile}</p>}
              </div>
              <div>
                <Label>Medical Report Document</Label>
                <Input type="file" onChange={(e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  setMedicalReportFile(f ? f.name : '');
                }} className="mt-1" />
                {medicalReportFile && <p className="text-xs text-muted-foreground mt-1">Selected: {medicalReportFile}</p>}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="bg-accent text-accent-foreground" onClick={() => {
                // validate
                if (!patientName.trim()) { alert('Patient name required'); return; }
                if (!dob) { alert('Date of birth required'); return; }
                if (!/^[0-9]{4}$/.test(aadhaarLast4)) { alert('Aadhaar last 4 digits must be 4 numbers'); return; }
                if (!diseaseName.trim()) { alert('Disease name required'); return; }
                const est = Number(estimatedCost);
                if (Number.isNaN(est) || est <= 0) { alert('Estimated cost must be a positive number'); return; }
                const amt = Number(amountRequired);
                if (Number.isNaN(amt) || amt <= 0) { alert('Amount required must be a positive number'); return; }
                if (!doctorRegNo.trim()) { alert('Doctor registration number required'); return; }
                if (insuranceAvailable) {
                  const cov = Number(insuranceCoverage);
                  if (Number.isNaN(cov) || cov < 0 || cov > 100) { alert('Insurance coverage must be 0-100'); return; }
                }
                // submit
                const ok = submitPatientCase(regId || 'UNREGISTERED', {
                  patientName, dob, aadhaarLast4, diseaseName, estimatedCost: est, doctorRegNo, amountRequired: amt, insuranceAvailable, insuranceCoverage: insuranceAvailable ? Number(insuranceCoverage) : 0, prescriptionFile, medicalReportFile,
                });
                if (ok) {
                  alert('Submission saved — status: pending');
                  // clear form
                  setPatientName(''); setDob(''); setAadhaarLast4(''); setDiseaseName(''); setEstimatedCost(''); setDoctorRegNo(''); setAmountRequired(''); setInsuranceAvailable(false); setInsuranceCoverage(''); setPrescriptionFile(''); setMedicalReportFile('');
                  navigate('/hospital/my');
                } else {
                  alert('Failed to save submission');
                }
              }}>
                <Upload className="w-4 h-4 mr-2" /> Submit Case
              </Button>
              <Button variant="outline" onClick={() => { setPatientName(''); setDob(''); setAadhaarLast4(''); setDiseaseName(''); setEstimatedCost(''); setDoctorRegNo(''); setAmountRequired(''); setInsuranceAvailable(false); setInsuranceCoverage(''); setPrescriptionFile(''); setMedicalReportFile(''); }}>Reset</Button>
            </div>
          </div>
        )}

        {view === 'my' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Disease</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {hospitalSubmissions.filter(s => s.regId === (regId || 'UNREGISTERED')).map((s, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-5 py-3">{s.patientName}</td>
                    <td className="px-5 py-3">{s.diseaseName}</td>
                    <td className="px-5 py-3 font-semibold">₹{s.amountRequired?.toLocaleString?.() || s.estimatedCost}</td>
                    <td className="px-5 py-3">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-2">
            <p><strong>Organization:</strong> AIIMS Delhi</p>
            <p><strong>Contact:</strong> admin@aiims.edu</p>
            <p><strong>Reg ID:</strong> HOSP-2024-0042</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalPortal;

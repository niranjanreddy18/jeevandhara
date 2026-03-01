import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  validateUniversityId,
  validateUniversityEmail,
  registerUniversity,
  authenticateUniversity,
  registeredUniversities,
} from "@/lib/universities";

type UniversityRegisterFormProps = { onRegistered: (uniId: string, password: string) => void };

const UniversityRegisterForm = ({ onRegistered }: UniversityRegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [certificates, setCertificates] = useState('');
  const [uniId, setUniId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const tryRegister = () => {
    if (!name || !email || !uniId || !password) { alert('Please fill required fields'); return; }
    if (!validateUniversityEmail(email, name)) { alert('University email must contain the university name and end with .ac.in, .edu.in or .res.in'); return; }
    if (!validateUniversityId(uniId)) { alert('University ID must follow UNI-YYYY-NNNN format'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    const ok = registerUniversity({ uniId, name, email, address, certificates, password });
    if (ok) {
      alert('Registration successful — you are logged in');
      onRegistered(uniId, password);
    } else {
      alert('Registration failed: university already registered');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>University Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>University Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@iitd.ac.in" className="mt-1" />
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
        <Label>University ID</Label>
        <Input value={uniId} onChange={(e) => setUniId(e.target.value)} placeholder="UNI-2024-0001" className="mt-1" />
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

const UniversityPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [uniId, setUniId] = useState('');
  const [uniPass, setUniPass] = useState('');
  // view controls which sidebar page is shown after login
  const [view, setView] = useState<
    'dashboard' | 'approved' | 'payments' | 'reports' | 'profile'
  >('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // sync view with URL so sidebar links work and can be bookmarked
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'dashboard';
    if (['dashboard', 'approved', 'payments', 'reports', 'profile'].includes(last)) {
      setView(last as any);
    } else if (location.pathname.endsWith('/university')) {
      setView('dashboard');
    }
  }, [location.pathname]);

  // sample static data used by all sections
  const approvedPatients = [
    { name: 'Meena Devi', hospital: 'Fortis Hospital', amount: '₹60,000', status: 'Approved' },
    { name: 'Anjali Verma', hospital: 'Max Healthcare', amount: '₹45,000', status: 'Approved' },
    { name: 'Ravi Kumar', hospital: 'City Hospital', amount: '₹75,000', status: 'Approved' },
  ];
  const paymentHistory = [
    { date: '2026-02-20', patient: 'Meena Devi', amount: '₹60,000', status: 'Paid' },
    { date: '2026-02-18', patient: 'Anjali Verma', amount: '₹45,000', status: 'Paid' },
    { date: '2026-02-15', patient: 'Ravi Kumar', amount: '₹75,000', status: 'Paid' },
  ];
  const reports = [
    { caseId: 'JD-2847', hospital: 'AIIMS Delhi', report: 'View' },
    { caseId: 'JD-2845', hospital: 'CMC Vellore', report: 'View' },
  ];
  const profileInfo = {
    university: 'IIT Delhi',
    contact: 'contact@iitd.ac.in',
    phone: '+91 11 2659 7135',
  };

  // helper to render sidebar content
  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Total Approved</p>
                <p className="text-2xl font-bold">124</p>
                <p className="text-xs text-muted-foreground">Patients approved this month</p>
              </div>
              <div className="bg-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold">₹48,50,000</p>
                <p className="text-xs text-muted-foreground">Funds disbursed so far</p>
              </div>
              <div className="bg-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Payments Done</p>
                <p className="text-2xl font-bold">98</p>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </div>
              <div className="bg-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">26</p>
                <p className="text-xs text-muted-foreground">Awaiting fund transfer</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedPatients.map((p, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">{p.name}</td>
                      <td className="px-5 py-3">{p.hospital}</td>
                      <td className="px-5 py-3 font-semibold">{p.amount}</td>
                      <td className="px-5 py-3 text-success">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'approved':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Approved Patients</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedPatients.map((p, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">{p.name}</td>
                      <td className="px-5 py-3">{p.hospital}</td>
                      <td className="px-5 py-3 font-semibold">{p.amount}</td>
                      <td className="px-5 py-3 text-success">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'payments':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">{p.date}</td>
                      <td className="px-5 py-3">{p.patient}</td>
                      <td className="px-5 py-3 font-semibold">{p.amount}</td>
                      <td className="px-5 py-3 text-success">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'reports':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Patient Reports</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Case ID</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono">{r.caseId}</td>
                      <td className="px-5 py-3">{r.hospital}</td>
                      <td className="px-5 py-3">
                        <Button size="sm" variant="ghost">{r.report}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'profile':
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-2">
              <p><strong>University:</strong> {profileInfo.university}</p>
              <p><strong>Contact:</strong> {profileInfo.contact}</p>
              <p><strong>Phone:</strong> {profileInfo.phone}</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!loggedIn) {
    return (
      <div className="py-10">
        <div className="container max-w-3xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">University Login / Register</h1>
                <p className="text-sm text-muted-foreground">Sign in with your University ID or register a new account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Login panel */}
              <div className="p-4 bg-muted/10 rounded-md">
                <h2 className="font-semibold mb-3">Already registered? Login</h2>
                <div className="space-y-3">
                  <div>
                    <Label>University ID</Label>
                    <Input value={uniId} onChange={(e) => setUniId(e.target.value)} placeholder="UNI-2024-0001" className="mt-1" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" id="uni-pass" placeholder="••••••" className="mt-1" />
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground" onClick={() => {
                    const passEl = document.getElementById('uni-pass') as HTMLInputElement | null;
                    const pwd = passEl?.value || '';
                    if (!uniId || !pwd) { alert('Please enter university ID and password'); return; }
                    if (authenticateUniversity(uniId, pwd)) {
                      setLoggedIn(true);
                      navigate('/university/dashboard');
                    } else {
                      alert('Invalid credentials or not registered');
                    }
                  }}>
                    <LogIn className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                </div>
              </div>

              {/* Register panel */}
              <div className="p-4 bg-muted/10 rounded-md">
                <h2 className="font-semibold mb-3">New here? Register</h2>
                <UniversityRegisterForm onRegistered={(newUniId, pwd) => { setUniId(newUniId); setUniPass(pwd); setLoggedIn(true); navigate('/university/dashboard'); }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <nav className="w-64 bg-slate-50 border-r border-border p-6">
        <h2 className="text-lg font-bold mb-6">College Management</h2>
        <ul className="space-y-3 text-sm">
          <li>
            <button
              className={`w-full text-left ${view === 'dashboard' ? 'font-semibold text-accent' : ''}`}
              onClick={() => navigate('/university/dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left ${view === 'approved' ? 'font-semibold text-accent' : ''}`}
              onClick={() => navigate('/university/approved')}
            >
              Approved Patients
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left ${view === 'payments' ? 'font-semibold text-accent' : ''}`}
              onClick={() => navigate('/university/payments')}
            >
              Payment History
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left ${view === 'reports' ? 'font-semibold text-accent' : ''}`}
              onClick={() => navigate('/university/reports')}
            >
              Patient Reports
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left ${view === 'profile' ? 'font-semibold text-accent' : ''}`}
              onClick={() => navigate('/university/profile')}
            >
              Profile
            </button>
          </li>
        </ul>
      </nav>
      {/* main content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{view === 'dashboard' ? 'Dashboard' : view.charAt(0).toUpperCase() + view.slice(1).replace(/s$/, '')}</h1>
          <Button variant="outline" size="sm" onClick={() => { setLoggedIn(false); navigate('/university'); }}>Logout</Button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};
export default UniversityPortal;

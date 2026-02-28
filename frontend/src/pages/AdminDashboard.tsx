import { Shield, AlertTriangle, CheckCircle, XCircle, Brain, BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { getPendingVerifications, approveVerification, rejectVerification } from "@/lib/hospitals";

const riskColor = (r: string) => {
  if (r === "High") return "text-destructive bg-destructive/10";
  if (r === "Medium") return "text-accent bg-accent/10";
  return "text-success bg-success/10";
};

const pendingCases = [
  { id: "JD-2848", disease: "Cardiac Bypass", hospital: "Fortis Mumbai", cost: 1400000, aiScore: 92, riskFlag: "Low", duplicate: false, confidence: 94 },
  { id: "JD-2849", disease: "Liver Transplant", hospital: "Medanta Gurugram", cost: 2800000, aiScore: 67, riskFlag: "High", duplicate: false, confidence: 71 },
  { id: "JD-2850", disease: "Chemotherapy", hospital: "Tata Memorial", cost: 950000, aiScore: 88, riskFlag: "Medium", duplicate: true, confidence: 85 },
  { id: "JD-2851", disease: "Dialysis (6 mo)", hospital: "CMC Vellore", cost: 320000, aiScore: 95, riskFlag: "Low", duplicate: false, confidence: 97 },
];

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pending, setPending] = useState(getPendingVerifications());

  // refresh pending verifications when localStorage changes (other tab) or window gains focus
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'jh_pending_verifications_v1') {
        setPending(getPendingVerifications().slice());
      }
    };
    const onFocus = () => setPending(getPendingVerifications().slice());
    const onCustom = () => setPending(getPendingVerifications().slice());
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener('jh:pending-updated', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('jh:pending-updated', onCustom as EventListener);
    };
  }, []);

  if (!loggedIn) {
    return (
      <div className="py-20">
        <div className="container max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">AI Verification Console</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Admin ID</Label>
                <Input placeholder="ADM-001" className="mt-1.5" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground" onClick={() => setLoggedIn(true)}>
                <LogIn className="w-4 h-4 mr-2" /> Access Console
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-6 h-6 text-accent" /> AI Verification Console
            </h1>
            <p className="text-sm text-muted-foreground">Review AI-analyzed cases and approve for public listing</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>Sign Out</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Hospital Verifs", value: String(pending.length), color: "text-accent" },
            { label: "Pending Cases", value: "4", color: "text-accent" },
            { label: "Approved Today", value: "12", color: "text-success" },
            { label: "Avg Confidence", value: "86.7%", color: "text-foreground" },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cases Pending AI Review */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Cases Pending AI Review</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Case ID</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Disease</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Cost</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">AI Score</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Risk</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Duplicate</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCases.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-foreground">{c.id}</td>
                    <td className="px-5 py-4 text-foreground font-medium">{c.disease}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c.hospital}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">₹{(c.cost / 100000).toFixed(1)}L</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={c.aiScore} className="h-1.5 w-16" />
                        <span className="text-xs font-medium text-foreground">{c.aiScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskColor(c.riskFlag)}`}>{c.riskFlag}</span>
                    </td>
                    <td className="px-5 py-4">
                      {c.duplicate ? (
                        <span className="inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="w-3 h-3" /> Yes</span>
                      ) : (
                        <span className="text-xs text-success">No</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">{c.confidence}%</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="text-success hover:bg-success/10 h-7 px-2">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 px-2">
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hospital Verifications */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Hospital Verifications Pending</h2>
          </div>
          <div className="overflow-x-auto">
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Reg ID</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Organization</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Submitted</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Certificate</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((v: any) => (
                  <tr key={v.regId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-foreground">{v.regId}</td>
                    <td className="px-5 py-4 text-foreground font-medium">{v.name || '-'}</td>
                    <td className="px-5 py-4 text-muted-foreground">{new Date(v.submittedAt).toLocaleString()}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{v.certificateName || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="text-success hover:bg-success/10 h-7 px-2" onClick={() => { approveVerification(v.regId); setPending(getPendingVerifications().slice()); }}>
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 px-2" onClick={() => { rejectVerification(v.regId); setPending(getPendingVerifications().slice()); }}>
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

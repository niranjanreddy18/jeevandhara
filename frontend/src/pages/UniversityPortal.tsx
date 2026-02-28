import { GraduationCap, LogIn, BookOpen, Download, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMemo, useState } from "react";

const initialFundableCases = [
  { id: "JD-2847", disease: "Cancer", hospital: "AIIMS Delhi", required: 850000, collected: 612000, urgency: "Critical" },
  { id: "JD-2845", disease: "Kidney", hospital: "CMC Vellore", required: 450000, collected: 125000, urgency: "Medium" },
  { id: "JD-2841", disease: "Cardiac", hospital: "Narayana Health", required: 750000, collected: 200000, urgency: "High" },
];

const initialTransactions = [
  { date: "2026-02-20", case: "JD-2852", amount: 200000, status: "Refunding" },
  { date: "2026-02-15", case: "JD-2844", amount: 500000, status: "Completed" },
  { date: "2026-02-05", case: "JD-2840", amount: 100000, status: "Failed" },
  { date: "2026-01-28", case: "JD-2839", amount: 300000, status: "Completed" },
  { date: "2026-01-10", case: "JD-2835", amount: 750000, status: "Completed" },
];

const formatCurrency = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

const UniversityPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cases, setCases] = useState(initialFundableCases);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [query, setQuery] = useState('');
  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter(c => !q || c.disease.toLowerCase().includes(q) || c.hospital.toLowerCase().includes(q));
  }, [cases, query]);

  if (!loggedIn) {
    return (
      <div className="py-20">
        <div className="container max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">University Portal</h1>
                <p className="text-sm text-muted-foreground">Institutional funding access</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="uni-id">University ID</Label>
                <Input id="uni-id" placeholder="e.g., UNI-IIT-DEL-001" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="uni-pass">Password</Label>
                <Input id="uni-pass" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setLoggedIn(true)}>
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">University Dashboard</h1>
            <p className="text-sm text-muted-foreground">IIT Delhi — CSR Funding Division</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>Sign Out</Button>
        </div>
        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Available Cases</p>
            <p className="text-2xl font-bold">{cases.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Total Collected</p>
            <p className="text-2xl font-bold">{formatCurrency(cases.reduce((s, x) => s + x.collected, 0))}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Total Required</p>
            <p className="text-2xl font-bold">{formatCurrency(cases.reduce((s, x) => s + x.required, 0))}</p>
          </div>
        </div>

        {/* Cases to Fund */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" /> Available Cases for Funding
          </h2>
          <div className="w-72">
            <Input placeholder="Search by disease or hospital" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {filteredCases.map(c => {
            const pct = Math.round((c.collected / c.required) * 100);
            const remaining = Math.max(0, c.required - c.collected);
            const urgencyColor = c.urgency === 'Critical' ? 'text-destructive bg-destructive/10' : c.urgency === 'High' ? 'text-accent bg-accent/10' : 'text-foreground bg-muted/10';
            return (
              <div key={c.id} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <h3 className="text-base font-semibold text-foreground mt-1">{c.disease}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{c.hospital}</p>
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${urgencyColor}`}>{c.urgency}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{formatCurrency(c.collected)} / {formatCurrency(c.required)}</span>
                  <span className="font-medium text-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5 mb-3" />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => {
                    const input = prompt(`Enter amount to fund (in ₹) for ${c.id} - remaining ${formatCurrency(remaining)}:`);
                    if (!input) return;
                    const amt = Number(input.replace(/[^0-9.-]+/g, ''));
                    if (isNaN(amt) || amt <= 0) { alert('Invalid amount'); return; }
                    const toAdd = Math.min(amt, remaining);
                    setCases(prev => prev.map(p => p.id === c.id ? { ...p, collected: p.collected + toAdd } : p));
                    setTransactions(prev => [{ date: new Date().toISOString().slice(0,10), case: c.id, amount: toAdd, status: 'Completed' }, ...prev]);
                    alert(`Thank you — ₹${(toAdd/100000).toFixed(1)}L funded to ${c.id}`);
                  }} disabled={pct >= 100}>
                    Fund This Case
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => alert('View details not implemented')}>View</Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction History */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Case ID</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{t.case}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{formatCurrency(t.amount)}</td>
                  <td className="px-5 py-3">
                    {t.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <CheckCircle className="w-3 h-3" /> {t.status}
                      </span>
                    )}
                    {t.status === 'Refunding' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                        <RefreshCw className="w-3 h-3" /> {t.status}
                      </span>
                    )}
                    {t.status === 'Failed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                        <XCircle className="w-3 h-3" /> {t.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="sm" className="text-accent">
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UniversityPortal;

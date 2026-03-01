import { Building2, FileText, Upload, Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { isHospitalApproved, submitHospitalVerification } from "@/lib/hospitals";

const HospitalPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [regId, setRegId] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [certificateName, setCertificateName] = useState('');

  if (!loggedIn) {
    return (
      <div className="py-20">
        <div className="container max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Hospital Portal</h1>
                <p className="text-sm text-muted-foreground">Secure institutional access</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hospital-id">Hospital Registration ID</Label>
                <Input id="hospital-id" value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="e.g., HOSP-2024-0156" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="hospital-pass">Password</Label>
                <Input id="hospital-pass" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>

              {!verifSubmitted && !isHospitalApproved(regId) && (
                <div className="p-4 bg-muted/10 rounded-md">
                  <p className="text-sm text-muted-foreground">Your hospital is not yet approved to submit cases. Please submit verification documents first.</p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <Label>Organization Name</Label>
                      <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., AIIMS Delhi" className="mt-1" />
                    </div>
                    <div>
                      <Label>Government Certificate Name</Label>
                      <Input value={certificateName} onChange={(e) => setCertificateName(e.target.value)} placeholder="e.g., gov-cert.pdf" className="mt-1" />
                    </div>
                    <Button className="mt-2" onClick={() => {
                      if (regId) {
                        const ok = submitHospitalVerification({ regId, name: orgName || undefined, certificateName: certificateName || undefined, proofs: 'uploaded' });
                        if (ok) {
                          setVerifSubmitted(true);
                          alert('Verification submitted — admin will review and approve shortly');
                        } else {
                          alert('Verification already exists or hospital is approved');
                        }
                      }
                    }}>Submit Verification Documents</Button>
                  </div>
                </div>
              )}

              <Button className="w-full bg-primary text-primary-foreground" onClick={() => setLoggedIn(true)}>
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
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-sm text-muted-foreground">AIIMS Delhi — HOSP-2024-0042</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Submitted Cases", value: "23", icon: FileText },
            { label: "Under Review", value: "4", icon: Clock },
            { label: "Funded", value: "17", icon: Upload },
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

        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6">Submit New Patient Case</h2>
          {isHospitalApproved(regId) ? (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label>Disease Type</Label>
                  <Input placeholder="e.g., Chronic Kidney Disease" className="mt-1.5" />
                </div>
                <div>
                  <Label>Estimated Cost (₹)</Label>
                  <Input placeholder="e.g., 850000" type="number" className="mt-1.5" />
                </div>
                <div className="md:col-span-2">
                  <Label>Diagnosis Summary</Label>
                  <Textarea placeholder="Brief clinical summary of patient condition..." className="mt-1.5" rows={3} />
                </div>
                <div className="md:col-span-2">
                  <Label>Treatment Plan</Label>
                  <Textarea placeholder="Proposed treatment plan and timeline..." className="mt-1.5" rows={3} />
                </div>
                <div>
                  <Label>Medical Reports (PDF)</Label>
                  <Input type="file" accept=".pdf" className="mt-1.5" />
                </div>
                <div>
                  <Label>Financial Background Proof</Label>
                  <Input type="file" accept=".pdf,.jpg,.png" className="mt-1.5" />
                </div>
                <div>
                  <Label>Patient Payment QR Code</Label>
                  <Input type="file" accept=".png,.jpg,.jpeg,.svg" className="mt-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">Upload UPI/Bank QR code for direct patient payments</p>
                </div>
              </div>
              <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Upload className="w-4 h-4 mr-2" /> Submit Case for AI Review
              </Button>
            </>
          ) : (
            <div className="p-6 bg-muted/10 rounded-md">
              <p className="text-sm text-muted-foreground">Your hospital is pending verification. You cannot submit patient cases until approved by an admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalPortal;

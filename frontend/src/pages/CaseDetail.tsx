import { useParams, useNavigate } from "react-router-dom";
import { getCaseById, formatCurrency } from "@/lib/cases";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const c = id ? getCaseById(id) : null;

  if (!c) {
    return (
      <div className="py-10 container">
        <p className="text-muted-foreground">Case not found.</p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  return (
    <div className="py-10 container max-w-4xl">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-6 gap-6 flex-col md:flex-row">
          <div className="flex-1">
            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
            <h1 className="text-2xl font-bold text-foreground mt-1">{c.disease}</h1>
            <p className="text-sm text-muted-foreground mt-1">{c.hospital}</p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Patient</h3>
              <p className="text-sm text-muted-foreground">{c.patient?.name}, age {c.patient?.age}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Case Description</h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </div>

            {c.documents && c.documents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {c.documents.map((d: any, idx: number) => (
                    <li key={idx}><a className="text-accent underline" href={d.href || '#'} target="_blank" rel="noreferrer">{d.name || `Document ${idx+1}`}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="mb-4 text-right">
              {c.verified && (
                <div className="inline-flex items-center gap-2 text-success bg-success/10 px-3 py-1 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>

            <div className="mb-4 text-right">
              <p className="text-sm text-muted-foreground">Required</p>
              <p className="text-lg font-semibold">{formatCurrency(c.required)}</p>
              <p className="text-sm text-muted-foreground">Collected</p>
              <p className="text-lg font-semibold">{formatCurrency(c.collected)}</p>
              <div className="mt-2">
                <Progress value={Math.min(100, Math.round((c.collected / c.required) * 100))} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{Math.round((c.collected / c.required) * 100)}% funded</p>
              </div>
            </div>

            <div className="mt-2 text-right">
              <p className="text-sm text-muted-foreground">Urgency</p>
              <p className="font-medium">{c.urgency}</p>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
          <Button onClick={() => alert('Donate flow not implemented')}>Donate</Button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;

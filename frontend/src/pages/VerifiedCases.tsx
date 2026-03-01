import { CheckCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Link } from "react-router-dom";
import { casesData, formatCurrency, formatCurrencyWithPercent } from "@/lib/cases";

const diseases = ["All", "Cancer", "Cardiac", "Kidney", "Liver", "Neurological"];

const urgencyColor = (u: string) => {
  if (u === "Critical") return "text-destructive bg-destructive/10";
  if (u === "High") return "text-accent bg-accent/10";
  return "text-muted-foreground bg-muted";
};

const VerifiedCases = () => {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? casesData : casesData.filter(c => c.disease === filter);
  return (
    <div className="py-10">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Verified Cases</h1>
          <p className="text-muted-foreground">Only AI-approved, hospital-verified cases are listed. All funding is tracked transparently.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {diseases.map(d => (
            <Button
              key={d}
              size="sm"
              variant={filter === d ? "default" : "outline"}
              className={filter === d ? "bg-primary text-primary-foreground" : ""}
              onClick={() => setFilter(d)}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Case Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => {
            const percent = Math.round((c.collected / c.required) * 100);
            const isComplete = percent >= 100;
            return (
              <Link to={`/cases/${c.id}`} key={c.id} className="block">
                <div
                  className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <h3 className="text-lg font-semibold text-foreground mt-0.5">{c.disease}</h3>
                    <p className="text-sm text-muted-foreground">{c.hospital}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {c.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyColor(c.urgency)}`}>
                      {c.urgency}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="text-sm text-muted-foreground">
                      <div>Collected: <span className="font-semibold text-foreground">{formatCurrency(c.collected)}</span></div>
                      <div className="text-xs text-muted-foreground">{percent}% of required</div>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      <div>Required: <span className="font-semibold text-foreground">{formatCurrency(c.required)}</span></div>
                      <div className="text-xs text-muted-foreground">{isComplete ? <span className="text-success">Fully Funded ✓</span> : 'Needs funding'}</div>
                    </div>
                  </div>
                  <Progress value={Math.min(percent, 100)} className="h-2" />
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerifiedCases;

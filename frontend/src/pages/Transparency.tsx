import { BarChart3, PieChart, CheckCircle, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, casesData } from "@/lib/cases";

const Transparency = () => {
  // compute totals from case data
  const totalRequired = casesData.reduce((s, c) => s + c.required, 0);
  const totalCollected = casesData.reduce((s, c) => s + c.collected, 0);

  // derive funding (collected + required) by disease from the canonical casesData
  const fundingMap = casesData.reduce<Record<string, { collected: number; required: number }>>((acc, c) => {
    if (!acc[c.disease]) acc[c.disease] = { collected: 0, required: 0 };
    acc[c.disease].collected += c.collected;
    acc[c.disease].required += c.required;
    return acc;
  }, {});

  const fundingByDisease = Object.entries(fundingMap)
    .map(([d, v]) => ({ disease: d, collected: v.collected, required: v.required }))
    // sort descending so the largest collected categories appear first
    .sort((a, b) => b.collected - a.collected);

  const totalFunding = fundingByDisease.reduce((s, d) => s + d.collected, 0);

  const metrics = [
    { label: "Total Cases Funded", value: String(casesData.length), sub: "89% success rate" },
    { label: "Average Fund Time", value: "14 days", sub: "From verification to full funding" },
    { label: "Total Collected", value: formatCurrency(totalCollected), sub: "Across partner hospitals" },
    { label: "Total Required", value: formatCurrency(totalRequired), sub: "Across listed cases" },
  ];

  return (
    <div className="py-10">
      <div className="container max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-accent" /> Transparency & Analytics
          </h1>
          <p className="text-muted-foreground">Real-time funding metrics, distribution data, and platform trust indicators.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {metrics.map((m, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5">
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

  {/* Total Funds chart intentionally removed */}

        {/* Funding Distribution */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-accent" /> Funding Distribution by Disease
          </h2>
          <div className="space-y-4">
            {fundingByDisease.map((d, i) => {
              const derivedPercent = totalFunding > 0 ? Math.round((d.collected / totalFunding) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{d.disease}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(d.collected)} collected • Required {formatCurrency(d.required)}
                    </span>
                  </div>
                  <Progress value={derivedPercent} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> Trust Indicators
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "All hospitals verified through government registration databases",
              "AI cost validation against national medical benchmarks",
              "Duplicate case detection across partner network",
              "Complete audit trail for every transaction",
              "Monthly third-party financial audits",
              "Real-time fund tracking from collection to disbursement",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparency;

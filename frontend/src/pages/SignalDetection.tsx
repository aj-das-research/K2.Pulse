import { useState } from "react";
import { Search, RotateCcw, Download, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const signals = [
  { id: "SIG-0847", severity: "CRITICAL", drugs: "Rivaroxaban + Aspirin", event: "GI Haemorrhage", causality: "Probable", ror: "3.42 (2.1-5.6)", cases: 847, confidence: 94, status: "New", time: "1h ago" },
  { id: "SIG-0846", severity: "HIGH", drugs: "Metformin + Dapagliflozin", event: "Lactic Acidosis", causality: "Possible", ror: "2.87 (1.8-4.2)", cases: 312, confidence: 87, status: "Under Review", time: "2h ago" },
  { id: "SIG-0845", severity: "HIGH", drugs: "Warfarin + Amiodarone", event: "INR Elevation", causality: "Probable", ror: "4.12 (3.0-5.7)", cases: 1203, confidence: 82, status: "Confirmed", time: "4h ago" },
  { id: "SIG-0844", severity: "MEDIUM", drugs: "Atorvastatin + Clarithromycin", event: "Rhabdomyolysis", causality: "Possible", ror: "2.15 (1.4-3.3)", cases: 198, confidence: 71, status: "Under Review", time: "6h ago" },
  { id: "SIG-0843", severity: "MEDIUM", drugs: "Lisinopril + Spironolactone", event: "Hyperkalaemia", causality: "Probable", ror: "3.01 (2.2-4.1)", cases: 534, confidence: 65, status: "New", time: "8h ago" },
  { id: "SIG-0842", severity: "HIGH", drugs: "Clopidogrel + Omeprazole", event: "Reduced Efficacy", causality: "Certain", ror: "1.89 (1.3-2.8)", cases: 2104, confidence: 91, status: "Confirmed", time: "12h ago" },
  { id: "SIG-0841", severity: "LOW", drugs: "Amlodipine + Simvastatin", event: "Myopathy", causality: "Possible", ror: "1.54 (1.1-2.2)", cases: 89, confidence: 52, status: "Dismissed", time: "1d ago" },
  { id: "SIG-0840", severity: "MEDIUM", drugs: "Fluoxetine + Tramadol", event: "Serotonin Syndrome", causality: "Probable", ror: "5.23 (3.4-8.1)", cases: 276, confidence: 78, status: "New", time: "1d ago" },
];

const sevColor: Record<string, string> = {
  CRITICAL: "bg-destructive text-destructive-foreground",
  HIGH: "bg-warning text-warning-foreground",
  MEDIUM: "bg-secondary text-secondary-foreground",
  LOW: "bg-primary text-primary-foreground",
};

const statusStyles: Record<string, string> = {
  New: "border-primary/60 text-primary bg-transparent",
  "Under Review": "border-warning/60 text-warning bg-transparent",
  Confirmed: "border-success/60 text-success bg-success/10",
  Dismissed: "border-muted-foreground/40 text-muted-foreground/70 bg-transparent opacity-70",
};

const columns = ["Signal ID", "Severity", "Drug(s)", "Adverse Event", "Causality", "ROR (95% CI)", "Cases", "Confidence", "Status", "Detected"];

const SignalDetection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol] = useState("Detected");
  const [sortDir] = useState<"desc" | "asc">("desc");

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="glass-card p-4 flex items-center gap-3 flex-wrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <select className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground">
          <option>All Drug Classes</option>
          <option>Anticoagulants</option>
          <option>Antidiabetics</option>
          <option>Statins</option>
          <option>ACE Inhibitors</option>
        </select>
        <select className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground">
          <option>Last 30d</option>
          <option>Last 24h</option>
          <option>Last 7d</option>
          <option>Last 90d</option>
        </select>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground" />
          <input
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-40"
            placeholder="Filter by drug name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Data table */}
      <div className="glass-card overflow-hidden">
        {/* Export button */}
        <div className="flex justify-end px-4 pt-3">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
            <Download className="h-3 w-3" /> Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left">
                {columns.map((h) => {
                  const isActive = h === sortCol;
                  return (
                    <th key={h} className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer group select-none hover:text-foreground transition-colors">
                      <span className="inline-flex items-center gap-1">
                        {h}
                        {isActive ? (
                          sortDir === "desc" ? <ArrowDown className="h-3 w-3 text-primary" /> : <ArrowUp className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {signals.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/50 transition-colors cursor-pointer group/row"
                  style={{ }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,170,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-4 py-3 font-mono text-primary group-hover/row:underline">{s.id}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sevColor[s.severity]}`}>{s.severity}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{s.drugs}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.event}</td>
                  <td className="px-4 py-3">
                    <span className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{s.causality}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground">{s.ror}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{s.cases.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-[60px] rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.confidence}%` }} />
                      </div>
                      <span className="font-mono text-muted-foreground">{s.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${statusStyles[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-[11px] text-muted-foreground">Showing 1-8 of 23 signals</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`h-6 w-6 rounded text-[10px] font-medium ${p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetection;

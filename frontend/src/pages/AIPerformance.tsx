import { useState } from "react";
import { MessageSquare, CheckCircle2, TrendingDown, Clock, Search } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const kpis = [
  { label: "Total Feedback Received", value: "247", icon: MessageSquare, color: "#00D4AA" },
  { label: "Corrections Applied", value: "189", sub: "76.5% acceptance rate", icon: CheckCircle2, color: "#10B981" },
  { label: "Current Error Rate", value: "3.2%", sub: "↓ from 11.7% at launch", icon: TrendingDown, color: "#10B981" },
  { label: "Avg Review Response", value: "< 2 min", sub: "AI self-review turnaround", icon: Clock, color: "#00D4AA" },
];

const errorRateData = [
  { week: "Wk 1", rate: 11.7 }, { week: "Wk 2", rate: 10.2 }, { week: "Wk 3", rate: 9.1 },
  { week: "Wk 4", rate: 8.3 }, { week: "Wk 5", rate: 7.1 }, { week: "Wk 6", rate: 6.4 },
  { week: "Wk 7", rate: 5.5 }, { week: "Wk 8", rate: 4.8 }, { week: "Wk 9", rate: 4.1 },
  { week: "Wk 10", rate: 3.9 }, { week: "Wk 11", rate: 3.5 }, { week: "Wk 12", rate: 3.2 },
];

const failureModes = [
  { name: "Dechallenge Overweighting", count: 42, reduction: "−67%" },
  { name: "Temporal Misattribution", count: 38, reduction: "−54%" },
  { name: "Incomplete Drug Profile", count: 31, reduction: "−41%" },
  { name: "CYP Interaction Missed", count: 28, reduction: "−23%" },
  { name: "Severity Overestimation", count: 19, reduction: "−12%" },
];

type FeedbackStatus = "Correction Applied ✓" | "AI Review Complete" | "Under Review" | "Clinician Disagreed";

const feedbackLog: { caseId: string; step: string; error: string; clinician: string; status: FeedbackStatus; statusColor: string; time: string }[] = [
  { caseId: "AE-2024-89231", step: "Step 4: WHO-UMC", error: "Wrong causality level", clinician: "Dr. S. Chen", status: "Correction Applied ✓", statusColor: "text-success", time: "2h ago" },
  { caseId: "AE-2024-88974", step: "Step 3: Mechanism", error: "Missed drug interaction", clinician: "Dr. J. Liu", status: "AI Review Complete", statusColor: "text-primary", time: "5h ago" },
  { caseId: "AE-2024-88651", step: "Step 6: Verdict", error: "Severity overestimation", clinician: "Dr. A. Patel", status: "Correction Applied ✓", statusColor: "text-success", time: "1d ago" },
  { caseId: "AE-2024-88502", step: "Step 2: Temporal", error: "Temporal misattribution", clinician: "Dr. S. Chen", status: "Under Review", statusColor: "text-warning", time: "1d ago" },
  { caseId: "AE-2024-88341", step: "Step 5: Cross-Ref", error: "Incomplete cross-reference", clinician: "Dr. M. Wong", status: "Correction Applied ✓", statusColor: "text-success", time: "2d ago" },
  { caseId: "AE-2024-88105", step: "Step 3: Mechanism", error: "CYP interaction missed", clinician: "Dr. J. Liu", status: "Clinician Disagreed", statusColor: "text-destructive", time: "3d ago" },
];

const improvements = [
  { title: "Rule Update #47: Dechallenge criteria tightened", desc: 'When patient outcome is fatal and drug discontinuation coincides with death, classify dechallenge as "Not assessable".', applied: "3 days ago", impact: "Reduced related errors by 67%" },
  { title: "Rule Update #46: CYP3A4 interaction expanded", desc: "Added 12 additional CYP3A4 substrate drugs to the interaction checking matrix.", applied: "1 week ago", impact: "Reduced missed interactions by 23%" },
  { title: "Rule Update #45: Temporal window calibration", desc: "Extended default temporal plausibility window from 14 to 30 days for drugs with long half-lives (>24h).", applied: "2 weeks ago", impact: "Reduced temporal misattribution by 54%" },
];

const statusFilters = [
  { label: "All", value: "all", color: "" },
  { label: "Pending Review", value: "Under Review", color: "bg-warning/20 text-warning border-warning/40" },
  { label: "Correction Applied", value: "Correction Applied ✓", color: "bg-success/20 text-success border-success/40" },
  { label: "Disputed", value: "Clinician Disagreed", color: "bg-destructive/20 text-destructive border-destructive/40" },
];

function AnimatedKPI({ value }: { value: string }) {
  const animated = useCountUp(value, 1200);
  return <>{animated}</>;
}

const AIPerformance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLog = feedbackLog.filter((r) => {
    const matchesSearch = !searchQuery || 
      r.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clinician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.error.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || r.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</p>
                <Icon className="h-4 w-4" style={{ color: k.color }} />
              </div>
              <p className="text-xl font-bold font-mono text-foreground"><AnimatedKPI value={k.value} /></p>
              {k.sub && <p className="text-[10px] text-muted-foreground mt-1">{k.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Error Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={errorRateData}>
              <defs>
                <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[0, 15]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "hsl(220 40% 6%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} formatter={(value: number) => [`${value}%`, "Error Rate"]} />
              <ReferenceLine y={5} stroke="#6B7280" strokeDasharray="6 4" label={{ value: "Target threshold", fill: "#6B7280", fontSize: 9, position: "right" }} />
              <Line type="monotone" dataKey="rate" stroke="#00D4AA" strokeWidth={2} dot={{ r: 3, fill: "#00D4AA" }} fill="url(#errorGrad)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Feedback by Error Category</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Top Failure Modes (showing reduction since launch)</p>
          <div className="space-y-3">
            {failureModes.map((f) => {
              const maxCount = 42;
              const pct = (f.count / maxCount) * 100;
              const isAmber = f.reduction === "−12%";
              return (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-[160px] shrink-0 text-right">{f.name}</span>
                  <div className="flex-1 h-5 rounded bg-muted/30 relative overflow-hidden">
                    <div className="h-full rounded bg-primary/60" style={{ width: `${pct}%` }} />
                    <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-mono font-bold text-foreground">{f.count}</span>
                  </div>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${isAmber ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"}`}>{f.reduction}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Feedback Log */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Feedback Log</h3>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Case ID, clinician, or error type..."
              className="bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/50 outline-none w-full"
            />
          </div>
          <div className="flex gap-1">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-full px-2.5 py-1 text-[9px] font-medium border transition-colors ${
                  activeFilter === f.value
                    ? f.color || "bg-primary/15 text-primary border-primary/30"
                    : "bg-muted/20 text-muted-foreground border-border hover:bg-muted/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-left">
              {["Case ID", "Step Flagged", "Error Type", "Clinician", "Status", "Submitted"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLog.map((r, i) => {
              const isHighlighted = searchQuery && r.caseId.toLowerCase().includes(searchQuery.toLowerCase());
              return (
                <tr key={i} className={`border-b border-border/30 transition-colors ${isHighlighted ? "bg-primary/5" : "hover:bg-muted/20"}`}>
                  <td className="px-3 py-2.5 font-mono text-foreground">{r.caseId}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.step}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.error}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.clinician}</td>
                  <td className="px-3 py-2.5"><span className={`text-[10px] font-medium ${r.statusColor}`}>{r.status}</span></td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.time}</td>
                </tr>
              );
            })}
            {filteredLog.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground text-[11px]">No matching feedback items</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* System Improvement Actions */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">System Improvement Actions</h3>
        <div className="space-y-3">
          {improvements.map((imp, i) => (
            <div key={i} className="rounded-lg border border-border p-3" style={{ borderLeftWidth: 3, borderLeftColor: "#00D4AA", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs font-medium text-foreground">{imp.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{imp.desc}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground">Applied: {imp.applied}</span>
                <span className="text-[10px] font-medium text-primary">{imp.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPerformance;

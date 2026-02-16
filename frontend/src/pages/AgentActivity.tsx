import { useState } from "react";
import { Download, Brain, CheckCircle2 } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const agents = [
  {
    name: "SentinelAgent",
    color: "#3B82F6",
    task: "Monitoring FDA FAERS API",
    lastRun: "3 min ago",
    metric: "Cases fetched today",
    metricVal: "2,847",
    health: 98,
    pills: ["Uptime: 99.8%", "Errors: 0", "Avg Latency: 1.2s"],
  },
  {
    name: "ReasonerAgent",
    color: "#00D4AA",
    task: "Processing case batch #B-4721",
    lastRun: "5 min ago",
    metric: "Queue",
    metricVal: "12 cases pending",
    health: 94,
    pills: ["Uptime: 99.4%", "Errors: 2", "Avg Latency: 4.2s"],
  },
  {
    name: "EpidemiologistAgent",
    color: "#8B5CF6",
    task: "Computing ROR for SIG-0847",
    lastRun: "8 min ago",
    metric: "Avg processing time",
    metricVal: "4.2s",
    health: 97,
    pills: ["Uptime: 99.7%", "Errors: 0", "Avg Latency: 2.8s"],
  },
];

const allLogs = [
  { agent: "Sentinel", color: "#3B82F6", action: "Fetched 142 new FAERS reports from FDA API", time: "3 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Analyzing case #AE-2024-89231: Rivaroxaban interaction", time: "5 min ago" },
  { agent: "Epidemiologist", color: "#8B5CF6", action: "Completed ROR analysis for Signal SIG-0847", time: "8 min ago" },
  { agent: "Sentinel", color: "#3B82F6", action: "Monitoring PubMed — 3 new pharmacovigilance articles found", time: "12 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Generated causality assessment for case batch #B-4721", time: "15 min ago" },
  { agent: "Epidemiologist", color: "#8B5CF6", action: "Updated PRR statistics for warfarin signal cluster", time: "22 min ago" },
  { agent: "Sentinel", color: "#3B82F6", action: "Checked DrugBank API for new interaction data", time: "25 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Applied WHO-UMC criteria to 34 pending cases", time: "28 min ago" },
  { agent: "Sentinel", color: "#3B82F6", action: "Scanned MedWatch RSS feed — 0 new safety alerts", time: "32 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Flagged borderline case #AE-2024-91102 for manual review", time: "38 min ago" },
  { agent: "Epidemiologist", color: "#8B5CF6", action: "Recalculated baseline PRR for anticoagulant drug class", time: "45 min ago" },
  { agent: "Sentinel", color: "#3B82F6", action: "Verified DrugBank API connection — 14,589 interactions indexed", time: "51 min ago" },
  { agent: "Epidemiologist", color: "#8B5CF6", action: "Recalculated PRR for atorvastatin-clarithromycin cluster", time: "55 min ago" },
  { agent: "Sentinel", color: "#3B82F6", action: "Downloaded 89 new MedWatch reports", time: "1h ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Completed NLP extraction on 67 narrative reports", time: "1h ago" },
  { agent: "Epidemiologist", color: "#8B5CF6", action: "Generated time-series analysis for clopidogrel signals", time: "1.5h ago" },
];

const summaryStats = [
  { label: "Total Actions (24h)", value: "1,247" },
  { label: "Cases Processed", value: "189" },
  { label: "Signals Generated", value: "23" },
  { label: "API Calls", value: "4,891" },
];

function getActionIcon(action: string) {
  const lower = action.toLowerCase();
  if (/fetched|monitoring|checked|scanned|downloaded|verified/.test(lower)) {
    return Download;
  }
  if (/analyzing|processing|applied|flagged/.test(lower)) {
    return Brain;
  }
  return CheckCircle2;
}

function HealthRing({ percent, color, size = 40 }: { percent: number; color: string; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const animatedPercent = useCountUp(`${percent}`, 1200);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-foreground">
          {animatedPercent}%
        </span>
      </div>
      <span className="text-[8px] text-muted-foreground">Health</span>
    </div>
  );
}

function AnimatedMetricVal({ value }: { value: string }) {
  const animated = useCountUp(value, 1200);
  return <>{animated}</>;
}

const AgentActivity = () => {
  const [filter, setFilter] = useState("All Agents");
  const filtered = filter === "All Agents" ? allLogs : allLogs.filter((l) => l.agent === filter);

  return (
    <div className="space-y-4">
      {/* Agent cards */}
      <div className="grid grid-cols-3 gap-4">
        {agents.map((a) => (
          <div
            key={a.name}
            className="glass-card p-4 relative overflow-hidden"
            style={{ borderTop: `3px solid ${a.color}` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success pulse-dot" />
                <span className="text-sm font-medium text-foreground">{a.name}</span>
                <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot inline-block" />
                  Active
                </span>
              </div>
              {/* Health ring */}
              <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
                <HealthRing percent={a.health} color={a.color} />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Current Task</p>
                <p className="text-xs text-foreground">{a.task}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">Last Run</p>
                  <p className="text-xs font-mono text-foreground">{a.lastRun}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{a.metric}</p>
                  <p className="text-xs font-mono text-foreground"><AnimatedMetricVal value={a.metricVal} /></p>
                </div>
              </div>
            </div>

            {/* Stat pills */}
            <div className="flex gap-1.5 mt-3 pt-3 border-t border-border">
              {a.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-md bg-muted/50 px-2 py-1 text-[9px] text-muted-foreground font-mono"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stat bar */}
      <div className="glass-card flex items-center justify-between px-5 py-3">
        {summaryStats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
              <p className="text-sm font-bold font-mono text-foreground">{s.value}</p>
            </div>
            {i < summaryStats.length - 1 && (
              <div className="h-8 w-px bg-border ml-3" />
            )}
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Activity Log</h3>
          <select
            className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-foreground"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All Agents</option>
            <option>Sentinel</option>
            <option>Reasoner</option>
            <option>Epidemiologist</option>
          </select>
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((l, i) => {
            const ActionIcon = getActionIcon(l.action);
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-3 py-2 border-l-2 hover:bg-muted/20 transition-colors"
                style={{ borderColor: l.color }}
              >
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: l.color + "20" }}
                >
                  <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-foreground">{l.agent}</span>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <ActionIcon className="h-3 w-3 shrink-0" style={{ color: l.color }} />
                    <span className="truncate">{l.action}</span>
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{l.time}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-border text-center">
          <button className="text-xs text-primary hover:underline">Load more activity →</button>
        </div>
      </div>
    </div>
  );
};

export default AgentActivity;

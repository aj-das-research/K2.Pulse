import { Activity, AlertTriangle, ShieldAlert, Bot, ArrowUpRight, ChevronRight, RefreshCw } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const kpis = [
  { label: "Cases Processed (24h)", value: "2,847", change: "+12.3%", sub: "vs. previous 24h", icon: Activity, color: "text-primary", positive: true },
  { label: "Active Signals", value: "23", change: "", sub: "7 new today", icon: AlertTriangle, color: "text-warning", critical: false },
  { label: "Critical Alerts", value: "3", change: "", sub: "Requires immediate review", icon: ShieldAlert, color: "text-destructive", critical: true },
  { label: "Agent Uptime", value: "99.7%", change: "", sub: "Last 30 days", icon: Bot, color: "text-primary" },
];

const timelineData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  newSignals: Math.floor(Math.random() * 8) + 2,
  resolved: Math.floor(Math.random() * 6) + 1,
}));

const severityData = [
  { name: "Critical", value: 3, color: "#EF4444" },
  { name: "High", value: 6, color: "#F59E0B" },
  { name: "Medium", value: 9, color: "#6366F1" },
  { name: "Low", value: 5, color: "#00D4AA" },
];

const recentSignals = [
  { severity: "CRITICAL", drug: "Rivaroxaban + Aspirin", event: "GI Haemorrhage", confidence: 94, time: "1h ago" },
  { severity: "HIGH", drug: "Metformin + Dapagliflozin", event: "Lactic Acidosis", confidence: 87, time: "2h ago" },
  { severity: "HIGH", drug: "Warfarin + Amiodarone", event: "INR Elevation", confidence: 82, time: "4h ago" },
  { severity: "MEDIUM", drug: "Atorvastatin + Clarithromycin", event: "Rhabdomyolysis", confidence: 71, time: "6h ago" },
  { severity: "MEDIUM", drug: "Lisinopril + Spironolactone", event: "Hyperkalaemia", confidence: 65, time: "8h ago" },
];

const activityFeed = [
  { agent: "Sentinel", color: "#6366F1", action: "Fetched 142 new FAERS reports from FDA API", time: "3 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Analyzing case #AE-2024-89231: Rivaroxaban interaction", time: "5 min ago" },
  { agent: "Epidemiologist", color: "#A855F7", action: "Completed ROR analysis for Signal SIG-0847", time: "8 min ago" },
  { agent: "Sentinel", color: "#6366F1", action: "Monitoring PubMed — 3 new pharmacovigilance articles found", time: "12 min ago" },
  { agent: "Reasoner", color: "#00D4AA", action: "Generated causality assessment for case batch #B-4721", time: "15 min ago" },
  { agent: "Epidemiologist", color: "#A855F7", action: "Updated PRR statistics for warfarin signal cluster", time: "22 min ago" },
];

const severityColor: Record<string, string> = {
  CRITICAL: "bg-destructive text-destructive-foreground",
  HIGH: "bg-warning text-warning-foreground",
  MEDIUM: "bg-secondary text-secondary-foreground",
  LOW: "bg-primary text-primary-foreground",
};

const severityBorder: Record<string, string> = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#6366F1",
  LOW: "#00D4AA",
};

function KpiValue({ value, critical, color }: { value: string; critical?: boolean; color: string }) {
  const animated = useCountUp(value, 1200);
  return (
    <span className={`text-2xl font-bold font-mono ${critical ? "text-destructive" : color}`}>
      {animated}
    </span>
  );
}

const Dashboard = () => {
  const [period, setPeriod] = useState("30D");

  return (
    <div className="space-y-6">
      {/* Last Updated */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground">
        <RefreshCw className="h-3 w-3" />
        <span className="text-[11px]">Last updated: 2 min ago</span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`relative glass-card p-4 ${k.critical ? "glow-red" : ""}`}
          >
            {k.critical && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(239,68,68,0.1) 0%, transparent 70%)",
                }}
              />
            )}
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </div>
            <div className="relative flex items-end gap-2">
              <KpiValue value={k.value} critical={k.critical} color={k.color} />
              {k.change && (
                <span className="flex items-center text-xs text-success mb-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {k.change}
                </span>
              )}
            </div>
            <p className="relative text-[11px] text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Section separator */}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Signal Detection Timeline</h3>
            <div className="flex gap-1">
              {["7D", "30D", "90D"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${
                    period === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1a1f2e" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="newSignals" stroke="#00D4AA" strokeWidth={2} fill="url(#tealGradient)" dot={false} name="New Signals" />
              <Area type="monotone" dataKey="resolved" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">Signal Severity Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" strokeWidth={0}>
                    {severityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-foreground">23</span>
                <span className="text-[10px] text-muted-foreground">Total Signals</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {severityData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px] text-muted-foreground">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section separator */}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Signals</h3>
          <div className="space-y-2">
            {recentSignals.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer group border-l-2" style={{ borderColor: severityBorder[s.severity] }}>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${severityColor[s.severity]}`}>
                  {s.severity}
                </span>
                <span className="text-sm font-medium text-foreground flex-shrink-0">{s.drug}</span>
                <span className="text-xs text-muted-foreground truncate">{s.event}</span>
                <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                  <div className="w-16">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.confidence}%`,
                          background: "linear-gradient(to right, hsl(163 100% 42%), transparent)",
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono">{s.confidence}%</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{s.time}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-primary hover:underline">View All Signals →</button>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium text-foreground">Live Agent Activity Feed</h3>
            <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
              <span className="text-[9px] font-medium text-success">Live</span>
            </div>
          </div>
          <div className="space-y-2">
            {activityFeed.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-3 py-2 border-l-2 animate-slide-in-feed"
                style={{ borderColor: a.color, animationDelay: `${i * 80}ms`, background: i % 2 === 1 ? "rgba(255,255,255,0.01)" : "transparent" }}
              >
                <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + "20" }}>
                  <div className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-foreground">{a.agent}</span>
                  <p className="text-[11px] text-muted-foreground truncate">{a.action}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-auto">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import { X, FileText, Send, MessageSquare, Mail } from "lucide-react";

const alerts = [
  {
    priority: "critical",
    color: "#EF4444",
    title: "CRITICAL: Fatal GI haemorrhage signal — Rivaroxaban + Aspirin",
    desc: "Signal SIG-0847 requires immediate safety officer review. ROR: 3.42 (CI: 2.1-5.6). Auto-escalated per critical signal protocol.",
    channel: "Telegram",
    channelColor: "#3B82F6",
    status: "Delivered ✓",
    statusColor: "text-success",
    time: "1h ago",
  },
  {
    priority: "critical",
    color: "#EF4444",
    title: "New fatal case detected — Case AE-2024-89231",
    desc: "67M patient, DVT indication, multi-drug regimen. ReasonerAgent causality assessment: Probable.",
    channel: "Slack",
    channelColor: "#8B5CF6",
    status: "Delivered ✓",
    statusColor: "text-success",
    time: "1h ago",
  },
  {
    priority: "high",
    color: "#F59E0B",
    title: "Signal status update — SIG-0845 upgraded to Confirmed",
    desc: "Warfarin + Amiodarone INR elevation signal. 1,203 supporting cases. EpidemiologistAgent ROR confirmed statistically significant.",
    channel: "Email",
    channelColor: "#6B7280",
    status: "Delivered ✓",
    statusColor: "text-success",
    time: "4h ago",
  },
  {
    priority: "high",
    color: "#F59E0B",
    title: "Weekly pharmacovigilance digest ready",
    desc: "23 active signals, 3 critical, 189 cases processed. Full report attached.",
    channel: "Telegram",
    channelColor: "#3B82F6",
    status: "Delivered ✓",
    statusColor: "text-success",
    time: "8h ago",
  },
  {
    priority: "info",
    color: "#00D4AA",
    title: "SentinelAgent: 3 new PubMed articles matched monitoring criteria",
    desc: "Articles related to rivaroxaban bleeding risk and statin-macrolide interactions.",
    channel: "Slack",
    channelColor: "#8B5CF6",
    status: "Delivered ✓",
    statusColor: "text-success",
    time: "12h ago",
  },
  {
    priority: "info",
    color: "#00D4AA",
    title: "EpidemiologistAgent completed batch ROR analysis",
    desc: "Recalculated disproportionality scores for 23 active signals. 2 signals upgraded.",
    channel: "Email",
    channelColor: "#6B7280",
    status: "Pending...",
    statusColor: "text-warning",
    time: "12h ago",
  },
];

const sentReports = [
  {
    title: "Signal Report: SIG-0847 — Rivaroxaban + Aspirin",
    recipient: "Dr. Sarah Chen, Chief Safety Officer",
    channel: "Telegram",
    channelColor: "#3B82F6",
    time: "1h ago",
    status: "Opened ✓",
  },
  {
    title: "Case Assessment: AE-2024-89231 — Fatal GI Haemorrhage",
    recipient: "Dr. Sarah Chen, Chief Safety Officer",
    channel: "Email",
    channelColor: "#6B7280",
    time: "1h ago",
    status: "Acknowledged ✓",
  },
  {
    title: "Weekly Pharmacovigilance Digest — Week 7, 2026",
    recipient: "Drug Safety Team (5 members)",
    channel: "Slack #pharmacovigilance",
    channelColor: "#8B5CF6",
    time: "8h ago",
    status: "Delivered ✓",
  },
  {
    title: "Signal Escalation: SIG-0845 — Warfarin + Amiodarone",
    recipient: "Dr. James Liu, VP Regulatory Affairs",
    channel: "Email",
    channelColor: "#6B7280",
    time: "4h ago",
    status: "Opened ✓",
  },
  {
    title: "MedWatch Draft Report: Rivaroxaban GI Bleeding Cluster",
    recipient: "Regulatory Filing Queue",
    channel: "System",
    channelColor: "#6B7280",
    time: "2h ago",
    status: "Pending Review",
  },
];

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [tab, setTab] = useState<"alerts" | "reports">("alerts");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[400px] border-l border-border transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          backgroundColor: "hsl(220 40% 6% / 0.97)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-sm font-bold text-foreground">Alerts & Reports</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 mb-4">
          {(["alerts", "reports"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {t === "alerts" ? "Alerts" : "Sent Reports"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 pb-16" style={{ height: "calc(100% - 120px)" }}>
          {tab === "alerts" ? (
            <div className="space-y-2.5">
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 p-3 hover:bg-muted/20 transition-colors cursor-pointer"
                  style={{ borderLeftWidth: 3, borderLeftColor: a.color, background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-medium text-foreground leading-snug">{a.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{a.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{a.desc}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-medium text-white"
                      style={{ background: a.channelColor }}
                    >
                      {a.channel}
                    </span>
                    <span className={`text-[10px] font-medium ${a.statusColor}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {sentReports.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 p-3 hover:bg-muted/20 transition-colors cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex items-start gap-2.5 mb-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground leading-snug">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Sent to: {r.recipient}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{r.time}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-medium text-white"
                      style={{ background: r.channelColor }}
                    >
                      {r.channel}
                    </span>
                    <span className="text-[10px] font-medium text-success">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 border-t border-border" style={{ background: "hsl(220 40% 6% / 0.95)" }}>
          <button className="text-[11px] text-primary hover:underline">Configure alert recipients →</button>
        </div>
      </div>
    </>
  );
}

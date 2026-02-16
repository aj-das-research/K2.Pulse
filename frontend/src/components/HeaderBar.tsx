import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { CommandKModal } from "./CommandKModal";
import { NotificationPanel } from "./NotificationPanel";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard > Overview",
  "/signals": "Signal Detection > Browse",
  "/case-analysis": "Case Analysis > Detail",
  "/interactions": "Drug Interactions > Network",
  "/literature": "Literature Monitor > Feed",
  "/agents": "Agent Activity > Monitor",
  "/ai-performance": "AI Performance > Analytics",
  "/settings": "Settings > Configuration",
};

const notifications = [
  { title: "CRITICAL: New signal detected", desc: "Rivaroxaban + Aspirin cluster", time: "1h ago", color: "#EF4444" },
  { title: "SentinelAgent completed", desc: "FAERS batch processing", time: "3h ago", color: "#00D4AA" },
  { title: "Signal SIG-0831 status changed", desc: "Status changed to Confirmed", time: "5h ago", color: "#F59E0B" },
  { title: "New PubMed article matched", desc: "Your monitoring criteria", time: "8h ago", color: "#6366F1" },
];

export function HeaderBar() {
  const location = useLocation();
  const breadcrumb = breadcrumbMap[location.pathname] || "Dashboard";
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [bellShake, setBellShake] = useState(false);

  // Bell shake every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 500);
    }, 30000);
    // Initial shake after 3s
    const initial = setTimeout(() => {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 500);
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdkOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  return (
    <>
      <header
        className="fixed top-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border px-6 transition-[left] duration-200"
        style={{ background: "#0D1117", left: "var(--sidebar-width, 240px)" }}
      >
        <span className="text-xs text-muted-foreground">{breadcrumb}</span>

        <button
          onClick={() => setCmdkOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 hover:bg-muted/70 transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Search drugs, signals, cases... ⌘K
          </span>
        </button>

        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button
            onClick={() => setPanelOpen(true)}
            className={`relative text-muted-foreground hover:text-foreground transition-colors ${bellShake ? "bell-shake" : ""}`}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              4
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
              AD
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background bg-success" />
            </div>
            <span className="text-xs text-foreground">Abhijit Das</span>
          </div>
        </div>
      </header>

      <CommandKModal open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}

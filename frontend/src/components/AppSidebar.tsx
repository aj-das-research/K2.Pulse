import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Search, FileText, GitBranch,
  BookOpen, Bot, TrendingUp, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";

const K2_ORANGE = "#ea580c";
/** Words that slide in from right and into R: Retrieve, Reason, Report */
const LOGO_WORDS = ["Retrieve", "Reason", "Report"];
const SLIDE_IN_MS = 500;
const HOLD_MS = 2800;   /* K2 R + word stay longer */
const SLIDE_OUT_MS = 500;

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Signal Detection", url: "/signals", icon: Search },
  { title: "Case Analysis", url: "/case-analysis", icon: FileText },
  { title: "Drug Interactions", url: "/interactions", icon: GitBranch },
  { title: "Literature Monitor", url: "/literature", icon: BookOpen },
  { title: "Agent Activity", url: "/agents", icon: Bot },
  { title: "AI Performance", url: "/ai-performance", icon: TrendingUp, badge: 3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const agents = [
  { name: "Sentinel", color: "bg-success" },
  { name: "Reasoner", color: "bg-primary" },
  { name: "Epidemiologist", color: "bg-secondary" },
];

type WordPhase = "entering" | "visible" | "exiting";

function LogoBlock({ visible }: { visible: boolean }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<WordPhase>("entering");

  useEffect(() => {
    if (phase === "entering") {
      const t = setTimeout(() => setPhase("visible"), SLIDE_IN_MS);
      return () => clearTimeout(t);
    }
    if (phase === "visible") {
      const t = setTimeout(() => setPhase("exiting"), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "exiting") {
      const t = setTimeout(() => {
        setWordIndex((i) => (i + 1) % LOGO_WORDS.length);
        setPhase("entering");
      }, SLIDE_OUT_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const word = LOGO_WORDS[wordIndex];
  const wordClass =
    phase === "entering"
      ? "logo-word-enter"
      : phase === "exiting"
        ? "logo-word-exit"
        : "";

  return (
    <div
      className="flex h-14 w-full items-center justify-center border-b border-border px-3 transition-opacity duration-150"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex items-baseline justify-center gap-1">
        {/* K2 R in a fixed-width block so they never shift */}
        <div className="flex shrink-0 items-baseline gap-0.5">
          <span
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: K2_ORANGE }}
          >
            K2
          </span>
          <span className="logo-r-pulse text-2xl font-bold tracking-tight sm:text-3xl">
            R
          </span>
        </div>
        {/* Fixed-width slot for sliding words so layout stays stable */}
        <div className="relative h-8 w-[6.5rem] shrink-0 overflow-hidden pl-1.5">
          <span
            key={word}
            className={`logo-word block text-base font-medium tracking-wide sm:text-lg ${wordClass}`}
          >
            {word}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const location = useLocation();

  // Sequential animation: labels fade out first, then width shrinks (and vice versa)
  useEffect(() => {
    if (collapsed) {
      // Collapsing: hide labels immediately, width animates via CSS
      setLabelsVisible(false);
    } else {
      // Expanding: width animates first, then show labels after delay
      const timer = setTimeout(() => setLabelsVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  // Update CSS variable for header positioning
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "64px" : "240px"
    );
  }, [collapsed]);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ background: "#0D1117" }}
    >
      {/* Logo – K2 R (name & logo) + words Retrieve | Reason | Report sliding in/into R */}
      {!collapsed ? (
        <LogoBlock visible={labelsVisible} />
      ) : (
        <div className="flex h-14 flex-col items-center justify-center gap-0 border-b border-border">
          <span className="text-lg font-bold" style={{ color: K2_ORANGE }}>K2</span>
          <span className="logo-r-pulse text-lg font-bold">R</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.url === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.url);
            return (
              <li key={item.url}>
                <NavLink
                  to={item.url}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="relative shrink-0">
                    <item.icon className="h-4 w-4" />
                    {(item as any).badge && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                        {(item as any).badge}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <span
                      className="transition-opacity duration-150"
                      style={{ opacity: labelsVisible ? 1 : 0 }}
                    >
                      {item.title}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Agent Status */}
      <div className="border-t border-border px-3 py-3">
        {!collapsed && (
          <p
            className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-opacity duration-150"
            style={{ opacity: labelsVisible ? 1 : 0 }}
          >
            System Status
          </p>
        )}
        <div className={collapsed ? "space-y-2" : "space-y-1"}>
          {agents.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${a.color} pulse-dot`} />
              {!collapsed && (
                <span
                  className="text-[11px] text-muted-foreground transition-opacity duration-150"
                  style={{ opacity: labelsVisible ? 1 : 0 }}
                >
                  {a.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 items-center justify-center border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, Zap, FileText, AlertTriangle, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentSearches = [
  { label: "Rivaroxaban", icon: Clock },
  { label: "SIG-0847", icon: Clock },
  { label: "Warfarin + Amiodarone", icon: Clock },
];

const quickActions = [
  { label: "New Case Analysis", icon: FileText, path: "/case-analysis" },
  { label: "View Critical Signals", icon: AlertTriangle, path: "/signals" },
  { label: "Check Agent Status", icon: Bot, path: "/agents" },
];

export function CommandKModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const allItems = [...recentSearches, ...quickActions];
  const filtered = query
    ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = useCallback(
    (index: number) => {
      const item = filtered[index];
      if (item && "path" in item) {
        navigate(item.path);
      }
      onClose();
    },
    [filtered, navigate, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        handleSelect(activeIndex);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [activeIndex, filtered.length, handleSelect, onClose]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const recentFiltered = filtered.filter((item) => !("path" in item));
  const actionsFiltered = filtered.filter((item) => "path" in item);

  let globalIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[600px] mx-4 rounded-xl overflow-hidden animate-scale-in"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drugs, signals, cases..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">No results found</p>
          )}

          {recentFiltered.length > 0 && (
            <div className="mb-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">Recent Searches</p>
              {recentFiltered.map((item) => {
                globalIndex++;
                const idx = globalIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      activeIndex === idx ? "bg-muted/50 text-foreground" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelect(idx)}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {actionsFiltered.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">Quick Actions</p>
              {actionsFiltered.map((item) => {
                globalIndex++;
                const idx = globalIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      activeIndex === idx ? "bg-muted/50 text-foreground" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelect(idx)}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

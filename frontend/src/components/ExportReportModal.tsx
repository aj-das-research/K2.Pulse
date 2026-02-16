import { useState, useRef, useEffect } from "react";
import { X, FileDown, Check, Loader2 } from "lucide-react";

const formats = [
  { id: "pdf", label: "PDF Report" },
  { id: "xml", label: "FDA MedWatch XML" },
  { id: "json", label: "JSON (Raw)" },
];

interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportReportModal({ open, onClose }: ExportReportModalProps) {
  const [format, setFormat] = useState("pdf");
  const [includeReasoning, setIncludeReasoning] = useState(true);
  const [includeFaers, setIncludeFaers] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setState("idle"); setFormat("pdf"); setIncludeReasoning(true); setIncludeFaers(false); }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleGenerate = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1000);
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-0 w-[320px] rounded-xl border border-border p-4 animate-scale-in z-50"
      style={{ background: "hsl(220 40% 6%)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-foreground">Export Case Report</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>

      {/* Format */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1.5">Format</p>
        <div className="flex flex-col gap-1">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors text-left ${
                format === f.id
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50"
              }`}
            >
              <div className={`h-2.5 w-2.5 rounded-full border-2 ${format === f.id ? "border-primary bg-primary" : "border-muted-foreground"}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeReasoning}
            onChange={(e) => setIncludeReasoning(e.target.checked)}
            className="rounded border-border bg-muted/30 h-3.5 w-3.5 accent-primary"
          />
          <span className="text-[11px] text-foreground">Include full AI reasoning chain</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeFaers}
            onChange={(e) => setIncludeFaers(e.target.checked)}
            className="rounded border-border bg-muted/30 h-3.5 w-3.5 accent-primary"
          />
          <span className="text-[11px] text-foreground">Include supporting FAERS cases</span>
        </label>
      </div>

      {/* Action */}
      <button
        onClick={state === "done" ? onClose : handleGenerate}
        disabled={state === "loading"}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
          state === "done"
            ? "bg-success text-success-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {state === "loading" && <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>}
        {state === "idle" && <><FileDown className="h-3.5 w-3.5" /> Generate Report</>}
        {state === "done" && <><Check className="h-3.5 w-3.5" /> Download Report ↓</>}
      </button>
    </div>
  );
}

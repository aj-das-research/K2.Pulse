import { useState, useRef, useEffect } from "react";
import { X, Send, Check, MessageSquare, Mail } from "lucide-react";

const channels = [
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "slack", label: "Slack", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
];

const priorities = [
  { id: "critical", label: "Critical", color: "bg-destructive text-destructive-foreground" },
  { id: "high", label: "High", color: "bg-warning/20 text-warning border border-warning/40" },
  { id: "standard", label: "Standard", color: "bg-muted text-muted-foreground" },
];

interface SendAlertModalProps {
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement>;
}

export function SendAlertModal({ open, onClose }: SendAlertModalProps) {
  const [channel, setChannel] = useState("telegram");
  const [priority, setPriority] = useState("critical");
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setSent(false); setChannel("telegram"); setPriority("critical"); }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 2000);
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 right-0 w-[320px] rounded-xl border border-border p-4 animate-scale-in z-50"
      style={{ background: "hsl(220 40% 6%)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-foreground">Send Alert</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>

      {/* Recipient */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1">Recipient</p>
        <div className="rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-[11px] text-foreground">
          Dr. Sarah Chen — Chief Safety Officer
        </div>
      </div>

      {/* Channel */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1">Channel</p>
        <div className="flex gap-1.5">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                  channel === c.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-muted/30 text-muted-foreground border border-border hover:bg-muted/50"
                }`}
              >
                <Icon className="h-3 w-3" /> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message preview */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1">Message Preview</p>
        <div className="rounded-md bg-muted/40 p-2.5 text-[10px] text-muted-foreground leading-relaxed">
          CRITICAL: Signal SIG-0847 confirmed. Rivaroxaban + Aspirin — fatal GI haemorrhage. WHO-UMC: Probable. ROR: 3.42. Full reasoning trace attached.
        </div>
      </div>

      {/* Priority */}
      <div className="mb-4">
        <p className="text-[10px] text-muted-foreground mb-1">Priority</p>
        <div className="flex gap-1.5">
          {priorities.map((p) => (
            <button
              key={p.id}
              onClick={() => setPriority(p.id)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                priority === p.id ? p.color + " ring-1 ring-offset-1 ring-offset-background ring-current" : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleSend}
        disabled={sent}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
          sent
            ? "bg-success text-success-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {sent ? <><Check className="h-3.5 w-3.5" /> Sent ✓</> : <><Send className="h-3.5 w-3.5" /> Send Alert</>}
      </button>
      <button onClick={onClose} className="w-full mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1">Cancel</button>
    </div>
  );
}

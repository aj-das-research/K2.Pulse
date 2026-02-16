import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Brain, X, Check, Bell, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const errorTypeOptions = [
  "Incorrect mechanism",
  "Wrong causality level",
  "Missed drug interaction",
  "Temporal analysis error",
  "Incomplete cross-reference",
  "Other",
];

const correctionOptions = ["Certain", "Probable", "Possible", "Unlikely", "Unassessable"];

interface StepFeedbackProps {
  stepIndex: number;
  stepTitle: string;
  onFeedbackSubmit: (stepIndex: number, errorType: string) => void;
  feedbackSubmitted: boolean;
  submittedErrorType?: string;
}

export function StepFeedbackButtons({ stepIndex, stepTitle, onFeedbackSubmit, feedbackSubmitted, submittedErrorType }: StepFeedbackProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errorType, setErrorType] = useState("");
  const [correction, setCorrection] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(feedbackSubmitted);
  const [localErrorType, setLocalErrorType] = useState(submittedErrorType || "");
  const navigate = useNavigate();

  const handleDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVote("down");
    setShowForm(true);
  };

  const handleUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVote(vote === "up" ? null : "up");
    if (showForm) setShowForm(false);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowForm(false);
    setSubmitted(true);
    setLocalErrorType(errorType);
    onFeedbackSubmit(stepIndex, errorType);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowForm(false);
    setVote(null);
  };

  return (
    <div>
      {/* Inline buttons - shown via group-hover on the parent */}
      {!submitted && (
        <div className="flex items-center gap-1 opacity-0 group-hover/step:opacity-50 hover:!opacity-100 transition-opacity">
          <button onClick={handleUp} className="p-0.5 rounded hover:bg-muted/50 transition-colors" title="Correct">
            <ThumbsUp className={`h-3.5 w-3.5 ${vote === "up" ? "text-primary" : "text-muted-foreground"}`} />
          </button>
          <button onClick={handleDown} className="p-0.5 rounded hover:bg-muted/50 transition-colors" title="Incorrect">
            <ThumbsDown className={`h-3.5 w-3.5 ${vote === "down" ? "text-destructive" : "text-muted-foreground"}`} />
          </button>
        </div>
      )}

      {/* Inline feedback form */}
      {showForm && (
        <div
          className="mt-2 mx-3 mb-1 p-3 rounded-lg border border-border animate-scale-in"
          style={{ background: "rgba(255,255,255,0.03)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] text-muted-foreground mb-2">What did the AI get wrong?</p>
          <select value={errorType} onChange={(e) => setErrorType(e.target.value)}
            className="w-full mb-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="" disabled>Error Type</option>
            {errorTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue..." rows={3}
            className="w-full mb-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          <select value={correction} onChange={(e) => setCorrection(e.target.value)}
            className="w-full mb-3 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="" disabled>What should the correct assessment be?</option>
            {correctionOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} className="rounded-md bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Submit Feedback</button>
            <button onClick={handleCancel} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Rich submitted confirmation card */}
      {submitted && !showForm && (
        <div
          className="mt-2 mx-3 mb-1 rounded-lg border border-border p-3 animate-fade-in"
          style={{ borderLeftWidth: 3, borderLeftColor: "#00D4AA", background: "rgba(0,212,170,0.04)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-foreground">
                Feedback submitted on Step {stepIndex + 1}: {stepTitle}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Error type: {localErrorType || "Not specified"} • Submitted 1 min ago
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex items-center gap-1 rounded-full bg-warning/20 border border-warning/40 px-2 py-0.5 text-[8px] font-medium text-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning pulse-dot" />
                  AI Review In Progress
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <button className="text-[9px] text-primary hover:underline">View Review Report</button>
              <button className="text-[9px] text-muted-foreground hover:text-foreground">Edit Feedback</button>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-border/30">
            <p className="text-[9px] text-muted-foreground">
              ✓ AI review report will be generated.{" "}
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/ai-performance"); }}
                className="text-primary underline hover:text-primary/80"
              >
                View in AI Performance →
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* Multi-step flagged summary strip */
export function FlaggedStepsSummary({ count }: { count: number }) {
  const navigate = useNavigate();
  if (count === 0) return null;
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3"
      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
    >
      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
      <span className="text-[10px] text-warning font-medium">
        {count} step{count > 1 ? "s" : ""} flagged for review on this case
      </span>
      <button
        onClick={() => navigate("/ai-performance")}
        className="ml-auto text-[10px] text-primary hover:underline"
      >
        View all feedback →
      </button>
    </div>
  );
}

/* Clinician Feedback Summary */
export function ClinicianFeedbackSection({ hasFeedback, onViewReport }: { hasFeedback: boolean; onViewReport: () => void }) {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-1.5 mb-3">
        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-foreground">Clinician Feedback</span>
      </div>
      {!hasFeedback ? (
        <p className="text-[11px] text-muted-foreground italic">No feedback on this case</p>
      ) : (
        <div className="rounded-lg border border-border p-3"
          style={{ borderLeftWidth: 3, borderLeftColor: "#F59E0B", background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[11px] font-medium text-foreground">Dr. Sarah Chen flagged Step 4: WHO-UMC Assessment</p>
          <p className="text-[10px] text-muted-foreground mt-1">Error type: Wrong causality level</p>
          <p className="text-[10px] text-muted-foreground">Suggested correction: Possible (instead of Probable)</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="rounded-full bg-warning/20 border border-warning/40 px-2 py-0.5 text-[9px] font-medium text-warning">AI Review Pending</span>
            <button onClick={onViewReport} className="text-[10px] text-primary hover:underline">View AI Review Report</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* AI Self-Review Report Modal */
export function AIReviewReportModal({ open, onClose, inProgress = false }: { open: boolean; onClose: () => void; inProgress?: boolean }) {
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);

  if (!open) return null;

  const handleAccept = () => {
    setAccepted(true);
    toast({ title: "Case assessment updated", description: "Thank you for improving PharmacoMind." });
    setTimeout(onClose, 1500);
  };

  const Skeleton = () => (
    <div className="space-y-2">
      <div className="h-2.5 rounded bg-muted/40 w-full animate-pulse" />
      <div className="h-2.5 rounded bg-muted/40 w-4/5 animate-pulse" />
      <div className="h-2.5 rounded bg-muted/40 w-3/5 animate-pulse" />
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[85vh] overflow-y-auto rounded-xl border border-border p-5 animate-scale-in"
        style={{ background: "hsl(220 40% 6%)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">AI Self-Review Report</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-[10px] text-muted-foreground font-mono mb-4">Case ID: AE-2024-89231</p>

        {inProgress ? (
          <div className="space-y-5">
            <div className="rounded-lg bg-warning/10 border border-warning/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-warning pulse-dot" />
                <p className="text-xs font-medium text-warning">ReasonerAgent is analyzing your feedback...</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Typical review time: &lt; 2 minutes</p>
            </div>
            <Section title="Original AI Assessment"><Skeleton /></Section>
            <Section title="Clinician Feedback"><Skeleton /></Section>
            <Section title="AI Error Analysis"><Skeleton /></Section>
            <Section title="Root Cause Classification"><Skeleton /></Section>
            <Section title="Corrected Assessment"><Skeleton /></Section>
            <div className="pt-3 border-t border-border">
              <button className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border px-4 py-2 text-xs text-foreground hover:bg-muted/60 transition-colors">
                <Bell className="h-3.5 w-3.5" /> Notify me when ready
              </button>
            </div>
          </div>
        ) : (
          <>
            <Section title="Original AI Assessment">
              K2 Think V2 concluded WHO-UMC causality as PROBABLE based on strong temporal correlation, pharmacological plausibility of dual anticoagulant/antiplatelet mechanism, and 847 matching FAERS cases.
            </Section>
            <Section title="Clinician Feedback">
              Dr. Sarah Chen flagged Step 4 (WHO-UMC Assessment) as having the wrong causality level. The clinician suggests the correct assessment should be POSSIBLE rather than PROBABLE, citing insufficient dechallenge evidence.
            </Section>
            <Section title="AI Error Analysis">
              The ReasonerAgent assigned PROBABLE causality based on strong temporal correlation and pharmacological plausibility. However, the clinician correctly identified that the dechallenge assessment was insufficient — the drug was discontinued at time of death, which does not constitute a positive dechallenge. With this correction, the temporal evidence alone is insufficient to distinguish PROBABLE from POSSIBLE under WHO-UMC criteria. The error originated from the agent's weighting of temporal plausibility relative to dechallenge evidence.
            </Section>
            <Section title="Root Cause Classification">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-full bg-warning/20 border border-warning/40 px-2 py-0.5 text-[9px] font-bold text-warning">Dechallenge Overweighting</span>
              </div>
              <p className="text-[10px] text-muted-foreground">This error pattern has been reported 12 times. System prompt has been updated to apply stricter dechallenge criteria.</p>
            </Section>
            <div className="mb-4 rounded-lg p-3 bg-primary/10 border border-primary/30">
              <p className="text-[10px] text-muted-foreground mb-0.5">Corrected Assessment</p>
              <p className="text-xs font-bold text-primary">WHO-UMC Causality: POSSIBLE <span className="text-muted-foreground font-normal">(revised from PROBABLE)</span></p>
            </div>
            <Section title="Improvement Action">
              Added explicit validation rule: When patient outcome is fatal and drug discontinuation coincides with death, dechallenge status must be classified as "Not assessable" rather than inferred.
            </Section>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Confidence in correction</span>
                <span className="text-[10px] font-bold font-mono text-primary">91%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "91%" }} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <button onClick={handleAccept} disabled={accepted}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all ${accepted ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                {accepted ? <><Check className="h-3.5 w-3.5" /> Accepted</> : "Accept Correction"}
              </button>
              <button className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">Still Disagree</button>
              <button onClick={onClose} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors">Close</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-medium text-foreground uppercase tracking-wider mb-1.5">{title}</p>
      <div className="text-[11px] text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

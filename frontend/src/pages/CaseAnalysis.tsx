import { useState } from "react";
import { Brain, FileDown, Send, Clipboard, Check } from "lucide-react";
import { SendAlertModal } from "@/components/SendAlertModal";
import { ExportReportModal } from "@/components/ExportReportModal";
import { StepFeedbackButtons, FlaggedStepsSummary, ClinicianFeedbackSection, AIReviewReportModal } from "@/components/CaseFeedback";

const medications = [
  { drug: "Rivaroxaban (Xarelto)", role: "Suspect", dose: "15mg BID", route: "Oral", indication: "DVT" },
  { drug: "Aspirin", role: "Suspect", dose: "81mg QD", route: "Oral", indication: "Prophylaxis" },
  { drug: "Metoprolol", role: "Concomitant", dose: "50mg BID", route: "Oral", indication: "Hypertension" },
  { drug: "Omeprazole", role: "Concomitant", dose: "20mg QD", route: "Oral", indication: "GERD" },
];

const reactions = [
  { name: "Gastrointestinal Haemorrhage", serious: true },
  { name: "Anaemia", serious: true },
  { name: "Haematochezia", serious: false },
  { name: "Respiratory Distress", serious: true },
];

const steps = [
  { title: "Criteria Parsing", summary: "Parsed 4 drugs, 4 reactions, 1 fatal outcome from FAERS report" },
  { title: "Temporal Analysis", summary: "Rivaroxaban started 2013-08-07, adverse event onset within treatment window. Temporal plausibility: HIGH" },
  { title: "Pharmacological Reasoning", summary: "",
    detail: `Rivaroxaban is a Factor Xa inhibitor metabolized via CYP3A4. Co-administration with aspirin (COX-1 inhibitor) creates dual antiplatelet/anticoagulant effect. This combination increases bleeding risk through complementary mechanisms: Rivaroxaban inhibits coagulation cascade at Factor Xa, while aspirin inhibits platelet aggregation via COX-1. The reported GI haemorrhage is pharmacologically plausible and well-documented in literature (RE-LY, ROCKET-AF post-hoc analyses).`,
  },
  { title: "WHO-UMC Assessment", summary: "", assessment: true },
  { title: "Cross-Reference", summary: "Matched 847 similar cases in FAERS database. Signal previously identified in FDA Drug Safety Communication (2014)." },
  { title: "Final Verdict", summary: "", verdict: true },
];

const CaseAnalysis = () => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([2, 3, 5]));
  const [sendOpen, setSendOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [feedbackSteps, setFeedbackSteps] = useState<Map<number, string>>(new Map());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewInProgress, setReviewInProgress] = useState(false);

  const toggleStep = (i: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleFeedbackSubmit = (stepIndex: number, errorType: string) => {
    setFeedbackSteps((prev) => new Map(prev).set(stepIndex, errorType));
  };

  const handleViewReport = (inProgress: boolean) => {
    setReviewInProgress(inProgress);
    setReviewModalOpen(true);
  };

  return (
    <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 80px)" }}>
      {/* Left Column - Sticky */}
      <div className="col-span-5 space-y-4 overflow-y-auto pr-1" style={{ height: "calc(100vh - 80px)" }}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-bold font-mono text-foreground">AE-2024-89231</span>
            <span className="rounded-full bg-warning/20 border border-warning/40 px-2 py-0.5 text-[10px] font-medium text-warning">Under Analysis</span>
            <span className="rounded-full bg-secondary/20 border border-secondary/40 px-2 py-0.5 text-[10px] font-medium text-secondary">FDA FAERS</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Physician</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Report Date: 2024-03-15</p>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Patient Profile</h3>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Age", value: "67" }, { label: "Sex", value: "Male" }, { label: "Weight", value: "101 kg" }].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold font-mono text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Medication List</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left">
                {["Drug", "Role", "Dose", "Route", "Indication"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.drug} className="border-b border-border/30">
                  <td className="px-3 py-2 font-medium text-foreground">{m.drug}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${m.role === "Suspect" ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"}`}>
                      {m.role} {m.role === "Suspect" && "⚠️"}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{m.dose}</td>
                  <td className="px-3 py-2 text-muted-foreground">{m.route}</td>
                  <td className="px-3 py-2 text-muted-foreground">{m.indication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Reported Reactions</h3>
          <div className="space-y-2">
            {reactions.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${r.serious ? "bg-destructive text-destructive-foreground" : "bg-warning/20 text-warning"}`}>
                  {r.serious ? "Serious" : "Non-Serious"}
                </span>
                <span className="text-xs text-foreground">{r.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground">Outcome: </span>
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold text-destructive-foreground">Fatal</span>
          </div>
        </div>
      </div>

      {/* Right Column - AI Reasoning */}
      <div className="col-span-7 flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
        <div className="glass-card p-4 flex flex-col h-full overflow-hidden">
          {/* Static Header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">K2 Think V2 Reasoning Trace</h3>
              <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[9px] font-medium text-primary">Transparent AI</span>
            </div>
            <button className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
              <Clipboard className="h-3 w-3" /> Copy reasoning
            </button>
          </div>

          {/* Flagged steps summary strip */}
          <div className="shrink-0">
            <FlaggedStepsSummary count={feedbackSteps.size} />
          </div>

          {/* Scrollable Steps Area */}
          <div className="flex-1 overflow-y-auto pr-1 min-h-0">
            <div className="relative space-y-0">
              {steps.map((step, i) => {
                const isOpen = expandedSteps.has(i);
                const isVerdict = (step as any).verdict;
                const isPharmReasoning = i === 2;
                const isLast = i === steps.length - 1;
                return (
                  <div key={i} className="relative group/step">
                    {!isLast && (
                      <div className="absolute left-[19px] border-l-2 border-dashed border-muted-foreground/20" style={{ top: "100%", height: "12px", zIndex: 0 }} />
                    )}
                    <div
                      className={`relative rounded-lg border cursor-pointer transition-colors mb-3 ${
                        isVerdict ? "border-primary/40 bg-primary/5" : isPharmReasoning ? "border-border" : "border-border bg-muted/20"
                      }`}
                      style={{
                        ...(isPharmReasoning ? { background: "rgba(0,212,170,0.03)" } : {}),
                        ...(isVerdict ? { boxShadow: "inset 3px 0 0 0 hsl(163 100% 42%)" } : {}),
                      }}
                      onClick={() => toggleStep(i)}
                    >
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        {isVerdict ? (
                          <Brain className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <div className="h-4 w-4 shrink-0 rounded-full bg-success flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-success-foreground" />
                          </div>
                        )}
                        <span className="text-[11px] text-muted-foreground font-mono">Step {i + 1}</span>
                        <span className="text-xs font-medium text-foreground flex-1">{step.title}</span>
                        <StepFeedbackButtons
                          stepIndex={i}
                          stepTitle={step.title}
                          onFeedbackSubmit={handleFeedbackSubmit}
                          feedbackSubmitted={feedbackSteps.has(i)}
                          submittedErrorType={feedbackSteps.get(i)}
                        />
                      </div>
                      {(isOpen || step.summary) && (
                        <div className="px-3 pb-3 pl-9">
                          {step.summary && <p className="text-[11px] text-muted-foreground leading-relaxed">{step.summary}</p>}
                          {step.detail && isOpen && <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{step.detail}</p>}
                          {(step as any).assessment && isOpen && (
                            <div className="space-y-2 mt-2">
                              {[
                                { icon: "✅", label: "Temporal relationship", val: "Event occurred during treatment window. Plausible." },
                                { icon: "✅", label: "Pharmacological plausibility", val: "Dual anticoagulant/antiplatelet mechanism confirmed." },
                                { icon: "❌", label: "Dechallenge", val: "Drug stopped at time of death. Cannot assess improvement." },
                                { icon: "❌", label: "Rechallenge", val: "Not applicable (fatal outcome)." },
                                { icon: "⚠️", label: "Alternative causes", val: "Underlying DVT and possible occult GI pathology cannot be excluded." },
                              ].map((a) => (
                                <div key={a.label} className="flex items-start gap-2 text-[11px]">
                                  <span className="shrink-0 mt-0.5">{a.icon}</span>
                                  <div><span className="font-medium text-foreground">{a.label}</span><span className="text-muted-foreground"> — {a.val}</span></div>
                                </div>
                              ))}
                              <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(245,158,11,0.1)", borderLeft: "3px solid #F59E0B" }}>
                                <p className="text-xs font-bold" style={{ color: "#F59E0B" }}>WHO-UMC Causality: PROBABLE</p>
                              </div>
                            </div>
                          )}
                          {isVerdict && isOpen && (
                            <div className="mt-2 space-y-3">
                              <p className="text-base font-bold text-primary tracking-tight">SIGNAL CONFIRMED</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">Probable causal relationship between Rivaroxaban + Aspirin and fatal GI haemorrhage</p>
                              <div className="grid grid-cols-3 gap-2">
                                {[{ label: "ROR", value: "3.42", sub: "(95% CI: 2.1–5.6)" }, { label: "PRR", value: "2.89", sub: "(95% CI: 1.8–4.7)" }, { label: "Similar Cases", value: "847", sub: "" }].map((s) => (
                                  <div key={s.label} className="rounded-lg bg-muted/40 p-2.5 text-center">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                                    <p className="text-sm font-bold font-mono text-primary">{s.value}</p>
                                    {s.sub && <p className="text-[9px] text-muted-foreground">{s.sub}</p>}
                                  </div>
                                ))}
                              </div>
                              <p className="text-[11px] text-muted-foreground"><span className="font-medium text-foreground">Recommendation:</span> Initiate label review and updated Drug Safety Communication</p>
                            </div>
                          )}
                          {isVerdict && !isOpen && (
                            <div className="mt-1"><p className="text-xs font-semibold text-primary">SIGNAL CONFIRMED — ROR: 3.42</p></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end mt-1 mb-3">
              <span className="text-[10px] text-muted-foreground font-mono">Processing time: 4.2s</span>
            </div>
          </div>

          {/* Static Footer */}
          <div className="shrink-0 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <button onClick={() => setExportOpen((p) => !p)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <FileDown className="h-3.5 w-3.5" /> Export Report
                </button>
                <ExportReportModal open={exportOpen} onClose={() => setExportOpen(false)} />
              </div>
              <div className="relative flex-1">
                <button onClick={() => setSendOpen((p) => !p)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors">
                  <Send className="h-3.5 w-3.5" /> Send to Safety Officer
                </button>
                <SendAlertModal open={sendOpen} onClose={() => setSendOpen(false)} />
              </div>
            </div>

            <ClinicianFeedbackSection
              hasFeedback={feedbackSteps.size > 0}
              onViewReport={() => handleViewReport(false)}
            />
          </div>
        </div>
      </div>

      <AIReviewReportModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} inProgress={reviewInProgress} />
    </div>
  );
};

export default CaseAnalysis;

import { useState } from "react";
import { BookOpen, Target, AlertTriangle, Bookmark } from "lucide-react";

const stats = [
  { label: "Articles Scanned (24h)", value: "1,247", icon: BookOpen, color: "text-primary" },
  { label: "Relevant Matches", value: "14", icon: Target, color: "text-secondary" },
  { label: "High Priority", value: "3", icon: AlertTriangle, color: "text-warning" },
];

const articles = [
  {
    title: "Real-World Evidence of Rivaroxaban-Associated Major Bleeding Events: A Systematic Review of Post-Marketing Surveillance Data",
    authors: "Chen L, Martinez R, Thompson K, et al.",
    journal: "Drug Safety",
    date: "2024",
    relevance: 96,
    keywords: ["pharmacovigilance", "rivaroxaban", "bleeding", "FAERS"],
    summary: "Comprehensive analysis of 21,089 FAERS reports reveals significantly elevated ROR for GI haemorrhage when rivaroxaban is co-administered with antiplatelet agents.",
  },
  {
    title: "Machine Learning Approaches for Automated Signal Detection in Spontaneous Reporting Systems: A Comparative Analysis",
    authors: "Patel S, Kim J, Rodriguez A, et al.",
    journal: "Pharmacoepidemiology and Drug Safety",
    date: "2024",
    relevance: 89,
    keywords: ["signal detection", "machine learning", "disproportionality"],
    summary: "Novel deep learning model achieves 94% sensitivity in detecting drug safety signals from spontaneous reports, outperforming traditional PRR methods.",
  },
  {
    title: "Statin-Macrolide Interactions and Rhabdomyolysis Risk: Updated Meta-Analysis of Spontaneous Reports and Clinical Trials",
    authors: "Williams D, Nakamura T, Fischer M, et al.",
    journal: "Clinical Pharmacology & Therapeutics",
    date: "2024",
    relevance: 82,
    keywords: ["statins", "drug interactions", "rhabdomyolysis", "CYP3A4"],
    summary: "Meta-analysis confirms dose-dependent increase in rhabdomyolysis risk with concomitant atorvastatin-clarithromycin use, supporting current prescribing restrictions.",
  },
  {
    title: "Pharmacovigilance in the Era of Real-World Data: Challenges and Opportunities for Regulatory Decision-Making",
    authors: "Anderson B, Gupta R, Lee S.",
    journal: "Regulatory Toxicology and Pharmacology",
    date: "2024",
    relevance: 74,
    keywords: ["pharmacovigilance", "real-world data", "regulatory science"],
    summary: "Review of current regulatory frameworks for integrating RWE into pharmacovigilance decisions, with recommendations for standardized signal assessment criteria.",
  },
  {
    title: "Dual Antiplatelet Therapy and Proton Pump Inhibitor Co-Prescription: An Analysis of Clopidogrel Efficacy Reduction in Cardiac Patients",
    authors: "O'Brien F, Tanaka H, Mueller C, et al.",
    journal: "European Heart Journal",
    date: "2024",
    relevance: 68,
    keywords: ["clopidogrel", "PPI", "drug interaction", "CYP2C19"],
    summary: "Large-scale registry study demonstrates 23% increase in MACE events among patients receiving concurrent clopidogrel and omeprazole therapy.",
  },
];

const relevanceBorder = (r: number) => {
  if (r >= 90) return "#00D4AA";
  if (r >= 80) return "#6366F1";
  if (r >= 70) return "#F59E0B";
  return "#64748b";
};

const filters = ["All", "High Priority", "This Week", "Saved"];

const LiteratureMonitor = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const toggleBookmark = (i: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {articles.map((a, i) => {
          const borderColor = relevanceBorder(a.relevance);
          const isHigh = a.relevance >= 90;
          return (
            <div
              key={i}
              className="glass-card p-4 hover:border-primary/20 transition-colors border-l-[3px]"
              style={{ borderLeftColor: borderColor }}
            >
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h4 className="text-sm font-medium text-foreground leading-snug cursor-pointer hover:text-primary transition-colors flex-1">
                      {a.title}
                    </h4>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: isHigh ? "rgba(0,212,170,0.12)" : "hsl(var(--muted))",
                        color: isHigh ? "#00D4AA" : "hsl(var(--muted-foreground))",
                        border: `1px solid ${isHigh ? "rgba(0,212,170,0.3)" : "transparent"}`,
                        boxShadow: isHigh ? "0 0 10px rgba(0,212,170,0.15)" : "none",
                      }}
                    >
                      {a.relevance}% relevant
                    </span>
                    <button
                      onClick={() => toggleBookmark(i)}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors mt-0.5"
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={bookmarked.has(i) ? "currentColor" : "none"}
                        strokeWidth={bookmarked.has(i) ? 0 : 2}
                        color={bookmarked.has(i) ? "hsl(163 100% 42%)" : undefined}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{a.authors}</p>
                  <p className="text-[11px] mt-0.5">
                    <span className="text-primary italic">{a.journal}</span>
                    <span className="text-muted-foreground"> · {a.date}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {a.keywords.map((k) => (
                  <span key={k} className="rounded-full px-2 py-0.5 text-[9px] font-medium text-primary" style={{ background: "rgba(0,212,170,0.08)" }}>
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{a.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiteratureMonitor;

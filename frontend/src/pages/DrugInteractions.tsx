import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ExternalLink, Eye, BookmarkPlus, ChevronDown, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const suggestions = [
"Rivaroxaban", "Warfarin", "Aspirin", "Metformin",
"Atorvastatin", "Amiodarone", "Clopidogrel", "Omeprazole"];


type Severity = "Major" | "Moderate" | "Minor";

interface InteractionNode {
  drug: string;
  severity: Severity;
  size: number;
  angle: number;
  distance: number;
  mechanism: string;
  cyp: string[];
  evidence: number;
  faers: string;
  refs: string[];
  recommendation: string;
  drugClass?: string;
}

const interactions: InteractionNode[] = [
{ drug: "Aspirin", severity: "Major", size: 90, angle: -60, distance: 185, mechanism: "Dual anticoagulant/antiplatelet effect increases bleeding risk through complementary inhibition of coagulation cascade and platelet aggregation.", cyp: ["CYP3A4", "CYP2J2"], evidence: 4, faers: "21,089", refs: ["Patel MR et al. ROCKET AF Trial. NEJM 2011", "Dewilde WJ et al. WOEST Trial. Lancet 2013", "Gibson CM et al. RE-DUAL PCI. NEJM 2017"], recommendation: "Avoid concurrent use when possible. If combination is required, monitor for signs of bleeding and consider gastroprotective therapy. Regular INR monitoring recommended.", drugClass: "COX-1 Inhibitor" },
{ drug: "Ketoconazole", severity: "Major", size: 90, angle: 10, distance: 220, mechanism: "Strong CYP3A4 inhibition significantly increases rivaroxaban plasma concentrations, elevating bleeding risk.", cyp: ["CYP3A4"], evidence: 4, faers: "3,412", refs: ["Mueck W et al. Br J Clin Pharmacol 2013", "FDA Drug Safety Communication 2014"], recommendation: "Concomitant use is contraindicated. Consider alternative antifungal agents that do not inhibit CYP3A4.", drugClass: "Azole Antifungal" },
{ drug: "Clopidogrel", severity: "Major", size: 85, angle: -120, distance: 180, mechanism: "Combined antiplatelet and anticoagulant effect substantially increases risk of major and fatal bleeding events.", cyp: ["CYP3A4", "CYP2C19"], evidence: 4, faers: "15,234", refs: ["Mega JL et al. ATLAS ACS-TIMI 51. NEJM 2012", "Cannon CP et al. NEJM 2017"], recommendation: "Use lowest effective doses. Duration of triple therapy should be minimized. Consider PPI co-prescription.", drugClass: "P2Y12 Inhibitor" },
{ drug: "Fluconazole", severity: "Major", size: 80, angle: 70, distance: 215, mechanism: "Moderate CYP3A4 inhibition increases rivaroxaban exposure by ~42%, raising hemorrhagic risk.", cyp: ["CYP3A4", "CYP2C9"], evidence: 3, faers: "2,891", refs: ["Greenblatt DJ et al. J Clin Pharmacol 2017", "Frost CE et al. Br J Clin Pharmacol 2015"], recommendation: "Monitor closely for bleeding signs. Consider dose reduction of rivaroxaban if combination is necessary.", drugClass: "Triazole Antifungal" },
{ drug: "Amiodarone", severity: "Moderate", size: 80, angle: 140, distance: 210, mechanism: "P-glycoprotein inhibition by amiodarone may increase rivaroxaban absorption and reduce its clearance.", cyp: ["P-gp", "CYP3A4"], evidence: 3, faers: "4,567", refs: ["Stöllberger C et al. Eur J Clin Pharmacol 2015", "Flaker G et al. JACC 2014"], recommendation: "Clinical monitoring is recommended. No dose adjustment required but watch for bleeding signs.", drugClass: "Class III Antiarrhythmic" },
{ drug: "Carbamazepine", severity: "Moderate", size: 80, angle: -170, distance: 235, mechanism: "Strong CYP3A4 induction reduces rivaroxaban plasma levels, potentially decreasing anticoagulant efficacy.", cyp: ["CYP3A4", "P-gp"], evidence: 3, faers: "1,203", refs: ["Brings A et al. Thromb Res 2017", "Wiggins BS et al. Heart Rhythm 2020"], recommendation: "Avoid if possible. If used, monitor for signs of subtherapeutic anticoagulation. Consider alternative anticonvulsant.", drugClass: "Anticonvulsant" },
{ drug: "Diltiazem", severity: "Moderate", size: 75, angle: 210, distance: 230, mechanism: "Moderate CYP3A4 and P-gp inhibition may modestly increase rivaroxaban exposure.", cyp: ["CYP3A4", "P-gp"], evidence: 2, faers: "987", refs: ["Frost CE et al. J Clin Pharmacol 2015"], recommendation: "Generally well tolerated. Monitor for increased bleeding tendency in high-risk patients.", drugClass: "Calcium Channel Blocker" },
{ drug: "Omeprazole", severity: "Minor", size: 70, angle: -30, distance: 225, mechanism: "Gastric pH elevation may slightly affect rivaroxaban absorption, but clinical significance is minimal.", cyp: ["CYP2C19"], evidence: 2, faers: "456", refs: ["Greenblatt DJ et al. Clin Pharmacol Ther 2018"], recommendation: "No clinically significant interaction. No dose adjustment necessary.", drugClass: "Proton Pump Inhibitor" }];


const severityColor: Record<Severity, string> = { Major: "#EF4444", Moderate: "#F59E0B", Minor: "#64748b" };
const severityWidth: Record<Severity, number> = { Major: 3, Moderate: 2, Minor: 1 };
const CENTER_SIZE = 120;

const faersOutcomes = [
{ label: "Hospitalization", pct: 43, color: "#F59E0B" },
{ label: "Death", pct: 12, color: "#EF4444" },
{ label: "Life-threatening", pct: 8, color: "#F97316" },
{ label: "Disability", pct: 3, color: "#6366F1" },
{ label: "Recovered", pct: 28, color: "#10B981" },
{ label: "Unknown", pct: 6, color: "#6B7280" }];


const temporalData = [
{ q: "Q1 24", v: 1847 }, { q: "Q2 24", v: 2103 }, { q: "Q3 24", v: 2891 }, { q: "Q4 24", v: 3204 },
{ q: "Q1 25", v: 2756 }, { q: "Q2 25", v: 3012 }, { q: "Q3 25", v: 2890 }, { q: "Q4 25", v: 2386 }];


const reporters = [
{ label: "Physician", pct: 47 },
{ label: "Pharmacist", pct: 18 },
{ label: "Consumer", pct: 23 },
{ label: "Other HP", pct: 12 }];


const ageBuckets = [
{ label: "<40", h: 8 }, { label: "40-55", h: 18 }, { label: "55-70", h: 38 }, { label: "70-85", h: 28 }, { label: "85+", h: 8 }];


const topReactions = [
{ name: "GI haemorrhage", count: 4218, color: "#EF4444" },
{ name: "Epistaxis", count: 2891 },
{ name: "Haematuria", count: 1654 },
{ name: "Anaemia", count: 1502 },
{ name: "Cerebral haemorrhage", count: 987 }];


const pkData = [
{ param: "Half-life", riv: "5-9 hrs", asp: "15-20 min" },
{ param: "Metabolism", riv: "CYP3A4/2J2", asp: "Hepatic est." },
{ param: "Protein Bind.", riv: "92-95%", asp: "99.5%" },
{ param: "Bioavail.", riv: "80-100%", asp: "68%" }];


const DrugInteractions = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<InteractionNode>(interactions[0]);
  const [panelKey, setPanelKey] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<InteractionNode | null>(null);
  const [refsOpen, setRefsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphSize, setGraphSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Wheel zoom (Ctrl+scroll)
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.002, 0.4), 3));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Touch pinch-to-zoom
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist.current !== null) {
          const delta = dist - lastPinchDist.current;
          setZoom((z) => Math.min(Math.max(z + delta * 0.005, 0.4), 3));
        }
        lastPinchDist.current = dist;
      }
    };
    const onTouchEnd = () => { lastPinchDist.current = null; };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => { el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd); };
  }, []);

  // Mouse drag to pan
  const onGraphMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPanPos.current = { x: e.clientX, y: e.clientY };
  };
  const onGraphMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan((p) => ({ x: p.x + e.clientX - lastPanPos.current.x, y: p.y + e.clientY - lastPanPos.current.y }));
    lastPanPos.current = { x: e.clientX, y: e.clientY };
  };
  const onGraphMouseUp = () => { isPanning.current = false; };

  const filtered = query ?
  suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())) :
  suggestions;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const measure = useCallback(() => {
    if (graphRef.current) {
      const { width, height } = graphRef.current.getBoundingClientRect();
      setGraphSize({ w: width, h: height });
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const cx = graphSize.w / 2;
  const cy = graphSize.h / 2;

  const toXY = (angle: number, dist: number) => ({
    x: cx + Math.cos(angle * Math.PI / 180) * dist,
    y: cy + Math.sin(angle * Math.PI / 180) * dist
  });

  const handleSelectNode = (n: InteractionNode) => {
    setSelected(n);
    setPanelKey((k) => k + 1);
  };

  const majorCount = interactions.filter((i) => i.severity === "Major").length;
  const moderateCount = interactions.filter((i) => i.severity === "Moderate").length;
  const minorCount = interactions.filter((i) => i.severity === "Minor").length;

  return (
    <div>
      {/* Search bar */}
      <div ref={searchRef} className="relative mb-3">
        <div className="glass-card flex items-center gap-3 px-4 py-2.5 border border-border focus-within:border-primary/50 transition-colors">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            placeholder="Search drug to explore interactions..."
            value={query}
            onChange={(e) => {setQuery(e.target.value);setShowSuggestions(true);}}
            onFocus={() => setShowSuggestions(true)} />

        </div>
        {showSuggestions && filtered.length > 0 &&
        <div className="absolute z-50 top-full mt-1 left-0 right-0 glass-card border border-border py-1 animate-scale-in" style={{ background: "hsl(220 40% 6%)" }}>
            {filtered.map((s) =>
          <button key={s} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors" onClick={() => {setQuery(s);setShowSuggestions(false);}}>
                {s}
              </button>
          )}
          </div>
        }
      </div>

      {/* ═══════ TOP SECTION: Graph 55% + Panel 45% ═══════ */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "55% 1fr" }}>
        {/* Graph */}
        <div className="glass-card p-2 flex flex-col relative">
          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-40 flex flex-col gap-1">
            <button onClick={zoomIn} className="h-7 w-7 rounded-md bg-muted/60 border border-border hover:bg-muted flex items-center justify-center transition-colors" title="Zoom in"><ZoomIn className="h-3.5 w-3.5 text-foreground" /></button>
            <button onClick={zoomOut} className="h-7 w-7 rounded-md bg-muted/60 border border-border hover:bg-muted flex items-center justify-center transition-colors" title="Zoom out"><ZoomOut className="h-3.5 w-3.5 text-foreground" /></button>
            <button onClick={resetZoom} className="h-7 w-7 rounded-md bg-muted/60 border border-border hover:bg-muted flex items-center justify-center transition-colors" title="Reset"><RotateCcw className="h-3.5 w-3.5 text-foreground" /></button>
            <span className="text-[9px] text-muted-foreground text-center font-mono mt-0.5">{Math.round(zoom * 100)}%</span>
          </div>
          <div ref={graphRef} className="relative overflow-hidden cursor-grab active:cursor-grabbing" style={{ height: "min(55vh, 440px)" }}
            onMouseDown={onGraphMouseDown} onMouseMove={onGraphMouseMove} onMouseUp={onGraphMouseUp} onMouseLeave={onGraphMouseUp}>
            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center", transition: isPanning.current ? "none" : "transform 0.15s ease-out", width: "100%", height: "100%", position: "relative" }}>
            {graphSize.w > 0 &&
            <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {interactions.map((n) => {
                  const { x, y } = toXY(n.angle, n.distance);
                  const color = severityColor[n.severity];
                  const w = severityWidth[n.severity];
                  const dx = x - cx;const dy = y - cy;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const ux = dx / len;const uy = dy / len;
                  const cR = CENTER_SIZE / 2;
                  const oR = n.size / 2;
                  return (
                    <line key={n.drug}
                    x1={cx + ux * cR} y1={cy + uy * cR}
                    x2={x - ux * oR} y2={y - uy * oR}
                    stroke={color} strokeWidth={w}
                    strokeDasharray={n.severity === "Minor" ? "6 4" : "none"} opacity={0.7} />);


                })}
                </svg>

                {interactions.map((n) => {
                const { x, y } = toXY(n.angle, n.distance);
                const lx = (cx + x) / 2;const ly = (cy + y) / 2;
                const color = severityColor[n.severity];
                return (
                  <div key={`label-${n.drug}`} className="absolute z-20 pointer-events-none" style={{ left: lx, top: ly, transform: "translate(-50%, -50%)" }}>
                      <span className="text-[7px] font-bold px-1 py-0.5 rounded-full" style={{ background: "hsl(var(--background))", color, border: `1px solid ${color}` }}>
                        {n.severity}
                      </span>
                    </div>);

              })}

                <div
                className="absolute z-10 flex items-center justify-center rounded-full border-2 border-primary font-bold text-foreground"
                style={{
                  width: CENTER_SIZE, height: CENTER_SIZE, fontSize: 12,
                  left: cx - CENTER_SIZE / 2, top: cy - CENTER_SIZE / 2,
                  background: "hsl(var(--primary) / 0.1)",
                  boxShadow: "0 0 20px rgba(0,212,170,0.3), 0 0 40px rgba(0,212,170,0.1)",
                  animation: "pulse-glow 3s ease-in-out infinite"
                }}>

                  Rivaroxaban
                </div>

                {interactions.map((n) => {
                const { x, y } = toXY(n.angle, n.distance);
                const color = severityColor[n.severity];
                const isSelected = selected.drug === n.drug;
                const sz = n.size;
                return (
                  <button key={n.drug}
                  onClick={() => handleSelectNode(n)}
                  onMouseEnter={() => setHoveredNode(n)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute z-10 flex items-center justify-center rounded-full border font-medium text-foreground text-center leading-tight transition-all duration-200 hover:scale-105 cursor-pointer"
                  style={{
                    width: sz, height: sz, fontSize: 10,
                    left: x - sz / 2, top: y - sz / 2,
                    borderColor: isSelected ? color : color + "99",
                    borderWidth: isSelected ? 2 : 1,
                    background: color + "12",
                    boxShadow: isSelected ? `0 0 14px ${color}40` : "none"
                  }}>

                      {n.drug}
                    </button>);

              })}

                {hoveredNode && (() => {
                const { x, y } = toXY(hoveredNode.angle, hoveredNode.distance);
                const color = severityColor[hoveredNode.severity];
                const tLeft = x + hoveredNode.size / 2 + 8;
                return (
                  <div className="absolute z-30 w-[180px] rounded-lg border border-border p-2.5 pointer-events-none animate-scale-in"
                  style={{ left: Math.min(tLeft, graphSize.w - 190), top: Math.max(y - 35, 8), background: "hsl(220 40% 6% / 0.95)", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
                      <p className="text-[11px] font-bold text-foreground">{hoveredNode.drug}</p>
                      <p className="text-[9px] text-muted-foreground">{hoveredNode.drugClass}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">FAERS: <span className="font-mono font-bold text-foreground">{hoveredNode.faers}</span></p>
                      <span className="inline-block mt-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold" style={{ background: color + "20", color }}>{hoveredNode.severity}</span>
                    </div>);

              })()}
              </>
            }
            </div>
          </div>

          {/* Legend + Stats — single row */}
          <div className="flex items-center justify-center gap-3 py-1 rounded-md bg-muted/20 border border-border text-[9px] flex-wrap">
            {([["Major", "#EF4444", false], ["Moderate", "#F59E0B", false], ["Minor", "#64748b", true]] as const).map(([label, color, dashed]) =>
            <div key={label} className="flex items-center gap-1">
                <svg width="14" height="4"><line x1="0" y1="2" x2="14" y2="2" stroke={color} strokeWidth={label === "Major" ? 3 : 2} strokeDasharray={dashed ? "6 4" : "none"} /></svg>
                <span className="text-muted-foreground">{label}</span>
              </div>
            )}
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground">Total: <span className="font-bold font-mono text-foreground">{interactions.length}</span></span>
            <span className="text-muted-foreground">Major: <span className="font-bold font-mono" style={{ color: "#EF4444" }}>{majorCount}</span></span>
            <span className="text-muted-foreground">Mod: <span className="font-bold font-mono" style={{ color: "#F59E0B" }}>{moderateCount}</span></span>
            <span className="text-muted-foreground">Minor: <span className="font-bold font-mono" style={{ color: "#64748b" }}>{minorCount}</span></span>
          </div>
        </div>

        {/* ═══════ RIGHT PANEL — single continuous card ═══════ */}
        <div key={panelKey} className="glass-card p-4 animate-fade-in flex flex-col" style={{ gap: 0 }}>
          {/* Title + badges */}
          <div>
            <p className="text-[10px] text-muted-foreground">Selected Pair</p>
            <p className="text-base font-bold text-foreground mt-0.5">Rivaroxaban ↔ {selected.drug}</p>
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: severityColor[selected.severity] + "20", color: severityColor[selected.severity] }}>
                {selected.severity}
              </span>
              <span className="text-[10px] text-muted-foreground">Evidence {selected.evidence}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) =>
                <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i <= selected.evidence ? "hsl(var(--primary))" : "hsl(var(--muted))" }} />
                )}
              </div>
              {selected.cyp.map((c) =>
              <span key={c} className="rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-[9px] font-mono font-bold">{c}</span>
              )}
            </div>
          </div>

          <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* FAERS Cases + sparkline */}
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <p className="text-[9px] text-muted-foreground">FAERS Cases</p>
              <p className="text-xl font-bold font-mono text-primary">{selected.faers}</p>
            </div>
            <div className="flex-1 h-[32px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temporalData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#00D4AA" strokeWidth={1.5} fill="url(#sparkGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[7px] text-muted-foreground shrink-0 leading-tight">8-quarter<br />trend</p>
          </div>

          <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* Mechanism */}
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">Mechanism</p>
            <p className="text-[11px] text-foreground leading-relaxed">{selected.mechanism}</p>
          </div>

          <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* Clinical Recommendation */}
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">Clinical Recommendation</p>
            <div className="rounded-md px-2.5 py-2" style={{ borderLeft: "3px solid #F59E0B", background: "rgba(245,158,11,0.05)" }}>
              <p className="text-[11px] text-foreground leading-relaxed">{selected.recommendation}</p>
            </div>
          </div>

          <div className="my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* References collapsible */}
          <button onClick={() => setRefsOpen((p) => !p)} className="flex items-center gap-1.5 text-left">
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${refsOpen ? "rotate-180" : ""}`} />
            <span className="text-[10px] text-primary font-medium">{selected.refs.length} references</span>
          </button>
          {refsOpen &&
          <div className="space-y-1 mt-1.5 animate-fade-in">
              {selected.refs.map((r) =>
            <div key={r} className="flex items-start gap-1.5 rounded-md bg-muted/20 px-2 py-1 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <p className="text-[9px] text-primary flex-1 leading-snug line-clamp-2">{r}</p>
                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
            )}
            </div>
          }

          {/* Buttons — pushed to bottom */}
          <div className="flex gap-2 mt-auto pt-3">
            <Button size="sm" className="flex-1 gap-1.5 text-xs h-8">
              <Eye className="h-3.5 w-3.5" /> View Full Report
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-8">
              <BookmarkPlus className="h-3.5 w-3.5" /> Add to Watchlist
            </Button>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* ═══════ BOTTOM SECTION: 2x2 data cards ═══════ */}
      <div className="grid grid-cols-2 gap-3">
        {/* Row 1, Col 1: FAERS Outcomes */}
        <div className="glass-card p-3" style={{ height: 200 }}>
          <p className="text-[10px] text-muted-foreground mb-2 font-medium">FAERS Outcome Distribution</p>
          {/* Stacked bar with inline labels */}
          <div className="h-6 rounded-full overflow-hidden flex relative mb-2">
            {faersOutcomes.map((o) =>
            <div key={o.label} style={{ width: `${o.pct}%`, background: o.color }} className="h-full relative flex items-center justify-center overflow-hidden">
                {o.pct >= 10 && <span className="text-[7px] font-bold text-white/90 truncate px-0.5">{o.pct}%</span>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {faersOutcomes.map((o) =>
            <div key={o.label} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ background: o.color }} />
                <span className="text-[9px] text-muted-foreground">{o.label}</span>
                <span className="text-[9px] font-bold text-foreground ml-auto">{o.pct}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 1, Col 2: Top Reactions */}
        <div className="glass-card p-3" style={{ height: 200 }}>
          <p className="text-[10px] text-muted-foreground mb-2 font-medium">Top Co-Reported Reactions</p>
          <div className="space-y-2">
            {topReactions.map((r, i) => {
              const maxCount = topReactions[0].count;
              const pct = r.count / maxCount * 100;
              const barColor = r.color || "hsl(var(--primary))";
              return (
                <div key={r.name}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-foreground"><span className="font-bold mr-1">{i + 1}.</span>{r.name}</span>
                    <span className="text-[9px] font-mono font-bold text-muted-foreground shrink-0 ml-2">{r.count.toLocaleString()}</span>
                  </div>
                  <div className="h-[5px] rounded bg-muted/30 overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* Row 2, Col 1: Demographics */}
        <div className="glass-card p-3" style={{ height: 200 }}>
          <p className="text-[10px] text-muted-foreground mb-2 font-medium">Affected Demographics</p>
          <p className="text-[9px] text-muted-foreground mb-1.5">Age: <span className="text-foreground font-mono font-bold">Mean 68.4</span></p>
          <div className="flex items-end gap-1.5 mb-3" style={{ height: 60 }}>
            {ageBuckets.map((b) => {
              const maxH = 38;
              const barH = Math.max(b.h / maxH * 50, 6);
              return (
                <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full rounded-sm bg-primary/50" style={{ height: `${barH}px` }} />
                  <span className="text-[8px] text-muted-foreground">{b.label}</span>
                </div>);

            })}
          </div>
          <div className="flex gap-2">
            <span className="rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: "hsl(210 80% 55% / 0.15)", color: "hsl(210 80% 65%)", border: "1px solid hsl(210 80% 55% / 0.3)" }}>♂ Male 58%</span>
            <span className="rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: "hsl(330 70% 60% / 0.15)", color: "hsl(330 70% 70%)", border: "1px solid hsl(330 70% 60% / 0.3)" }}>♀ Female 42%</span>
          </div>
        </div>

        {/* Row 2, Col 2: Reporter + PK stacked */}
        <div className="flex flex-col gap-3" style={{ height: 200 }}>
          <div className="glass-card p-3 flex-1">
            <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Reporter Breakdown</p>
            <div className="space-y-1.5">
              {reporters.map((r) =>
              <div key={r.label} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground w-[52px] shrink-0 text-right">{r.label}</span>
                  <div className="flex-1 h-2.5 rounded bg-muted/30 overflow-hidden">
                    <div className="h-full rounded bg-primary/50" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-foreground w-[26px] shrink-0">{r.pct}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="glass-card p-3 flex-1">
            <p className="text-[10px] text-muted-foreground mb-1 font-medium">PK Profile</p>
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-0.5 text-muted-foreground font-medium"></th>
                  <th className="text-left py-0.5 text-muted-foreground font-medium">Rivaroxaban</th>
                  <th className="text-left py-0.5 text-muted-foreground font-medium">Aspirin</th>
                </tr>
              </thead>
              <tbody>
                {pkData.map((r) =>
                <tr key={r.param} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td className="py-0.5 text-muted-foreground">{r.param}</td>
                    <td className="py-0.5 font-mono text-foreground">{r.riv}</td>
                    <td className="py-0.5 font-mono text-foreground">{r.asp}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Data source footer — always at bottom, clear of content */}
      <div className="w-full pt-4 pb-2">
        


      </div>
    </div>);

};

export default DrugInteractions;


# PharmacoMind — Autonomous Drug Safety Signal Detection Platform

A premium, data-dense pharmacovigilance dashboard with a Bloomberg Terminal aesthetic. Dark theme, glassmorphic cards, high information density, and an "always alive" feel with pulsing status indicators.

---

## Design System

- **Dark-only theme** with deep navy-black background (#0A0E1A), slightly lighter sidebar/header (#0D1117)
- **Color palette**: Pharma-teal (#00D4AA) primary, Indigo (#6366F1) secondary, Amber (#F59E0B) warning, Red (#EF4444) critical, Emerald (#10B981) success
- **Typography**: Inter for UI, JetBrains Mono for data/numbers
- **Glassmorphic cards**: semi-transparent backgrounds with subtle borders and backdrop-blur
- **Animations**: fade-in on mount, smooth 200ms hover transitions, pulsing status dots

---

## Layout Shell

- **Fixed left sidebar** (240px, collapsible to 64px icon-only mode) with navigation, logo with animated pulse dot, and AI agent status indicators at the bottom
- **Top header bar** (56px) with breadcrumbs, Command-K search bar, notification bell with badge, and user avatar
- Routing via react-router-dom for all 7 pages

---

## Page 1 — Dashboard (Home)

Mission control overview with:
- **4 KPI stat cards**: Cases Processed, Active Signals, Critical Alerts (with red glow), Agent Uptime
- **Signal Detection Timeline** (60% width): line/area chart with 7D/30D/90D filters showing new vs resolved signals
- **Signal Severity Distribution** (40%): donut chart with center total count
- **Recent Signals table** (50%): 5 rows with severity badges, drug names, confidence progress bars, timestamps
- **Live Agent Activity Feed** (50%): real-time-style log with agent-colored borders and pulsing "Live" indicator

---

## Page 2 — Signal Detection

Full-page signal exploration with:
- **Filter bar**: severity, drug class, time period dropdowns + search input + reset button
- **Data table**: Signal ID, severity badge, drugs, adverse event, WHO-UMC causality, ROR with CI, case count, confidence bar, status badge, detection time
- 8 rows of realistic sample data with hover effects and pagination

---

## Page 3 — Case Analysis

The "wow" demo page with two-column layout:
- **Left (55%)**: Case header, patient profile stats, medication list table with role badges (Suspect/Concomitant), reported reactions with severity badges
- **Right (45%)**: AI Reasoning Chain — a vertical stepper/timeline with 6 expandable steps showing the full reasoning trace from criteria parsing through final verdict, with checkmarks, assessment grids, and a bold conclusion
- Action buttons: Export Report + Send to Safety Officer

---

## Page 4 — Drug Interactions

Network visualization page:
- Search bar for drug lookup
- **Visual network diagram** built with positioned divs and CSS lines — center drug node with connected interaction nodes, color-coded by severity (red=major, amber=moderate, gray=minor)
- **Side panel (30%)**: interaction details showing mechanism, CYP pathway, evidence level, FAERS case count, literature references

---

## Page 5 — Literature Monitor

PubMed article monitoring:
- Stats row: articles scanned, relevant matches, high priority count
- Card list of 5 realistic pharmacovigilance articles with titles, authors, journal, relevance score badges, keyword tag pills, and AI-generated summaries

---

## Page 6 — Agent Activity

Full agent monitoring:
- **3 agent status cards**: SentinelAgent, ReasonerAgent, EpidemiologistAgent — each with status, current task, metrics, and pulsing green dots
- **Scrollable activity log** with 20+ entries and agent filter dropdown

---

## Page 7 — Settings

Configuration page with:
- API key inputs (OpenFDA, PubMed, DrugBank) with show/hide toggles
- Agent on/off toggle switches
- Notification preference toggles (Telegram, Email, Slack) with webhook URL inputs
- About section with version info

---

## Technical Notes

- All data is hardcoded/mocked — no backend integration
- Recharts for all charts, Lucide React for icons, shadcn/ui components throughout
- Fully working sidebar navigation with route switching
- Responsive but optimized for 1440px+ desktop viewports
- JetBrains Mono loaded via Google Fonts for monospace data display


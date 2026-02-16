import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { MobileOverlay } from "./components/MobileOverlay";
import Index from "./pages/Index";
import SignalDetection from "./pages/SignalDetection";
import CaseAnalysis from "./pages/CaseAnalysis";
import DrugInteractions from "./pages/DrugInteractions";
import LiteratureMonitor from "./pages/LiteratureMonitor";
import AgentActivity from "./pages/AgentActivity";
import AIPerformance from "./pages/AIPerformance";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MobileOverlay />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signals" element={<SignalDetection />} />
            <Route path="/case-analysis" element={<CaseAnalysis />} />
            <Route path="/interactions" element={<DrugInteractions />} />
            <Route path="/literature" element={<LiteratureMonitor />} />
            <Route path="/agents" element={<AgentActivity />} />
            <Route path="/ai-performance" element={<AIPerformance />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

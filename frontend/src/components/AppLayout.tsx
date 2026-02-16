import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { HeaderBar } from "./HeaderBar";

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [fadeKey, setFadeKey] = useState(location.pathname);

  useEffect(() => {
    setFadeKey(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen" style={{ background: "#0A0E1A" }}>
      <AppSidebar />
      <HeaderBar />
      <main
        className="pt-14 min-h-screen transition-[margin-left] duration-200"
        style={{ background: "#0A0E1A", marginLeft: "var(--sidebar-width, 240px)" }}
      >
        <div key={fadeKey} className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

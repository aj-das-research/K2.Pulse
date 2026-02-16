import { useState, useEffect } from "react";

export function MobileOverlay() {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-8 text-center bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-2.5 w-2.5 rounded-full bg-primary pulse-dot" />
        <span className="text-xl font-bold tracking-tight text-foreground">
          Pharmaco<span className="text-primary">Mind</span>
        </span>
      </div>

      <h2 className="text-base font-semibold text-foreground mb-2">
        PharmacoMind is optimized for desktop use
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Please access this application on a device with a screen width of 1024px or larger for the best experience.
      </p>

      <button
        onClick={() => setDismissed(true)}
        className="mt-8 text-xs text-primary hover:underline transition-colors"
      >
        Continue anyway →
      </button>
    </div>
  );
}

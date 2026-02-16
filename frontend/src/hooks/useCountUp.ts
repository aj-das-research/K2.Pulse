import { useState, useEffect, useRef } from "react";

export function useCountUp(target: string, duration = 1000) {
  const [display, setDisplay] = useState("0");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Parse the target: handle numbers like "2,847", "99.7%", "23", "3"
    const cleaned = target.replace(/[^0-9.]/g, "");
    const numericTarget = parseFloat(cleaned);
    if (isNaN(numericTarget)) {
      setDisplay(target);
      return;
    }

    const hasPercent = target.includes("%");
    const hasComma = target.includes(",");
    const decimalPlaces = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;

      let formatted: string;
      if (decimalPlaces > 0) {
        formatted = current.toFixed(decimalPlaces);
      } else {
        formatted = Math.round(current).toString();
      }

      if (hasComma) {
        formatted = Number(formatted).toLocaleString();
      }
      if (hasPercent) {
        formatted += "%";
      }

      setDisplay(formatted);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return display;
}

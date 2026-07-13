"use client";

import * as React from "react";
import { RotateCw, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function RotateOverlay() {
  const [isPortrait, setIsPortrait] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const portrait = window.innerWidth < window.innerHeight && window.innerWidth < 768;
      setIsPortrait(portrait);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
      <div className="max-w-xs flex flex-col items-center gap-6">
        <div className="p-4 bg-primary/10 text-primary rounded-full border border-primary/20 animate-spin-slow">
          <RotateCw className="w-8 h-8 text-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
            Rotate Your Device
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Proctored Competitive Examinations require a landscape layout workspace. Please rotate your device to landscape orientation to continue.
          </p>
        </div>
      </div>
    </div>
  );
}
export default RotateOverlay;

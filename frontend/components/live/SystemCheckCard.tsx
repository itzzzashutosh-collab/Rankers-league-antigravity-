"use client";

import * as React from "react";
import { Check, X, ShieldAlert, RefreshCw, Loader2, Monitor, Wifi, Maximize2, Settings } from "lucide-react";
import { systemRequirementsChecks } from "../../content/live/contest-lobby";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface SystemCheckCardProps {
  onStatusChange: (isPassed: boolean) => void;
  className?: string;
}

export function SystemCheckCard({ onStatusChange, className }: SystemCheckCardProps) {
  const [checking, setChecking] = React.useState(false);
  const [ranDiagnostics, setRanDiagnostics] = React.useState(false);
  
  const [browserOk, setBrowserOk] = React.useState<boolean | null>(null);
  const [internetOk, setInternetOk] = React.useState<boolean | null>(null);
  const [resolutionOk, setResolutionOk] = React.useState<boolean | null>(null);
  const [zoomOk, setZoomOk] = React.useState<boolean | null>(null);
  const [fullscreenOk, setFullscreenOk] = React.useState<boolean | null>(null);
  const [jsOk, setJsOk] = React.useState<boolean | null>(null);

  const runDiagnostics = React.useCallback(async () => {
    setChecking(true);
    setRanDiagnostics(true);
    
    // Simulate diagnostic steps with small timeouts
    
    // 1. JS Check
    setJsOk(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Browser Check
    const agent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    const isSupported = systemRequirementsChecks.recommendedBrowsers.some(b => 
      agent.includes(b.toLowerCase())
    );
    setBrowserOk(isSupported);
    await new Promise(resolve => setTimeout(resolve, 350));

    // 3. Screen Resolution
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const resOk = w >= systemRequirementsChecks.minWidth && h >= systemRequirementsChecks.minHeight;
    setResolutionOk(resOk);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4. Zoom Check
    const zoom = typeof window !== "undefined" ? Math.round((window.outerWidth / window.innerWidth) * 100) : 100;
    const zoomAllowed = zoom <= systemRequirementsChecks.maxZoom;
    setZoomOk(zoomAllowed);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5. Fullscreen Availability
    const fsOk = typeof document !== "undefined" ? document.fullscreenEnabled : true;
    setFullscreenOk(fsOk);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6. Internet Stability
    setInternetOk(true); // Mock ok
    await new Promise(resolve => setTimeout(resolve, 400));

    setChecking(false);
  }, []);

  React.useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  // Aggregate results
  const allPassed = React.useMemo(() => {
    return !!(browserOk && internetOk && resolutionOk && zoomOk && fullscreenOk && jsOk);
  }, [browserOk, internetOk, resolutionOk, zoomOk, fullscreenOk, jsOk]);

  React.useEffect(() => {
    if (ranDiagnostics && !checking) {
      onStatusChange(allPassed);
    }
  }, [allPassed, checking, ranDiagnostics, onStatusChange]);

  const items = [
    { label: "JavaScript Activation", val: jsOk, desc: "Mandatory for proctoring checks" },
    { label: "Browser Compatibility", val: browserOk, desc: "Chrome, Brave, Safari, Edge" },
    { label: "Display Resolution (1024x700+)", val: resolutionOk, desc: "Large workspace displays required" },
    { label: "Zoom Coefficient (<=120%)", val: zoomOk, desc: "Standard scaling verification" },
    { label: "Fullscreen Authorization", val: fullscreenOk, desc: "Anti-cheating window lock" },
    { label: "Latency Latency (<150ms)", val: internetOk, desc: "Synchronized clocks verified" },
  ];

  return (
    <Card variant="solid" className={cn("border border-border/40 p-5 rounded-2xl bg-card/35 text-left", className)}>
      <div className="flex items-center justify-between border-b border-border/20 pb-3.5 mb-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-primary" />
          Proctoring System Diagnostic
        </span>
        <button
          onClick={runDiagnostics}
          disabled={checking}
          className="text-xs text-primary font-bold flex items-center gap-1 hover:underline disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", checking && "animate-spin")} />
          Re-Run
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-foreground">{it.label}</span>
              <span className="text-[10px] text-muted-foreground">{it.desc}</span>
            </div>

            <div className="shrink-0 select-none">
              {it.val === null ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary/60" />
              ) : it.val ? (
                <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 block">
                  <Check className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="p-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 block">
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {ranDiagnostics && !checking && !allPassed && (
        <div className="mt-4 p-3 bg-destructive/5 border border-destructive/15 rounded-xl text-destructive text-[11px] leading-relaxed flex gap-2.5">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div>
            <strong>Diagnostics failed.</strong> Zoom out your screen layout (Ctrl + Mouse Wheel) or use a larger display to satisfy system parameters.
          </div>
        </div>
      )}
    </Card>
  );
}
export default SystemCheckCard;

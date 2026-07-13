"use client";

import * as React from "react";
import { Shield, Maximize2, Minimize2, Wifi, CloudLightning, Loader2, CloudCheck } from "lucide-react";
import { Button } from "../ui";
import { cn } from "@/lib/utils";

interface ExamHeaderProps {
  contestTitle: string;
  examName: string;
  candidateName: string;
  accessId: string;
  selectedLanguage: string;
  timeLeftSeconds: number;
  connectionStatus: "connected" | "reconnecting" | "offline";
  autoSaveStatus: "saving" | "saved" | "syncing" | "offline";
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}

export function ExamHeader({
  contestTitle,
  examName,
  candidateName,
  accessId,
  selectedLanguage,
  timeLeftSeconds,
  connectionStatus,
  autoSaveStatus,
  isFullscreen,
  onToggleFullscreen,
  className,
}: ExamHeaderProps) {
  // Format seconds into HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const timerColor = timeLeftSeconds < 300 ? "text-red-500 animate-pulse border-red-500/20" : "text-foreground";

  return (
    <header className={cn("sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/40 px-6 py-3.5 flex items-center justify-between text-left", className)}>
      
      {/* 1. Exam Branding & Candidate Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block leading-none">
              {examName}
            </span>
            <strong className="text-xs font-extrabold text-foreground block mt-0.5 max-w-[180px] truncate">
              {contestTitle}
            </strong>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 border-l border-border/40 pl-4 text-xs">
          <div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Candidate</span>
            <span className="font-semibold text-foreground">{candidateName}</span>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">User ID</span>
            <span className="font-mono text-[10px] text-foreground font-semibold">{accessId}</span>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Language</span>
            <span className="font-semibold text-foreground">{selectedLanguage}</span>
          </div>
        </div>
      </div>

      {/* 2. Live Proctored Timer Widget */}
      <div className="flex items-center gap-3">
        <div className={cn("px-4 py-1.5 border border-border/60 rounded-xl bg-secondary/50 font-mono text-base font-extrabold tracking-wider flex items-center gap-2", timerColor)}>
          <span className="text-[10px] uppercase font-sans tracking-widest text-muted-foreground font-bold shrink-0">
            Time Left:
          </span>
          {formatTime(timeLeftSeconds)}
        </div>
      </div>

      {/* 3. Connection & Autosave status */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Save indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-secondary/40 border border-border/40 rounded-lg">
          {autoSaveStatus === "saving" && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span>Saving...</span>
            </>
          )}
          {autoSaveStatus === "syncing" && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span>Syncing...</span>
            </>
          )}
          {autoSaveStatus === "saved" && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Auto Saved</span>
            </>
          )}
          {autoSaveStatus === "offline" && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-500">Offline</span>
            </>
          )}
        </div>

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

    </header>
  );
}
export default ExamHeader;

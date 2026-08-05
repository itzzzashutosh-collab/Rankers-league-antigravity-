"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContestCountdownProps {
  targetDate: string; // ISO or date format
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ContestCountdown({
  targetDate,
  className,
  size = "md",
}: ContestCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-muted-foreground bg-secondary/80 border border-border/80 select-none",
          className
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        CONTEST CLOSED
      </div>
    );
  }

  const formats = [
    { label: "D", val: timeLeft.days },
    { label: "H", val: timeLeft.hours },
    { label: "M", val: timeLeft.minutes },
    { label: "S", val: timeLeft.seconds },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 select-none",
        size === "lg" ? "gap-3" : "gap-1.5",
        className
      )}
    >
      <Clock className={cn("text-destructive shrink-0 animate-pulse", size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5")} />
      <div className="flex items-center gap-1 font-mono text-xs font-bold tabular-nums text-destructive">
        {formats.map((f, idx) => (
          <React.Fragment key={f.label}>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "font-bold",
                  size === "lg" ? "text-xl sm:text-2xl" : size === "md" ? "text-sm" : "text-xs"
                )}
              >
                {f.val}
              </span>
              {size === "lg" && (
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {f.label}
                </span>
              )}
            </div>
            {idx < formats.length - 1 && (
              <span className={cn("opacity-40 self-center", size === "lg" ? "text-lg mb-4" : "")}>:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
export default ContestCountdown;

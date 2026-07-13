"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Star, Flame, Trophy, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold tracking-wide uppercase border transition-colors select-none",
  {
    variants: {
      variant: {
        featured: "bg-primary/5 text-primary border-primary/20",
        trending: "bg-amber-500/5 text-amber-500 border-amber-500/20",
        new: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20",
        popular: "bg-blue-500/5 text-blue-500 border-blue-500/20",
        premium: "gold-gradient text-primary-foreground border-transparent font-bold",
        national: "bg-violet-500/5 text-violet-500 border-violet-500/20",
      },
    },
    defaultVariants: {
      variant: "featured",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  icon?: boolean;
}

const defaultIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  featured: Trophy,
  trending: Flame,
  new: Sparkles,
  popular: Star,
  national: Trophy,
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "featured", icon = true, children, ...props }, ref) => {
    const IconComponent = variant && defaultIcons[variant];
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      >
        {icon && IconComponent && <IconComponent className="w-3 h-3 shrink-0" />}
        {children || variant}
      </span>
    );
  }
);

Badge.displayName = "Badge";

interface CountdownBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  targetDate: string;
}

export function CountdownBadge({ targetDate, className, ...props }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const hrs = Math.floor(difference / (1000 * 60 * 60));
      const mins = Math.floor((difference / 1000 / 60) % 60);
      const secs = Math.floor((difference / 1000) % 60);

      const fH = String(hrs).padStart(2, "0");
      const fM = String(mins).padStart(2, "0");
      const fS = String(secs).padStart(2, "0");

      setTimeLeft(`${fH}:${fM}:${fS}`);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-widest font-heading bg-destructive/5 text-destructive border border-destructive/20 select-none tabular-nums",
        className
      )}
      {...props}
    >
      <Timer className="w-3.5 h-3.5 animate-pulse shrink-0" />
      {timeLeft}
    </span>
  );
}

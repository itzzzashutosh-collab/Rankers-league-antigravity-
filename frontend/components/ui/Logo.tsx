import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  className,
  textClassName,
  size = "md",
}: LogoProps) {
  const sizeMap = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div className={cn("inline-flex items-center shrink-0 select-none group", className)}>
      <span
        className={cn(
          "font-heading font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent transition-all",
          sizeMap[size],
          textClassName
        )}
      >
        Ranker&apos;s League
      </span>
    </div>
  );
}

export default Logo;

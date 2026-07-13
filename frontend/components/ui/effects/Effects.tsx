"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NoiseTextureProps {
  className?: string;
  opacity?: number;
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({ className, opacity = 0.02 }) => {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none select-none mix-blend-overlay", className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
};

interface AnimatedGridProps {
  className?: string;
  size?: number;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({ className, size = 64 }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none opacity-20",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
      }}
    />
  );
};

interface AuroraBgProps {
  className?: string;
}

export const AuroraBg: React.FC<AuroraBgProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}>
      <div className="aurora-blob w-[500px] h-[500px] bg-primary/10 top-[-100px] left-[-100px]" />
      <div className="aurora-blob w-[400px] h-[400px] bg-emerald-500/8 bottom-[-50px] right-[-50px]" style={{ animationDelay: "4s" }} />
      <div className="aurora-blob w-[350px] h-[350px] bg-violet-500/6 top-[30%] left-[55%]" style={{ animationDelay: "8s" }} />
    </div>
  );
};

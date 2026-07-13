"use client";

import * as React from "react";
import { Card } from "../ui";

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Search & Filter skeleton bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border/30 rounded-xl bg-card/25 animate-pulse">
        <div className="h-4 bg-muted rounded w-32" />
        <div className="h-8 bg-muted rounded w-48" />
      </div>

      {/* Podium skeleton card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end py-2">
        <div className="h-44 border border-border/30 rounded-2xl bg-card/10 animate-pulse" />
        <div className="h-56 border border-border/35 rounded-2xl bg-card/15 animate-pulse" />
        <div className="h-44 border border-border/30 rounded-2xl bg-card/10 animate-pulse" />
      </div>

      {/* Table rows skeletons */}
      <Card variant="solid" className="border border-border/40 rounded-2xl overflow-hidden bg-card/10">
        <div className="p-4 border-b border-border/25 flex items-center justify-between">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-36" />
        </div>

        <div className="divide-y divide-border/20">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="p-5 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3.5">
                <div className="w-5 h-5 rounded bg-muted shrink-0" />
                <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-2.5 bg-muted rounded w-20" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-3.5 bg-muted rounded w-12" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
export default LeaderboardSkeleton;

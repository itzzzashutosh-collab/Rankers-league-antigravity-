"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";
import { analyticsService } from "@/services/analyticsService";

export default function ParticipantAnalytics() {
  const [geo, setGeo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await analyticsService.getGeographicDistribution();
    setGeo(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/analytics/executive" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Participant Dynamics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">DAU/MAU, user retention, session times, and demographic distributions.</p>
        </div>
        <button onClick={load} className="ml-auto p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
        {[
          { label: "Daily Active Users (DAU)", value: "3,820", sub: "24.6% DAU/MAU ratio" },
          { label: "Monthly Active Users", value: "15,480", sub: "+12.4% MoM" },
          { label: "Avg Session Duration", value: "24.5 min", sub: "Active focus period" },
          { label: "User Retention (D30)", value: "68.4%", sub: "High engagement level" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
            <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
            <span className="text-2xl font-black block">{value}</span>
            <span className="text-[10px] text-muted-foreground block">{sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {/* Geo spread */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Demographic Users</h3>
          <div className="space-y-3">
            {geo.map(({ state, users }) => (
              <div key={state} className="flex justify-between items-center border-b border-border/10 pb-2 last:border-0 last:pb-0">
                <span className="text-foreground font-bold">{state}</span>
                <span className="text-muted-foreground">{users.toLocaleString()} users</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Exam Preference Mix</h3>
          <div className="space-y-4">
            {[
              { label: "JEE prep", count: 8450, pct: 54.5 },
              { label: "NEET prep", count: 4820, pct: 31.1 },
              { label: "UPSC exam prep", count: 2210, pct: 14.4 },
            ].map(pref => (
              <div key={pref.label} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-foreground">{pref.label}</span>
                  <span className="text-muted-foreground">{pref.count.toLocaleString()} ({pref.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pref.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { participantService, ParticipantListItem } from "@/services/participantService";

export default function ActivityLedger() {
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ps = await participantService.getParticipants();
      setParticipants(ps);
      // Load activity for first 3 participants
      const all: any[] = [];
      for (const p of ps.slice(0, 3)) {
        const acts = await participantService.getActivity(p.id);
        acts.forEach(a => all.push({ ...a, participant: p }));
      }
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setEvents(all);
      setLoading(false);
    }
    load();
  }, []);

  const EVENT_COLOR: Record<string, string> = {
    "Registered": "bg-primary",
    "Contest Joined": "bg-amber-400",
    "Contest Completed": "bg-cyan-400",
    "Prize Won": "bg-emerald-400",
    "Withdrawal": "bg-destructive",
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/participants" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Activity Ledger</h1>
          <p className="text-xs text-muted-foreground mt-1">Cross-participant timeline of all platform activity events.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading Activity Timeline...</div>
      ) : (
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border/30" />
          {events.map((ev, i) => (
            <div key={ev.id + i} className="relative flex gap-4 items-start text-xs font-semibold">
              <div className={`absolute -left-4 w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${EVENT_COLOR[ev.event_type] || "bg-muted-foreground/40"}`} />
              <div className="flex-1 p-4 rounded-2xl border border-border/60 bg-card/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{ev.event_type}</span>
                    <Link href={`/admin/participants/${ev.participant.id}`} className="text-[9px] text-primary hover:underline">@{ev.participant.username}</Link>
                  </div>
                  {Object.keys(ev.details || {}).length > 0 && (
                    <span className="text-[10px] text-muted-foreground block">
                      {Object.entries(ev.details).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(ev.created_at).toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

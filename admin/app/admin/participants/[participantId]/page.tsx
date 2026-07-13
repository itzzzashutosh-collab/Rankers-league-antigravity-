"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Shield, Wallet, Activity, Clock, CheckCircle2,
  AlertOctagon, Smartphone, Laptop, Globe, Star, Award
} from "lucide-react";
import { participantService, ParticipantListItem, ParticipantActivity } from "@/services/participantService";
import { securityService, Session, LoginHistoryEntry } from "@/services/securityService";

export default function ParticipantProfileWorkspace() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.participantId as string;

  const [participant, setParticipant] = useState<ParticipantListItem | null>(null);
  const [activity, setActivity] = useState<ParticipantActivity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "security" | "support" | "timeline">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, act, sess, hist] = await Promise.all([
        participantService.getParticipant(participantId),
        participantService.getActivity(participantId),
        securityService.getSessions(participantId),
        securityService.getLoginHistory(participantId),
      ]);
      setParticipant(p);
      setActivity(act);
      setSessions(sess);
      setLoginHistory(hist);
      setLoading(false);
    }
    load();
  }, [participantId]);

  if (loading) return (
    <div className="py-20 text-center text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
      Loading Participant Workspace...
    </div>
  );

  if (!participant) return (
    <div className="py-20 text-center text-xs text-destructive font-bold">
      Participant not found.
    </div>
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Legend": return "text-amber-300";
      case "Platinum": return "text-cyan-300";
      case "Gold": return "text-yellow-400";
      case "Silver": return "text-slate-300";
      default: return "text-amber-700";
    }
  };

  const TABS = ["overview", "security", "support", "timeline"] as const;

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-black">{participant.display_name}</h1>
            <p className="text-xs text-muted-foreground">@{participant.username} · ID: {participant.id.slice(0, 12)}...</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${
          participant.account_status === "Active" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
          participant.account_status === "Suspended" ? "text-destructive border-destructive/20 bg-destructive/5" :
          "text-amber-400 border-amber-500/20 bg-amber-500/5"
        }`}>{participant.account_status}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 text-xs font-bold border-b border-border/30 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 capitalize rounded-t-lg border-b-2 transition-all ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
            <h3 className="font-black text-sm text-foreground">Identity</h3>
            <div className="space-y-2.5 text-[11px] leading-relaxed">
              {[
                ["Display Name", participant.display_name],
                ["Username", `@${participant.username}`],
                ["Email", participant.email],
                ["Mobile", participant.mobile],
                ["Location", `${participant.city}, ${participant.state}, ${participant.country}`],
                ["Category", participant.competition_category],
                ["Subscription", participant.subscription_plan],
                ["Joined", new Date(participant.created_at).toLocaleDateString("en-IN")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats + Achievements */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
              <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> Achievements
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Current Tier", value: participant.current_tier, color: getTierColor(participant.current_tier) },
                  { label: "Aura Points", value: `${participant.aura_points.toLocaleString()} pts`, color: "text-primary" },
                  { label: "Wallet", value: `₹${participant.wallet_balance.toLocaleString()}` },
                  { label: "Prize Balance", value: `₹${participant.prize_balance.toLocaleString()}`, color: "text-emerald-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-xl bg-background/50 border border-border/60">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold block">{label}</span>
                    <span className={`font-black text-sm mt-0.5 block ${color || "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/15 p-5 text-xs font-semibold space-y-3">
              <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Verification Status</h3>
              <div className="flex gap-3">
                <div className={`flex-1 p-2.5 rounded-lg border text-center text-[10px] ${participant.mobile_verified ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"}`}>
                  {participant.mobile_verified ? "✓" : "⏳"} Mobile
                </div>
                <div className={`flex-1 p-2.5 rounded-lg border text-center text-[10px] ${participant.email_verified ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"}`}>
                  {participant.email_verified ? "✓" : "⏳"} Email
                </div>
                <div className="flex-1 p-2.5 rounded-lg border border-border/60 text-center text-[10px] text-muted-foreground">
                  — Gov ID
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
            <h3 className="font-black text-sm text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Active Sessions
            </h3>
            <div className="space-y-3">
              {sessions.map(sess => (
                <div key={sess.id} className="p-4 rounded-xl border border-border/60 bg-background/25 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                      {sess.device_name}
                      {sess.is_current && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-black uppercase">Current</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">{sess.ip_address}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(sess.last_active).toLocaleTimeString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
            <h3 className="font-black text-sm text-foreground">Login History</h3>
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-background/25">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/80 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">Device</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loginHistory.map(entry => (
                    <tr key={entry.id} className="hover:bg-card/10 transition-colors">
                      <td className="p-3 font-bold text-foreground">{entry.device_name}</td>
                      <td className="p-3 text-muted-foreground font-mono">{entry.ip_address}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          entry.status === "Success" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                          "text-destructive border-destructive/20 bg-destructive/5"
                        }`}>{entry.status}</span>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{new Date(entry.created_at).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 text-xs font-semibold">
          <h3 className="font-black text-sm text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Unified Activity Timeline
          </h3>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border/40" />
            {activity.map((ev, i) => (
              <div key={ev.id} className="relative flex gap-4 items-start">
                <div className="absolute -left-4 w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                <div className="flex-1 p-3 rounded-xl border border-border/60 bg-background/25">
                  <span className="font-bold text-foreground block">{ev.event_type}</span>
                  {ev.details && Object.keys(ev.details).length > 0 && (
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {Object.entries(ev.details).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </span>
                  )}
                  <span className="text-[9px] text-muted-foreground/60 mt-1 block">
                    {new Date(ev.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support Tab */}
      {activeTab === "support" && (
        <ParticipantSupportPanel participantId={participantId} />
      )}
    </div>
  );
}

function ParticipantSupportPanel({ participantId }: { participantId: string }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    participantService.getSupportTickets(participantId).then(data => {
      setTickets(data);
      if (data.length > 0) setSelected(data[0]);
    });
  }, [participantId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-semibold">
      <div className="md:col-span-4 space-y-2">
        {tickets.map(t => (
          <button key={t.id} onClick={() => setSelected(t)}
            className={`w-full p-4 rounded-xl border text-left transition-all space-y-1 ${selected?.id === t.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground truncate">{t.subject}</span>
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border ${
                t.priority === "Critical" ? "text-destructive border-destructive/20 bg-destructive/5" :
                t.priority === "High" ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                "text-muted-foreground border-border/60"
              }`}>{t.priority}</span>
            </div>
            <span className="text-[9px] text-muted-foreground">{t.status}</span>
          </button>
        ))}
      </div>
      <div className="md:col-span-8">
        {selected ? (
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-foreground">{selected.subject}</h3>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">{selected.status}</span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selected.messages?.map((msg: any, i: number) => (
                <div key={i} className={`p-3 rounded-xl text-[11px] ${msg.from === "admin" ? "bg-primary/5 border border-primary/10 ml-8" : "bg-background/50 border border-border/60 mr-8"}`}>
                  <span className="font-bold text-[9px] text-muted-foreground block mb-1">{msg.from === "admin" ? "Admin" : "Participant"} · {new Date(msg.at).toLocaleString("en-IN")}</span>
                  <p className="text-foreground">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs">Select a ticket</div>}
      </div>
    </div>
  );
}

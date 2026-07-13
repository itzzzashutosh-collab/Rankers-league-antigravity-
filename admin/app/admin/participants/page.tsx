"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Search, Filter, Shield, Wallet, Star, Activity,
  ChevronRight, CheckCircle2, AlertOctagon, XCircle, Clock,
  RefreshCw, UserCheck, ShieldAlert
} from "lucide-react";
import { participantService, ParticipantListItem } from "@/services/participantService";

export default function ParticipantsHub() {
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [selected, setSelected] = useState<ParticipantListItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await participantService.getParticipants(search, statusFilter);
    setParticipants(data);
    if (!selected && data.length > 0) setSelected(data[0]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const handleQuickAction = async (action: string) => {
    if (!selected) return;
    if (!confirm(`Confirm action: ${action} for @${selected.username}?`)) return;

    if (action === "Suspend Account") {
      await participantService.updateStatus(selected.id, "Suspended", "Admin action");
      setSelected(prev => prev ? { ...prev, account_status: "Suspended" } : prev);
      setParticipants(prev => prev.map(p => p.id === selected.id ? { ...p, account_status: "Suspended" } : p));
    } else if (action === "Activate Account") {
      await participantService.updateStatus(selected.id, "Active", "Admin action");
      setSelected(prev => prev ? { ...prev, account_status: "Active" } : prev);
      setParticipants(prev => prev.map(p => p.id === selected.id ? { ...p, account_status: "Active" } : p));
    }
    setActionMsg(`✓ Action "${action}" executed and logged.`);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-400";
      case "Suspended": return "bg-destructive";
      case "Restricted": return "bg-amber-400";
      case "Pending Verification": return "bg-primary animate-pulse";
      default: return "bg-muted-foreground/40";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Legend": return "text-amber-300";
      case "Platinum": return "text-cyan-300";
      case "Gold": return "text-yellow-400";
      case "Silver": return "text-slate-300";
      default: return "text-amber-700";
    }
  };

  return (
    <div className="text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Participant Operations Center
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Identity management, security monitoring, and support desk — unified workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/admin/participants/verifications" className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold flex items-center gap-1.5 transition-colors">
            <UserCheck className="w-3.5 h-3.5" /> Verifications
          </Link>
          <Link href="/admin/participants/support" className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold flex items-center gap-1.5 transition-colors">
            Support Desk
          </Link>
          <Link href="/admin/participants/security" className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold flex items-center gap-1.5 transition-colors">
            <ShieldAlert className="w-3.5 h-3.5" /> Security
          </Link>
          <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-210px)]">
        {/* LEFT: Directory */}
        <aside className="col-span-3 flex flex-col gap-3 overflow-hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, username..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-border bg-background/50 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-xl border border-border bg-background/50 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Restricted">Restricted</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-muted-foreground/60 animate-pulse font-bold">Loading...</div>
            ) : participants.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all space-y-1 ${
                  selected?.id === p.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDot(p.account_status)}`} />
                  <span className="font-bold text-xs text-foreground truncate flex-1">{p.display_name}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                </div>
                <div className="text-[10px] text-muted-foreground/80 pl-4">
                  @{p.username} · {p.competition_category}
                </div>
                <div className="text-[10px] text-muted-foreground/60 pl-4 flex items-center gap-2">
                  <span className={`font-bold ${getTierColor(p.current_tier)}`}>{p.current_tier}</span>
                  <span>·</span>
                  <span>{p.aura_points.toLocaleString()} Aura</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER: Profile Canvas */}
        <section className="col-span-6 overflow-y-auto pr-2">
          {selected ? (
            <div className="space-y-4">
              {/* Identity card */}
              <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-primary">
                      {selected.display_name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-base text-foreground">{selected.display_name}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${
                        selected.account_status === "Active" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                        selected.account_status === "Suspended" ? "text-destructive border-destructive/20 bg-destructive/5" :
                        "text-amber-400 border-amber-500/20 bg-amber-500/5"
                      }`}>{selected.account_status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">@{selected.username}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      ID: {selected.id.slice(0, 12)}... · Joined {new Date(selected.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-border/20 text-xs font-semibold">
                  {[
                    { label: "Category", value: selected.competition_category },
                    { label: "Tier", value: selected.current_tier, color: getTierColor(selected.current_tier) },
                    { label: "Aura", value: `${selected.aura_points.toLocaleString()} pts` },
                    { label: "Subscription", value: selected.subscription_plan },
                    { label: "Location", value: `${selected.city}, ${selected.state}` },
                    { label: "Language", value: "English" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 rounded-xl bg-background/50 border border-border/60">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block">{label}</span>
                      <span className={`font-bold text-[11px] mt-0.5 block ${color || "text-foreground"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification status */}
              <div className="rounded-2xl border border-border bg-card/15 p-5 space-y-3 text-xs font-semibold">
                <h3 className="font-black text-xs text-foreground uppercase tracking-wider">Identity Verification</h3>
                <div className="flex gap-4">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] ${selected.mobile_verified ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"}`}>
                    {selected.mobile_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    Mobile {selected.mobile_verified ? "Verified" : "Pending"}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] ${selected.email_verified ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"}`}>
                    {selected.email_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    Email {selected.email_verified ? "Verified" : "Pending"}
                  </div>
                </div>
              </div>

              {/* Wallet snapshot (read-only) */}
              <div className="rounded-2xl border border-border bg-card/15 p-5 space-y-3 text-xs font-semibold">
                <h3 className="font-black text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Wallet Overview (Read-Only)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Wallet Balance", value: `₹${selected.wallet_balance.toLocaleString()}` },
                    { label: "Prize Balance", value: `₹${selected.prize_balance.toLocaleString()}`, color: "text-emerald-400" },
                    { label: "Subscription", value: selected.subscription_plan },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 rounded-xl bg-background/50 border border-border/60 text-center">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block">{label}</span>
                      <span className={`font-black text-sm mt-1 block ${color || "text-foreground"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full profile link */}
              <Link
                href={`/admin/participants/${selected.id}`}
                className="w-full h-10 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Open Full Profile Workspace
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs font-bold">
              Select a participant to view their profile.
            </div>
          )}
        </section>

        {/* RIGHT: Quick Actions + Stats */}
        <aside className="col-span-3 flex flex-col gap-3 overflow-y-auto">
          {selected && (
            <>
              {actionMsg && (
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">
                  {actionMsg}
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-3 text-xs font-semibold">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
                {[
                  { label: selected.account_status === "Suspended" ? "Activate Account" : "Suspend Account", danger: selected.account_status !== "Suspended" },
                  { label: "Force Logout", danger: false },
                  { label: "Reset OTP", danger: false },
                  { label: "Resend Notification", danger: false },
                  { label: "View Audit Logs", danger: false, link: "/admin/participants/activity" },
                  { label: "Open Support Desk", danger: false, link: "/admin/participants/support" },
                ].map(({ label, danger, link }) => link ? (
                  <Link key={label} href={link}
                    className="w-full h-9 px-3 rounded-xl border border-border hover:bg-muted/40 text-foreground font-bold flex items-center transition-colors text-[10px]">
                    {label}
                  </Link>
                ) : (
                  <button key={label} onClick={() => handleQuickAction(label)}
                    className={`w-full h-9 px-3 rounded-xl border font-bold flex items-center transition-colors text-[10px] ${
                      danger ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive" :
                      "border-border hover:bg-muted/40 text-foreground"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-card/25 p-4 space-y-3 text-xs font-semibold">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Contact</h3>
                <div className="space-y-2 text-[10px] text-muted-foreground leading-relaxed">
                  <div>Email: <strong className="text-foreground">{selected.email}</strong></div>
                  <div>Mobile: <strong className="text-foreground">{selected.mobile}</strong></div>
                  <div>Country: <strong className="text-foreground">{selected.country}</strong></div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

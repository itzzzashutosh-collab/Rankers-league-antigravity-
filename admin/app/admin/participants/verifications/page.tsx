"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserCheck, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { participantService, ParticipantListItem } from "@/services/participantService";

export default function VerificationsQueue() {
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await participantService.getParticipants();
      setParticipants(all.filter(p => !p.mobile_verified || !p.email_verified || p.account_status === "Pending Verification"));
      setLoading(false);
    }
    load();
  }, []);

  const handleApprove = async (p: ParticipantListItem) => {
    if (!confirm(`Approve verification for @${p.username}?`)) return;
    await participantService.updateStatus(p.id, "Active", "Verification approved by admin");
    setParticipants(prev => prev.filter(x => x.id !== p.id));
    alert(`@${p.username} verified and activated.`);
  };

  const handleReject = async (p: ParticipantListItem) => {
    if (!confirm(`Reject verification for @${p.username}?`)) return;
    await participantService.updateStatus(p.id, "Restricted", "Verification rejected by admin");
    setParticipants(prev => prev.filter(x => x.id !== p.id));
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/participants" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary" /> Identity Verification Queue</h1>
          <p className="text-xs text-muted-foreground mt-1">Review and approve pending mobile, email, or Gov ID verifications.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading Verification Queue...</div>
      ) : participants.length > 0 ? (
        <div className="space-y-3 text-xs font-semibold">
          {participants.map(p => (
            <div key={p.id} className="p-5 rounded-2xl border border-border/60 bg-card/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="font-bold text-foreground">{p.display_name} <span className="text-muted-foreground font-normal">@{p.username}</span></span>
                <div className="flex gap-3 text-[10px]">
                  <span className={p.mobile_verified ? "text-emerald-400" : "text-amber-400"}>
                    {p.mobile_verified ? "✓ Mobile" : "⏳ Mobile Pending"}
                  </span>
                  <span className={p.email_verified ? "text-emerald-400" : "text-amber-400"}>
                    {p.email_verified ? "✓ Email" : "⏳ Email Pending"}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{p.city}, {p.state} · {p.competition_category}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleApprove(p)}
                  className="h-9 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 font-bold text-[10px] flex items-center gap-1.5 transition-all">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => handleReject(p)}
                  className="h-9 px-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive font-bold text-[10px] flex items-center gap-1.5 transition-all">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400/30 mx-auto" />
          <span className="text-xs font-bold text-foreground block">All Verifications Cleared</span>
          <span className="text-[10px]">No pending identity verifications in the queue.</span>
        </div>
      )}
    </div>
  );
}

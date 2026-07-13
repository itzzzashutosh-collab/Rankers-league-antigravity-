"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, AlertOctagon } from "lucide-react";
import { participantService, ParticipantListItem } from "@/services/participantService";
import { securityService, LoginHistoryEntry } from "@/services/securityService";

export default function SecurityAnomalies() {
  const [suspiciousEntries, setSuspiciousEntries] = useState<(LoginHistoryEntry & { username: string })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ps = await participantService.getParticipants();
      const allFailed: any[] = [];
      for (const p of ps.slice(0, 3)) {
        const hist = await securityService.getLoginHistory(p.id);
        hist.filter(h => h.status === "Failed").forEach(h => allFailed.push({ ...h, username: p.username }));
      }
      setSuspiciousEntries(allFailed);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/participants" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Security Anomalies Center</h1>
          <p className="text-xs text-muted-foreground mt-1">Monitor suspicious login attempts, unrecognized devices, and account lockouts.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading Security Logs...</div>
      ) : suspiciousEntries.length > 0 ? (
        <div className="space-y-3 text-xs font-semibold">
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 flex items-center gap-2 text-[10px]">
            <AlertOctagon className="w-4 h-4 text-amber-500 shrink-0" />
            {suspiciousEntries.length} failed login event(s) detected. Review and take action.
          </div>
          {suspiciousEntries.map((entry, i) => (
            <div key={i} className="p-5 rounded-2xl border border-destructive/20 bg-destructive/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Failed Login Attempt</span>
                  <Link href={`/admin/participants`} className="text-[9px] text-primary hover:underline">@{entry.username}</Link>
                </div>
                <span className="text-[10px] text-muted-foreground block">Device: {entry.device_name} · IP: {entry.ip_address}</span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{new Date(entry.created_at).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
          <Shield className="w-12 h-12 text-emerald-400/30 mx-auto" />
          <span className="text-xs font-bold text-foreground block">No Security Anomalies Detected</span>
          <span className="text-[10px]">All login activity appears normal.</span>
        </div>
      )}
    </div>
  );
}

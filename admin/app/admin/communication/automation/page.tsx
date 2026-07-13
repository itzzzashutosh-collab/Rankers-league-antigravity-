"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, RefreshCw, Mail, MessageSquare, Plus, ChevronRight,
  TrendingUp, Calendar, AlertOctagon, Send
} from "lucide-react";
import { communicationService } from "@/services/communicationService";

export default function CommunicationOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await communicationService.getMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const navLinks = [
    { label: "Overview", href: "/admin/communication/automation" },
    { label: "Templates", href: "/admin/communication/templates" },
    { label: "Campaigns", href: "/admin/communication/campaigns" },
    { label: "Workflows", href: "/admin/communication/workflows" },
    { label: "Queue", href: "/admin/communication/queue" },
    { label: "History", href: "/admin/communication/history" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Communication Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Manage all platform outreach — transactional templates, dynamic segments, scheduling campaigns, and queue workers.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/communication/automation" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Messages Today", value: metrics.sentToday.toLocaleString(), color: "text-foreground" },
            { label: "Queued Payouts", value: metrics.queued.toString(), color: "text-primary" },
            { label: "Scheduled Runs", value: metrics.scheduled.toString(), color: "text-cyan-400" },
            { label: "Delivered", value: metrics.delivered.toLocaleString(), color: "text-emerald-400" },
            { label: "Failed Retries", value: metrics.failed.toString(), color: "text-destructive" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2">
              <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
              <span className={`text-2xl font-black block ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Campaign launch */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><Send className="w-4 h-4 text-primary" /> Dynamic Campaigns</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Broadcast announcements to filtered targets instantly. Setup recurring reminders or promotions.</p>
          </div>
          <Link href="/admin/communication/campaigns"
            className="h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Compose New Campaign
          </Link>
        </div>

        {/* Templates library */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-primary" /> Reusable Templates</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Define system template subject headers and bodies. Variable tags automatically parse before sending.</p>
          </div>
          <Link href="/admin/communication/templates"
            className="h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-xs hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
            Manage Templates
          </Link>
        </div>
      </div>
    </div>
  );
}

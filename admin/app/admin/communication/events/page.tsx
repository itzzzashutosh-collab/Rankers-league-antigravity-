"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Layers } from "lucide-react";
import { workflowService, AutomationWorkflow } from "@/services/workflowService";

export default function EventsDesk() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await workflowService.getWorkflows();
    setWorkflows(data);
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

  const PLATFORM_EVENTS = [
    { name: "Participant Registered", desc: "Fires instantly when a user creates an account" },
    { name: "Contest Joined", desc: "Fires when user successfully checks out registration fee" },
    { name: "Contest Started", desc: "Fires when examination lobby timer ticks to 0" },
    { name: "Contest Completed", desc: "Fires when exam script auto-submits" },
    { name: "Evaluation Finished", desc: "Fires when evaluator engine outputs result files" },
    { name: "Wallet Credited", desc: "Fires when top-up transactions verify" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Event Engine Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Listen to platform events and trigger automation workflows immediately.</p>
        </div>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/communication/workflows" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Events list */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Supported Platform Event Triggers</h2>
          <div className="divide-y divide-border/20 text-xs font-semibold">
            {PLATFORM_EVENTS.map(evt => (
              <div key={evt.name} className="py-3 flex justify-between items-center gap-4">
                <div>
                  <span className="text-foreground font-bold font-mono text-[11px] block">{evt.name}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{evt.desc}</span>
                </div>
                <span className="text-[9px] text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full font-black uppercase">Listen Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow links */}
        <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground">Linked Event Workflows</h2>
          <div className="divide-y divide-border/20 text-xs font-semibold">
            {workflows.map(wf => (
              <div key={wf.id} className="py-3 flex justify-between items-center gap-4">
                <span className="font-bold text-foreground truncate">{wf.name}</span>
                <span className="text-muted-foreground truncate">{wf.trigger_event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

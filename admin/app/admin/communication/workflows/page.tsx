"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Layers, CheckCircle2, Circle } from "lucide-react";
import { workflowService, AutomationWorkflow, WorkflowStep } from "@/services/workflowService";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [selected, setSelected] = useState<AutomationWorkflow | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await workflowService.getWorkflows();
    setWorkflows(data);
    if (data.length > 0) {
      setSelected(data[0]);
      const stps = await workflowService.getSteps(data[0].id);
      setSteps(stps);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelectWorkflow = async (wf: AutomationWorkflow) => {
    setSelected(wf);
    setLoading(true);
    const stps = await workflowService.getSteps(wf.id);
    setSteps(stps);
    setLoading(false);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await workflowService.toggleWorkflow(id, !current);
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !current } : w));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, active: !current } : null);
    setMsg(`✓ Workflow active toggle updated.`);
    setTimeout(() => setMsg(""), 3000);
  };

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
              href === "/admin/communication/workflows" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workflows Directory */}
        <aside className="lg:col-span-4 space-y-2">
          {workflows.map(wf => (
            <button key={wf.id} onClick={() => handleSelectWorkflow(wf)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                selected?.id === wf.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
              }`}>
              <div className="font-bold text-foreground leading-tight">{wf.name}</div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Trigger: {wf.trigger_event}</span>
                <span className={`font-bold ${wf.active ? "text-primary" : "text-muted-foreground"}`}>{wf.active ? "Active" : "Disabled"}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Visual Steps Canvas */}
        <section className="lg:col-span-8 rounded-3xl border border-border bg-card/15 p-6 space-y-5">
          {selected ? (
            <>
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h2 className="font-black text-sm text-foreground">{selected.name}</h2>
                  <span className="text-[10px] text-muted-foreground">{selected.description}</span>
                </div>
                <button onClick={() => handleToggleActive(selected.id, selected.active)}
                  className={`h-8 px-4 rounded-xl border font-bold text-[10px] transition-colors ${
                    selected.active ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"
                  }`}>
                  {selected.active ? "Active" : "Disabled"}
                </button>
              </div>

              {/* Vertical steps flow */}
              <div className="relative border-l border-border/60 pl-6 ml-3 space-y-6 pt-2">
                {steps.map(step => (
                  <div key={step.id} className="relative font-semibold text-xs text-foreground bg-background/25 border border-border/60 p-4 rounded-xl">
                    {/* Circle bullet */}
                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-background border border-border">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>

                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 uppercase font-black">
                      <span>Step {step.step_number}</span>
                      <span>{step.step_type}</span>
                    </div>

                    {step.step_type === "Send Message" && (
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">Notification Trigger Dispatch</span>
                        <span className="text-muted-foreground text-[10px]">Template ID: {step.config.template_id}</span>
                      </div>
                    )}

                    {step.step_type === "Wait" && (
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">Wait Node Delay</span>
                        <span className="text-muted-foreground text-[10px]">Duration: {step.config.duration_minutes} minutes</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 font-bold">Select a workflow automation to load canvas</div>
          )}
        </section>
      </div>
    </div>
  );
}

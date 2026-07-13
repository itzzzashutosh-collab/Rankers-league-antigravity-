"use client";

import React, { useState } from "react";
import { Layers, Play, CheckCircle, RefreshCw, Sparkles, DollarSign, Clock } from "lucide-react";
import { plannerService, TaskPlan } from "@/services/plannerService";

export default function WorkflowsPage() {
  const [taskTitle, setTaskTitle] = useState("Generate Contest Questions Strategy");
  const [taskDesc, setTaskDesc] = useState("Review the NEET Biology mock questions, retrieve guidelines, and return the exam blueprint.");
  const [plan, setPlan] = useState<TaskPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    const generated = await plannerService.generatePlan("t-mock-01", taskTitle, taskDesc);
    setPlan(generated);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Task Planner Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Input incoming tasks to generate structured multi-step execution graphs and estimated resource budgets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Planner Inputs Form */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary" /> Task Configuration</h2>
          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Task Title</label>
              <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                placeholder="e.g. Generate Contest Questions Strategy"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Task Description Context</label>
              <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={4}
                placeholder="Describe execution instructions..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none resize-none text-xs" />
            </div>
            <button onClick={handleGeneratePlan} disabled={loading}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity disabled:opacity-55 flex items-center justify-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> {loading ? "Generating Plan Graph..." : "Generate Execution Graph"}
            </button>
          </div>
        </div>

        {/* Dynamic Execution Graph Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          {plan ? (
            <div className="space-y-6 animate-fade-in">
              {/* Cost/Time metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-border bg-card/10 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" /> Estimated Cost</span>
                  <span className="text-sm font-black text-emerald-400">${plan.estimated_cost_usd}</span>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card/10 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> Est. Time</span>
                  <span className="text-sm font-black text-foreground">{plan.estimated_time_seconds}s</span>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card/10 space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Tokens Pool</span>
                  <span className="text-sm font-black text-foreground">{plan.estimated_tokens.toLocaleString()}</span>
                </div>
              </div>

              {/* Execution steps layout */}
              <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-border/20 pb-3">
                  <h3 className="font-black text-sm text-foreground">Graph Nodes Timeline</h3>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    plan.estimated_complexity === "High" ? "text-destructive border border-destructive/20 bg-destructive/5" : "text-amber-400 border border-amber-500/20 bg-amber-500/5"
                  }`}>Complexity: {plan.estimated_complexity}</span>
                </div>

                <div className="relative border-l border-border/40 pl-6 ml-3 space-y-5">
                  {plan.graph.map((node, idx) => (
                    <div key={node.node_id} className="relative bg-background/30 border border-border/60 p-4 rounded-xl flex items-center justify-between gap-4">
                      {/* Node Bullet */}
                      <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-background border border-border">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          node.status === "Completed" ? "bg-emerald-400" :
                          node.status === "Running" ? "bg-primary animate-pulse" : "bg-border"
                        }`} />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-muted-foreground uppercase font-black block">Node {idx + 1} · {node.node_id}</span>
                        <span className="font-bold text-foreground text-[11px] block">{node.label}</span>
                      </div>

                      <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        node.status === "Completed" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                        node.status === "Running" ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-border"
                      }`}>{node.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border border-dashed h-72 flex flex-col items-center justify-center text-muted-foreground/50 space-y-2">
              <Layers className="w-8 h-8 opacity-40 animate-pulse" />
              <div className="font-bold text-xs uppercase tracking-wider">No Execution Graph Active</div>
              <p className="text-[10px] text-muted-foreground/75 font-sans">Submit a task context on the left to verify the dynamic executor graph.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

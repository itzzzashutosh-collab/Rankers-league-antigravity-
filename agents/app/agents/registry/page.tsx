"use client";

import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, Plus, ShieldCheck, Zap } from "lucide-react";
import { aiosService, AiAgent } from "@/services/aiosService";
import { plannerService } from "@/services/plannerService";

export default function AgentRegistryPage() {
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await aiosService.getAgents();
    const skData = await plannerService.getSkills();
    setAgents(data);
    setSkills(skData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRegister = async () => {
    if (!name.trim()) { setMsg("❌ Agent name is required."); return; }
    setLoading(true);
    const agentId = `AGENT_${name.toUpperCase().replace(/\s+/g, "_")}`;
    const newAgent: AiAgent = {
      id: agentId,
      name,
      department_id: "DEP_EXEC",
      role_id: "ROLE_WRK",
      model_name: model,
      capabilities: ["TEXT_COMPOSITION"],
      priority,
      status: "Online",
      health_score: 100,
      version: "1.0.0",
    };
    await aiosService.registerAgent(newAgent);
    setMsg(`✓ Agent "${name}" registered successfully.`);
    setName("");
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  const STATUS_COLORS: Record<string, string> = {
    Online: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    Offline: "text-muted-foreground border-border bg-muted/5",
    Busy: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Error: "text-destructive border-destructive/20 bg-destructive/5",
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" /> AI Agent Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Directory of all registered autonomous agents, primary/fallback engines, capability scopes, and skill references.
          </p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Register Agent Form */}
        <div className="lg:col-span-4 rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Plus className="w-4 h-4 text-primary" /> Spawn New Agent Blueprint</h2>
          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Agent Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Finance Auditor"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Model Engine</label>
              <select value={model} onChange={e => setModel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                <option value="gpt-4o">GPT-4o (Primary)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Fallback)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Agent Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <button onClick={handleRegister}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity">
              Register & Inherit Blueprint
            </button>
          </div>
        </div>

        {/* Directory List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40">
              <h2 className="font-black text-sm text-foreground">Registered Nodes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                    <th className="p-4">Agent Code</th>
                    <th className="p-4">Engine</th>
                    <th className="p-4 text-center">Priority</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-semibold">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold">Querying registry...</td></tr>
                  ) : agents.map(agent => (
                    <tr key={agent.id} className="hover:bg-card/25 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-foreground">@{agent.name}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{agent.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-[10px] text-foreground">{agent.model_name}</div>
                        <div className="text-[9px] text-muted-foreground">Fallback: claude-3-5-sonnet</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-muted/40 text-foreground font-bold">{agent.priority}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[agent.status] || ""}`}>{agent.status}</span>
                      </td>
                      <td className="p-4 text-center text-foreground font-bold">{agent.health_score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Skill references list */}
          <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Inherited Skills Registry</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skills.map(sk => (
                <div key={sk.id} className="p-4 rounded-2xl border border-border bg-background/50 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> {sk.name}</div>
                  <p className="text-[10px] text-muted-foreground leading-normal">{sk.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

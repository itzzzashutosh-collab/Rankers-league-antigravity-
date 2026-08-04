"use client";

import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, Layers, ShieldCheck, Zap, Activity, DollarSign, FileText, Key, Plus, Lock, Check, Play, Terminal, X, BookOpen, Trophy } from "lucide-react";
import { aiAgentService, AiAgent, AiTaskPlan } from "@/services/aiAgentService";
import { aiCredentialsService, AiCredential } from "@/services/aiCredentialsService";
import BankAgentTab from "./BankAgentTab";
import ContestAgentTab from "./ContestAgentTab";

interface PlaygroundLog {
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "success" | "warning";
}

interface DecisionItem {
  id: string;
  title: string;
  agent: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function AdminAgentsPage() {
  const [activeTab, setActiveTab] = useState<"nodes" | "bank" | "contests" | "prompts" | "credentials">("nodes");
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [plans, setPlans] = useState<AiTaskPlan[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<AiCredential[]>([]);
  const [loading, setLoading] = useState(false);

  // New credential inputs
  const [provider, setProvider] = useState<"OpenAI" | "Anthropic" | "Gemini" | "OpenRouter">("OpenAI");
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [msg, setMsg] = useState("");

  // Playground & Real-time reasoning states
  const [selectedPlaygroundAgent, setSelectedPlaygroundAgent] = useState("AGENT_PLANNER");
  const [taskPrompt, setTaskPrompt] = useState("Analyze JEE advanced physics syllabus changes.");
  const [isRunningPlayground, setIsRunningPlayground] = useState(false);
  const [playgroundLogs, setPlaygroundLogs] = useState<PlaygroundLog[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([
    { id: "dec-1", title: "Verify JEEadvanced Physics Paper Blueprint", agent: "AGENT_VERIFIER", status: "Pending" },
    { id: "dec-2", title: "Approve NEET Chemistry test budget reallocation", agent: "AGENT_CEO", status: "Pending" }
  ]);

  const load = async () => {
    setLoading(true);
    const [agData, plData, prData, crData] = await Promise.all([
      aiAgentService.getAgents(),
      aiAgentService.getRecentTaskPlans(),
      aiAgentService.getPrompts(),
      aiCredentialsService.getCredentials()
    ]);
    setAgents(agData);
    setPlans(plData);
    setPrompts(prData);
    setCredentials(crData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveCredential = async () => {
    if (!label.trim() || !apiKey.trim()) {
      setMsg("❌ All credential fields are required.");
      return;
    }
    setLoading(true);
    await aiCredentialsService.saveCredential(provider, label, apiKey);
    setMsg("✓ Secure API Credential saved successfully.");
    setLabel("");
    setApiKey("");
    await load();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleToggleKey = async (id: string, active: boolean) => {
    await aiCredentialsService.toggleCredentialStatus(id, active);
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, is_active: active } : c));
  };

  // Run simulated playground real-time logs
  const handleLaunchPlayground = () => {
    if (!taskPrompt.trim()) return;
    setIsRunningPlayground(true);
    setPlaygroundLogs([]);

    const steps = [
      { delay: 1000, source: "Planner", msg: `Received trigger command: "${taskPrompt}"`, type: "info" as const },
      { delay: 2200, source: "Planner", msg: "Identified task nodes. Delegating copy creation to AGENT_EXECUTOR.", type: "info" as const },
      { delay: 3500, source: "Executor", msg: "Creating initial syllabus layout draft parameters.", type: "info" as const },
      { delay: 4800, source: "Reviewer", msg: "Auditing syllabus draft for structural match constraints... Passed.", type: "success" as const },
      { delay: 6000, source: "Verifier", msg: "Checking factual correctness against IIT-JEE 2026 notifications rules ledger... Status: Verified.", type: "success" as const },
      { delay: 7200, source: "CEO", msg: "Proposing final syllabus draft release approval to Founder queue.", type: "warning" as const },
    ];

    steps.forEach(step => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString();
        setPlaygroundLogs(prev => [
          ...prev,
          { timestamp: timeStr, source: step.source, message: step.msg, type: step.type }
        ]);

        if (step.source === "CEO") {
          // Push to pending decisions list
          setDecisions(prev => [
            { id: `dec-${Date.now()}`, title: `Publish JEE syllabus draft: "${taskPrompt.slice(0, 30)}..."`, agent: "AGENT_CEO", status: "Pending" },
            ...prev
          ]);
          setIsRunningPlayground(false);
        }
      }, step.delay);
    });
  };

  const handleDecision = (id: string, status: "Approved" | "Rejected") => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const timeStr = new Date().toLocaleTimeString();
    setPlaygroundLogs(prev => [
      ...prev,
      { timestamp: timeStr, source: "Founder", message: `Decision: ${status} for item ID: ${id.slice(0, 8)}`, type: status === "Approved" ? "success" : "warning" }
    ]);
  };

  const STATUS_COLORS: Record<string, string> = {
    Online: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    Offline: "text-muted-foreground border-border bg-muted/5",
    Busy: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    Error: "text-destructive border-destructive/20 bg-destructive/5",
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            AI Operating System (AIOS) Control Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Real-time operations center for autonomous agents. Inspect task execution graphs, reasoning runs, and credentials configuration vault.
          </p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border/40 gap-4 shrink-0 font-sans">
        {[
          { id: "nodes", name: "Telemetry & Nodes", icon: Activity },
          { id: "bank", name: "Question Bank Agent", icon: BookOpen },
          { id: "contests", name: "Contest Agent", icon: Trophy },
          { id: "prompts", name: "Agent Prompts Library", icon: FileText },
          { id: "credentials", name: "Credentials Vault & Models", icon: Key },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.name}
            </button>
          );
        })}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      {/* Tab Content 1: Telemetry */}
      {activeTab === "nodes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
            {[
              { label: "Registered Agents", value: agents.length.toString() },
              { label: "Running Tasks", value: plans.filter(p => p.status === "Execution").length.toString(), color: "text-primary" },
              { label: "Token Payout Budget", value: "$1.4850", color: "text-emerald-400" },
              { label: "Safety Confidence Mean", value: "93.4%", color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl border border-border bg-card/15 space-y-2 shadow-sm">
                <span className="text-[9px] text-muted-foreground uppercase font-black block">{label}</span>
                <span className={`text-2xl font-black block ${color || "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* PLAYGROUND SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            {/* Interactive Form */}
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Play className="w-4 h-4 text-primary" /> Run Real-time Agent Playground</h2>
              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase font-black block mb-1">Target Agent</label>
                  <select value={selectedPlaygroundAgent} onChange={e => setSelectedPlaygroundAgent(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background/50 focus:outline-none">
                    <option value="AGENT_PLANNER">Task Planner Agent</option>
                    <option value="AGENT_EXECUTOR">Task Executor Agent</option>
                    <option value="AGENT_REVIEWER">Reviewer QA Agent</option>
                    <option value="AGENT_VERIFIER">Evidence Verifier Agent</option>
                    <option value="AGENT_CEO">Digital CEO Agent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase font-black block mb-1">Instruction Task Prompt</label>
                  <textarea value={taskPrompt} onChange={e => setTaskPrompt(e.target.value)}
                    rows={3}
                    placeholder="e.g. Schedule marketing campaign for UPSC exam..."
                    className="w-full p-3 rounded-lg border border-border bg-background/50 focus:outline-none text-[11px] leading-relaxed" />
                </div>
                <button onClick={handleLaunchPlayground} disabled={isRunningPlayground}
                  className="w-full h-9 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  {isRunningPlayground ? "Running Reasoning Loop..." : "Launch Agent Task"}
                </button>
              </div>
            </section>

            {/* Live Terminal Terminal Logs */}
            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden flex flex-col h-72">
              <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <h2 className="font-black text-sm text-foreground">AIOS Real-time Reasoning Terminal Log</h2>
              </div>
              <div className="p-4 flex-1 bg-black/45 overflow-y-auto font-mono text-[10px] space-y-2 text-foreground/90">
                {playgroundLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-muted-foreground">[{log.timestamp}]</span>
                    <span className="font-bold text-primary">[{log.source}]</span>
                    <span className={log.type === "success" ? "text-emerald-400 font-bold" : log.type === "warning" ? "text-amber-400 font-bold" : "text-foreground"}>
                      {log.message}
                    </span>
                  </div>
                ))}
                {playgroundLogs.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground/50">Terminal idle. Enter prompt and click launch to inspect live logs.</div>
                )}
              </div>
            </section>
          </div>

          {/* DECISIONS QUEUE SECTION */}
          <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-6">
            <h2 className="font-black text-sm text-foreground">Founder Live Decisions & Approvals Queue</h2>
            <div className="space-y-4 font-sans">
              {decisions.map((dec) => (
                <div key={dec.id} className="p-4 rounded-xl border border-border bg-background/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-black font-mono">Proposed by {dec.agent}</span>
                    <h4 className="font-bold text-foreground text-xs">{dec.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {dec.status === "Pending" ? (
                      <>
                        <button onClick={() => handleDecision(dec.id, "Rejected")} className="h-8 px-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors font-bold">
                          Reject
                        </button>
                        <button onClick={() => handleDecision(dec.id, "Approved")} className="h-8 px-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-colors font-bold">
                          Approve Sign
                        </button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-black uppercase ${
                        dec.status === "Approved" ? "text-emerald-400" : "text-destructive"
                      }`}>{dec.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Registry & Historical Queue list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 rounded-3xl border border-border bg-card/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center">
                <h2 className="font-black text-sm text-foreground">Operational Node Registry</h2>
                <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase">Active Grid</span>
              </div>
              <div className="divide-y divide-border/40 p-4 space-y-3">
                {agents.map(agent => (
                  <div key={agent.id} className="p-4 rounded-2xl border border-border bg-background/45 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">@{agent.name}</h3>
                        <span className="font-mono text-[9px] text-muted-foreground">{agent.id}</span>
                      </div>
                      <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[agent.status] || ""}`}>{agent.status}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground border-t border-border/10 pt-2 font-sans">
                      <span>Engine: <strong className="text-foreground font-mono">{agent.model_name}</strong></span>
                      <span>Health: <strong className="text-foreground font-mono">{agent.health_score}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40">
                <h2 className="font-black text-sm text-foreground">Task Planner Graph Executions</h2>
              </div>
              <div className="p-6 space-y-6">
                {plans.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl border border-border bg-background/50 space-y-3 font-sans">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-primary uppercase font-black block">Planner Execution: {p.id.slice(0, 8)}</span>
                        <h4 className="font-black text-xs text-foreground leading-tight">{p.title}</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal">{p.description}</p>
                      </div>
                      <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        p.status === "Execution" ? "text-primary border-primary/20 bg-primary/5 animate-pulse" : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                      }`}>{p.status}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-border/10 pt-3 text-[10px] text-muted-foreground">
                      <div>Assigned: <strong className="text-foreground">{p.assigned_agent_id}</strong></div>
                      <div>Complexity: <strong className="text-foreground">{p.priority} Priority</strong></div>
                      <div className="text-right flex items-center justify-end gap-0.5 text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        <strong>{p.estimated_cost_usd} USD</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Tab Content: Question Bank Agent */}
      {activeTab === "bank" && <BankAgentTab />}

      {/* Tab Content: Contest Agent */}
      {activeTab === "contests" && <ContestAgentTab />}

      {/* Tab Content 2: Prompts */}
      {activeTab === "prompts" && (
        <div className="rounded-3xl border border-border bg-card/15 overflow-hidden font-sans">
          <div className="px-6 py-4 border-b border-border/40">
            <h2 className="font-black text-sm text-foreground">AIOS System Prompts Library</h2>
          </div>
          <div className="divide-y divide-border/40">
            {prompts.map(p => (
              <div key={p.id} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-foreground">{p.id}</h3>
                    <span className="text-[9px] text-muted-foreground font-bold">Template Version: v{p.version}</span>
                  </div>
                  <span className="text-[8px] border border-primary/20 bg-primary/5 text-primary font-black uppercase px-2 py-0.5 rounded-full">Approved</span>
                </div>
                <div className="bg-background/50 border border-border/60 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-foreground select-all">
                  {p.prompt_template}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Expected Format Output Checkpoint: <strong className="text-foreground">{p.expected_output}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Credentials */}
      {activeTab === "credentials" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Form */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
            <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Store Provider Key</h2>
            <div className="space-y-3.5 text-xs font-semibold">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">AI Provider</label>
                <select value={provider} onChange={e => setProvider(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                  <option value="OpenAI">OpenAI (sk-proj-...)</option>
                  <option value="Anthropic">Anthropic (sk-ant-...)</option>
                  <option value="Gemini">Gemini API Key</option>
                  <option value="OpenRouter">OpenRouter</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Credential Label</label>
                <input value={label} onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Master Production Key"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Raw API Key</label>
                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
              </div>
              <button onClick={handleSaveCredential} disabled={loading}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Save API Key to Vault
              </button>
            </div>
          </div>

          {/* List of keys & models */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-border bg-card/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40">
                <h2 className="font-black text-sm text-foreground">API Vault Registry</h2>
              </div>
              <div className="overflow-x-auto text-[10px]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                      <th className="p-4">Provider</th>
                      <th className="p-4">Label</th>
                      <th className="p-4">Masked Key</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-semibold">
                    {credentials.map(c => (
                      <tr key={c.id} className="hover:bg-card/25 transition-colors">
                        <td className="p-4 font-bold text-foreground">{c.provider}</td>
                        <td className="p-4 text-foreground">{c.label}</td>
                        <td className="p-4 font-mono text-[9px] text-muted-foreground">{c.api_key_masked}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleKey(c.id, !c.is_active)}
                            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border transition-colors ${
                              c.is_active ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-muted-foreground border-border bg-muted/5"
                            }`}
                          >
                            {c.is_active ? "Active" : "Disabled"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model listings */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <h2 className="font-black text-sm text-foreground">Active Model Engines Configs</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "gpt-4o", provider: "OpenAI", type: "Primary Reasoning" },
                  { name: "claude-3-5-sonnet", provider: "Anthropic", type: "Primary Marketing" },
                  { name: "gemini-1.5-pro", provider: "Gemini", type: "Verification Logic" },
                  { name: "meta-llama-3", provider: "Local API", type: "Fallback Router" },
                ].map(m => (
                  <div key={m.name} className="p-4 rounded-2xl border border-border bg-background/50 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground font-mono">{m.name}</span>
                      <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">{m.provider}</span>
                    </div>
                    <span className="text-[9px] text-primary font-bold block">{m.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

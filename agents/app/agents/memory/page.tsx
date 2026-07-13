"use client";

import React, { useState, useEffect } from "react";
import { Database, RefreshCw, Plus } from "lucide-react";
import { aiosService, MemoryBlock } from "@/services/aiosService";

export default function MemoryWorkspacePage() {
  const [memories, setMemories] = useState<MemoryBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await aiosService.getMemories();
    setMemories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveMemory = async () => {
    if (!key.trim() || !val.trim()) { setMsg("❌ Both key and value are required."); return; }
    setLoading(true);
    await aiosService.saveMemory({
      agent_id: "AGENT_CEO",
      memory_type: "Semantic",
      memory_key: key,
      memory_value: val,
    });
    setMsg("✓ Memory block written to database.");
    setKey("");
    setVal("");
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> Shared Memory Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Inspect semantic keys, short-term session logs, and vector document embeddings.
          </p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold font-sans">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Memory Creator */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Plus className="w-4 h-4 text-primary" /> Store Memory Key</h2>
          <div className="space-y-3 font-semibold text-xs">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Memory Key</label>
              <input value={key} onChange={e => setKey(e.target.value)}
                placeholder="e.g. JEE_PASS_MARK"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Value Context</label>
              <textarea value={val} onChange={e => setVal(e.target.value)} rows={3}
                placeholder="Details or platform rules..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none resize-none text-xs" />
            </div>
            <button onClick={handleSaveMemory}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity">
              Store Memory Block
            </button>
          </div>
        </div>

        {/* Memory list */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 font-sans">
            <h2 className="font-black text-sm text-foreground">Stored Memories</h2>
          </div>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60 font-sans">
                  <th className="p-3">Key</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-semibold">
                {loading ? (
                  <tr><td colSpan={4} className="text-center p-8 text-muted-foreground/60 animate-pulse font-bold font-sans">Loading Memory Registry...</td></tr>
                ) : memories.map(m => (
                  <tr key={m.id} className="hover:bg-card/25 transition-colors">
                    <td className="p-3 text-foreground font-bold">{m.memory_key}</td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate font-sans">{m.memory_value}</td>
                    <td className="p-3">
                      <span className="text-[8px] font-black border border-primary/20 bg-primary/5 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">{m.memory_type}</span>
                    </td>
                    <td className="p-3 text-right text-muted-foreground font-sans">{new Date(m.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

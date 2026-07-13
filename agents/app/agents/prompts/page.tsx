"use client";

import React, { useState, useEffect } from "react";
import { FileText, RefreshCw, Save, Edit3, Eye } from "lucide-react";
import { aiosService, PromptTemplate } from "@/services/aiosService";

export default function PromptsLibraryPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [selected, setSelected] = useState<PromptTemplate | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await aiosService.getPrompts();
    setPrompts(data);
    if (data.length > 0) {
      setSelected(data[0]);
      setTemplateText(data[0].prompt_template);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelect = (p: PromptTemplate) => {
    setSelected(p);
    setTemplateText(p.prompt_template);
  };

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    await aiosService.updatePrompt(selected.id, templateText);
    setMsg("✓ Prompt version registry updated.");
    setPrompts(prev => prev.map(p => p.id === selected.id ? { ...p, prompt_template: templateText, version: p.version + 1 } : p));
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4 font-sans">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Prompt Library Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Version-controlled system prompts, variable requirements, and validation rule constraints.
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
        {/* Prompts list */}
        <aside className="lg:col-span-4 space-y-2 font-sans">
          <h2 className="font-black text-sm text-foreground uppercase tracking-wider mb-2">System Prompts</h2>
          {prompts.map(p => (
            <button key={p.id} onClick={() => handleSelect(p)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                selected?.id === p.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
              }`}>
              <div className="font-bold text-foreground leading-tight">{p.id}</div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Version: v{p.version}</span>
                <span className="text-emerald-400 font-bold">Approved</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Editor & Preview */}
        {selected ? (
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><Edit3 className="w-4 h-4 text-primary" /> Edit Prompt</h3>
                <button onClick={handleSave}
                  className="h-8 px-4 rounded-xl bg-primary text-primary-foreground font-black text-[10px] hover:opacity-90">
                  Save Prompt
                </button>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1">Prompt Template</label>
                <textarea value={templateText} onChange={e => setTemplateText(e.target.value)} rows={8}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none resize-none font-mono text-[11px] leading-relaxed" />
              </div>
            </div>

            {/* Validation */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
              <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary" /> Validations & Output</h3>
              <div className="p-4 rounded-2xl border border-border/60 bg-background/30 space-y-3 leading-relaxed text-[11px]">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Expected Output Format</span>
                  <span className="font-mono text-[10px] text-foreground block mt-0.5">{selected.expected_output || "Unspecified"}</span>
                </div>
                <div className="border-t border-border/20 pt-3">
                  <span className="text-[9px] text-muted-foreground uppercase font-black block">Sanity Check Assertions</span>
                  <span className="text-muted-foreground text-[10px] leading-normal block mt-1">JSON response validation schemas</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center text-muted-foreground/40 font-bold">Select a prompt template to load workspace</div>
        )}
      </div>
    </div>
  );
}

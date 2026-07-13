"use client";

import React, { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [temperature, setTemperature] = useState("0.2");
  const [maxBudget, setMaxBudget] = useState("50.00");
  const [msg, setMsg] = useState("");

  const handleSave = () => {
    setMsg("✓ AIOS Operating System parameters saved.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> AIOS System Rules
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Configure global default temperatures, reasoning mode models, and monthly department budgets.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold font-sans">{msg}</div>
      )}

      <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-5 max-w-xl font-sans">
        <h2 className="font-black text-sm text-foreground">Operational Rule Parameters</h2>
        <div className="space-y-3.5 text-xs font-semibold">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Default LLM Temperature</label>
            <input value={temperature} onChange={e => setTemperature(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Max Monthly Budget (USD)</label>
            <input value={maxBudget} onChange={e => setMaxBudget(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
          </div>
          <button onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-opacity flex items-center gap-1.5 mt-2">
            <Save className="w-4 h-4" /> Save AIOS Settings
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { participantService, ParticipantListItem } from "@/services/participantService";

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParticipantListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await participantService.getParticipants(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/participants" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><SearchIcon className="w-5 h-5 text-primary" /> Advanced Search</h1>
          <p className="text-xs text-muted-foreground mt-1">Search by name, username, email, mobile, or participant ID.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && runSearch()}
          placeholder="Enter name, @username, email..." className="flex-1 h-10 px-4 text-xs rounded-xl border border-border bg-background/50 focus:outline-none" />
        <button onClick={runSearch} className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-colors">Search</button>
      </div>
      {loading && <div className="text-center text-xs text-muted-foreground animate-pulse py-8">Searching...</div>}
      {results.length > 0 && (
        <div className="space-y-2 text-xs font-semibold">
          {results.map(p => (
            <Link key={p.id} href={`/admin/participants/${p.id}`} className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/10 hover:bg-card/25 transition-all group">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">{p.display_name}</span>
                <span className="text-[10px] text-muted-foreground block">@{p.username} · {p.email} · {p.competition_category}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${p.account_status === "Active" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-destructive border-destructive/20 bg-destructive/5"}`}>{p.account_status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

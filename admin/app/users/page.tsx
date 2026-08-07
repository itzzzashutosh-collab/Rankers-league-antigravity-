"use client";

import * as React from "react";
import { Users, Search, Award, ShieldCheck, CheckCircle2, User, Wallet } from "lucide-react";

interface AspirantAdminItem {
  id: string;
  fullName: string;
  username: string;
  primaryExam: string;
  academicLevel: string;
  nationalRank: number;
  auraPoints: number;
  walletBalance: number;
  contestsJoined: number;
  status: "active" | "suspended";
}

export default function AspirantsAdminPage() {
  const [search, setSearch] = React.useState("");
  const [selectedAspirant, setSelectedAspirant] = React.useState<AspirantAdminItem | null>(null);
  const [aspirants, setAspirants] = React.useState<AspirantAdminItem[]>([
    {
      id: "u1",
      fullName: "Aarav Sharma",
      username: "aarav_topper",
      primaryExam: "JEE_MAIN",
      academicLevel: "Class 12",
      nationalRank: 1,
      auraPoints: 4850,
      walletBalance: 12500,
      contestsJoined: 18,
      status: "active",
    },
    {
      id: "u2",
      fullName: "Diya Patel",
      username: "diya_neet",
      primaryExam: "NEET_UG",
      academicLevel: "Class 12",
      nationalRank: 3,
      auraPoints: 4420,
      walletBalance: 8400,
      contestsJoined: 15,
      status: "active",
    },
    {
      id: "u3",
      fullName: "Rohan Verma",
      username: "rohan_upsc",
      primaryExam: "UPSC_CSE",
      academicLevel: "Graduate",
      nationalRank: 7,
      auraPoints: 3980,
      walletBalance: 4200,
      contestsJoined: 12,
      status: "active",
    },
  ]);

  const toggleStatus = (id: string) => {
    setAspirants(
      aspirants.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "suspended" : "active" } : a
      )
    );
  };

  const filtered = aspirants.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.primaryExam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Aspirant Profile Directory</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            View registered student profiles, national ranks, aura points, and wallet balances.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-card/40 border border-border/40 rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search aspirant name, username, or exam target..."
            className="w-full bg-background/50 border border-border/40 rounded-lg pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Aspirants Table */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Aspirant</th>
                <th className="pb-3 px-3">Primary Exam Target</th>
                <th className="pb-3 px-3">Academic Level</th>
                <th className="pb-3 px-3">National Rank</th>
                <th className="pb-3 px-3">Aura Points</th>
                <th className="pb-3 px-3">Wallet Balance</th>
                <th className="pb-3 px-3">Contests</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{u.fullName}</span>
                        <span className="text-[10px] text-muted-foreground">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-mono font-bold text-[11px] bg-secondary/60 border border-border/40 px-2 py-1 rounded-md">
                      {u.primaryExam}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-muted-foreground font-medium">
                    {u.academicLevel}
                  </td>
                  <td className="py-4 px-3 font-mono font-black text-amber-400">
                    AIR #{u.nationalRank}
                  </td>
                  <td className="py-4 px-3 font-mono font-bold text-violet-400">
                    ⚡ {u.auraPoints} pts
                  </td>
                  <td className="py-4 px-3 font-mono font-black text-emerald-400">
                    ₹{u.walletBalance.toLocaleString()}
                  </td>
                  <td className="py-4 px-3 font-mono font-bold">
                    {u.contestsJoined} Leagues
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        u.status === "active"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> {u.status === "active" ? "Active" : "Suspended"}
                    </button>
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() => setSelectedAspirant(u)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      View Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aspirant Profile Modal */}
      {selectedAspirant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-base">
                  {selectedAspirant.fullName[0]}
                </div>
                <div>
                  <h2 className="text-base font-black font-heading text-foreground">{selectedAspirant.fullName}</h2>
                  <span className="text-xs text-muted-foreground">@{selectedAspirant.username}</span>
                </div>
              </div>
              <button onClick={() => setSelectedAspirant(null)} className="text-xs font-bold text-muted-foreground hover:text-foreground">✕ Close</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-background/50 border border-border/30 rounded-xl p-4">
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground">National Rank</span>
                <span className="font-mono font-black text-amber-400 text-sm">AIR #{selectedAspirant.nationalRank}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground">Aura Points</span>
                <span className="font-mono font-black text-violet-400 text-sm">⚡ {selectedAspirant.auraPoints}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground">Wallet Balance</span>
                <span className="font-mono font-black text-emerald-400 text-sm">₹{selectedAspirant.walletBalance.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground">Joined Contests</span>
                <span className="font-mono font-bold text-foreground text-sm">{selectedAspirant.contestsJoined}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  toggleStatus(selectedAspirant.id);
                  setSelectedAspirant(null);
                }}
                className={`flex-1 py-2 rounded-xl font-bold text-xs ${
                  selectedAspirant.status === "active"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {selectedAspirant.status === "active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

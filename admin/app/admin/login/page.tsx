"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, KeyRound, Mail, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate authenticating against Supabase Admin profiles
    setTimeout(() => {
      if (email === "admin@rankersleague.com" && password === "AdminPass1234!") {
        setSuccess(true);
        localStorage.setItem("admin-token", "mock-supabase-admin-session-token");
        setTimeout(() => {
          router.push("/admin/overview");
        }, 1000);
      } else {
        setError("Invalid administrative credentials or insufficient RBAC privileges.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      {/* Brand Icon */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/25 animate-pulse">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-foreground">
          Ranker&apos;s League
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
          Enterprise Control Panel
        </p>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl glass-panel border border-border bg-card/45 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

        <h2 className="text-sm font-bold text-foreground mb-6">
          Access Authentication
        </h2>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground block">Admin Email</label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rankersleague.com"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground block">Secure Keyphrase</label>
            <div className="relative flex items-center">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold leading-relaxed">Authority Confirmed. Accessing Core...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold transition-all flex items-center justify-center gap-2 mt-6 shadow-md shadow-primary/20"
          >
            {loading ? "Verifying Keys..." : "Authenticate Access"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSuccess(true);
              localStorage.setItem("admin-token", "mock-supabase-admin-session-token");
              setTimeout(() => {
                router.push("/admin/overview");
              }, 500);
            }}
            className="w-full h-10 rounded-xl border border-primary/40 hover:bg-primary/10 text-primary font-bold transition-all flex items-center justify-center gap-2 mt-2"
          >
            Dev Bypass (Go to Admin)
          </button>
        </form>
      </motion.div>

      {/* Seed helper */}
      <div className="mt-8 p-4 rounded-2xl border border-border/80 bg-muted/20 text-center text-[10px] text-muted-foreground/80 leading-relaxed">
        <span className="font-black uppercase tracking-wider block mb-1 text-[9px] text-primary">
          Seed Testing Credentials
        </span>
        <div className="space-y-0.5">
          <div>Email: <span className="font-mono font-bold text-foreground">admin@rankersleague.com</span></div>
          <div>Password: <span className="font-mono font-bold text-foreground">AdminPass1234!</span></div>
        </div>
      </div>
    </div>
  );
}

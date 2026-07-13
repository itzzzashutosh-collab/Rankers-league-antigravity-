"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/30 border border-border/30 mb-4">
          <Clock className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">Session Expired</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Your session has expired for security reasons. Please sign in again to continue.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          Sign In Again
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

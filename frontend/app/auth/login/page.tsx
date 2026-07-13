"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, KeyRound, ArrowRight, Shield, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState(errorParam || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_status, username")
          .eq("id", data.user.id)
          .single();

        if (!profile?.username || profile.profile_status !== "complete") {
          router.push("/auth/complete-profile");
        } else {
          // Redirect to intended page or dashboard
          router.push(redirect === "/" ? "/dashboard" : redirect);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const callbackUrl = `${window.location.origin}/auth/callback${redirect && redirect !== "/" ? `?next=${encodeURIComponent(redirect)}` : ""}`;
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (googleError) {
        setError(googleError.message);
        setIsGoogleLoading(false);
      }
      // Note: on success, browser redirects — no need to setIsGoogleLoading(false)
    } catch {
      setError("Google Sign In failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Card */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20">
        {/* Icon + Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter your credentials or choose your auth provider.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 border-border/60 hover:bg-muted/30 font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>


          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider shrink-0">or continue with email</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading || isGoogleLoading}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground">Password</label>
                <Link href="/auth/forgot-access" className="text-[10px] text-primary font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading || isGoogleLoading}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !email || !password}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200",
                "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
                "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                (isLoading || isGoogleLoading || !email || !password) ? "opacity-60 cursor-not-allowed" : ""
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 pt-5 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            New to Ranker&apos;s League?{" "}
            <Link href="/auth/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Shield, text: "256-bit encrypted", sub: "End-to-end secure" },
          { icon: Zap, text: "Google OAuth", sub: "Instant sign in" },
        ].map(({ icon: Icon, text, sub }) => (
          <div key={text} className="flex items-center gap-2.5 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl px-4 py-3">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-foreground">{text}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </React.Suspense>
  );
}

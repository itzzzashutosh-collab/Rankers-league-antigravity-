"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight, Shield, Star, Mail, KeyRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";


export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        router.push("/auth/complete-profile");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!agreed) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    setError("");
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/complete-profile`,
        },
      });

      if (googleError) {
        setError(googleError.message);
      }
    } catch {
      setError("Google Sign Up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Card */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <UserPlus className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Join the League</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Create your account with your email or choose Google.
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
            onClick={handleGoogleSignUp}
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
              <label className="text-xs font-bold text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading || isGoogleLoading}
                className="w-full rounded-xl border-2 border-border/50 bg-card/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200",
                  agreed ? "bg-primary border-primary" : "border-border/50 group-hover:border-primary/50"
                )}>
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary underline underline-offset-2 hover:no-underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="text-primary underline underline-offset-2 hover:no-underline">Privacy Policy</Link>
              </p>
            </label>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !email || !password || !agreed}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200",
                "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
                "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                (isLoading || isGoogleLoading || !email || !password || !agreed) ? "opacity-60 cursor-not-allowed" : ""
              )}
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />Creating Account...</>
              ) : (
                <>Create Account<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 pt-5 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-black text-foreground uppercase tracking-widest">What you get</p>
        {[
          "Compete in 500+ live exam contests",
          "Real-time national leaderboard rankings",
          "Win real prize money every week",
          "Your personal Ranker ID & public profile",
        ].map((perk) => (
          <div key={perk} className="flex items-center gap-2.5">
            <Star className="w-3.5 h-3.5 text-primary shrink-0 fill-primary" />
            <p className="text-xs text-muted-foreground">{perk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { OtpInput } from "@/components/auth/OtpInput";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

function VerifyOtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login"; // "login" | "register"

  const [phone, setPhone] = React.useState("");
  const [redirect, setRedirect] = React.useState("/");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [countdown, setCountdown] = React.useState(RESEND_COUNTDOWN);

  React.useEffect(() => {
    const storedPhone = sessionStorage.getItem("rl_auth_phone") || "";
    const storedRedirect = sessionStorage.getItem("rl_auth_redirect") || "/";
    setPhone(storedPhone);
    setRedirect(storedRedirect);

    if (!storedPhone) {
      router.replace("/auth/login");
    }
  }, [router]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-verify when all 6 digits are entered
  React.useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      handleVerify(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleVerify = async (otpValue: string) => {
    if (otpValue.length !== OTP_LENGTH) return;
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otpValue,
        type: "sms",
      });

      if (verifyError) {
        setError("Invalid OTP. Please check and try again.");
        setOtp("");
        return;
      }

      // Check if profile is complete
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_status, username")
          .eq("id", data.user.id)
          .single();

        if (!profile?.username || profile.profile_status !== "complete") {
          router.push("/auth/complete-profile");
        } else {
          router.push(redirect);
        }
      }
    } catch {
      setError("Verification failed. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({ phone, options: { channel: "sms" } });
      setCountdown(RESEND_COUNTDOWN);
      setOtp("");
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedPhone = phone ? `${phone.slice(0, -4).replace(/\d/g, "•")}${phone.slice(-4)}` : "";

  return (
    <div className="space-y-6">
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-2xl shadow-black/20">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Verify your number</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We sent a 6-digit OTP to
          </p>
          <p className="font-bold text-sm text-foreground bg-muted/20 rounded-lg px-4 py-2 inline-block">
            {maskedPhone}
          </p>
          <p className="text-xs text-muted-foreground">
            <Link href={`/auth/${mode}`} className="text-primary hover:underline">
              Change number
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          <OtpInput
            length={OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={!!error}
          />

          {error && (
            <p className="text-center text-sm text-destructive font-medium">{error}</p>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          )}

          {/* Resend */}
          <div className="text-center pt-2">
            {countdown > 0 ? (
              <p className="text-xs text-muted-foreground">
                Resend OTP in{" "}
                <span className="text-primary font-bold font-mono">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-1.5 mx-auto text-xs text-primary font-bold hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dev hint */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            🔧 Dev Mode — Use OTP from Supabase Dashboard logs or test OTP <strong>123456</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <VerifyOtpPageContent />
    </React.Suspense>
  );
}

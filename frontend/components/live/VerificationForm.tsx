"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle, Phone, Lock, Key } from "lucide-react";
import { liveContestRepository } from "../../repositories/LiveContestRepository";
import { InputField, Button, Card } from "../ui";
import { cn } from "@/lib/utils";

interface VerificationFormProps {
  contestSlug: string;
  className?: string;
}

export function VerificationForm({ contestSlug, className }: VerificationFormProps) {
  const router = useRouter();
  const [accessId, setAccessId] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [securityCode, setSecurityCode] = React.useState("");
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setProgressPercent(0);

    if (!accessId.trim() || !mobileNumber.trim() || !securityCode.trim()) {
      setErrorMessage("All verification parameters are mandatory.");
      return;
    }

    setIsSubmitting(true);

    // Simulate cryptographic validation progress bar
    const duration = 2000;
    const intervalTime = 100;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min(95, Math.round((currentStep / steps) * 100));
      setProgressPercent(percent);
    }, intervalTime);

    try {
      const session = await liveContestRepository.verifyAccess(
        contestSlug,
        accessId,
        mobileNumber,
        securityCode
      );

      clearInterval(timer);

      if (session.success && session.registrationToken) {
        setProgressPercent(100);
        // Save session details to local storage (mock adapter setup)
        localStorage.setItem(`contest-session-${contestSlug}`, session.registrationToken);
        
        setTimeout(() => {
          router.push(`/live/${contestSlug}/lobby`);
        }, 500);
      } else {
        setIsSubmitting(false);
        setProgressPercent(0);
        
        const errors = {
          invalid_id: "Invalid User ID (Username) or mobile number registration match.",
          incorrect_code: "Incorrect Security Code. Key verification failed.",
          contest_closed: "Championship registration is closed.",
          not_started: "Enrollment timeline has not started.",
          finished: "Championship has already finished.",
          too_many_attempts: "Too many failed attempts. Security lock engaged."
        };
        setErrorMessage(errors[session.error || "invalid_id"]);
      }
    } catch (err) {
      clearInterval(timer);
      setIsSubmitting(false);
      setProgressPercent(0);
      setErrorMessage("Verification system offline. Please retry.");
    }
  };

  return (
    <Card variant="glass" className={cn("border border-border/40 p-6 sm:p-8 rounded-2xl shadow-2xl", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
        
        <div className="border-b border-border/25 pb-4 mb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Security Passkey Verification
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Enter the unique credentials generated for your championship registration.
          </p>
        </div>

        {/* User ID (Username) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-primary" />
            User ID (Username)
          </label>
          <InputField
            type="text"
            placeholder="e.g. aspirant101"
            value={accessId}
            onChange={(e) => setAccessId(e.target.value)}
            disabled={isSubmitting}
            className="border-border/80"
          />
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" />
            Registered Mobile Number
          </label>
          <InputField
            type="text"
            placeholder="9876543210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            disabled={isSubmitting}
            className="border-border/80"
          />
        </div>

        {/* Security Code */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Secret Security Code
          </label>
          <InputField
            type="password"
            placeholder="SEC-XXX"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            disabled={isSubmitting}
            className="border-border/80"
          />
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 bg-destructive/5 border border-destructive/15 rounded-xl text-destructive text-xs flex items-start gap-2.5 leading-relaxed animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress verification panel */}
        {isSubmitting && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                Encrypting verification tokens...
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full py-3 text-xs uppercase tracking-wider font-bold rounded-xl mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify & Join Lobby"}
        </Button>
      </form>
    </Card>
  );
}
export default VerificationForm;

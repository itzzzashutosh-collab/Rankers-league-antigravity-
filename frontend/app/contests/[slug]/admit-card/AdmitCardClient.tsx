"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Printer,
  Calendar,
  Clock,
  User,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Lock,
  X,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { AdmitCard } from "@/services/auth/contestRegistrationService";

interface AdmitCardClientProps {
  contestSlug: string;
  dbContestId: string;
  admitCard: AdmitCard;
}

export default function AdmitCardClient({ contestSlug, dbContestId, admitCard }: AdmitCardClientProps) {
  const router = useRouter();
  
  // Mounted check to prevent SSR hydration errors
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Time Lock & Countdown States
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lobbyOpen, setLobbyOpen] = React.useState(false);
  const [demoBypass, setDemoBypass] = React.useState(false);

  // Device Verification States
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [deviceFingerprint] = React.useState("MOCK_FINGERPRINT_999888"); // mock unique fingerprint for testing device
  const [deviceName] = React.useState("Mock browser device");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [simulatedReceivedOtp, setSimulatedReceivedOtp] = React.useState<string | null>(null);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);

  // Target exam details parser
  const getExamTargetDate = () => {
    if (contestSlug === "upsc-elite") return new Date("2026-07-12T09:30:00");
    if (contestSlug === "jee-advanced") return new Date("2026-07-15T14:00:00");
    return new Date("2026-07-18T10:00:00");
  };

  React.useEffect(() => {
    if (!mounted) return;

    const examDate = getExamTargetDate();
    const lobbyDate = new Date(examDate.getTime() - 30 * 60 * 1000); // 30 mins before start

    const updateTimer = () => {
      const now = new Date();
      const diffMs = lobbyDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setLobbyOpen(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [mounted, contestSlug]);

  const handleEnterLobby = async () => {
    // 1. Verify if device fingerprint is currently trusted
    try {
      const res = await fetch("/api/auth/contests/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_device",
          fingerprint: deviceFingerprint
        })
      });
      const data = await res.json();

      if (data.trusted) {
        // Device is already trusted, skip verify and redirect
        router.push(`/live/${contestSlug}/lobby`);
      } else {
        // Trigger verification dialog popup
        setShowOtpModal(true);
      }
    } catch (err) {
      console.error("Device verification error:", err);
      setShowOtpModal(true);
    }
  };

  // OTP triggers
  const handleSendOtp = async () => {
    setVerificationError(null);
    try {
      const res = await fetch("/api/auth/contests/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_code",
          contestId: dbContestId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setSimulatedReceivedOtp(data.code); // Store code to make it displayable in the simulated alert box
      } else {
        setVerificationError("Failed to trigger verification code.");
      }
    } catch (err) {
      setVerificationError("Network error. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit code.");
      return;
    }

    setVerifying(true);
    setVerificationError(null);

    try {
      const res = await fetch("/api/auth/contests/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_code",
          contestId: dbContestId,
          plainCode: otpCode,
          fingerprint: deviceFingerprint,
          deviceName: deviceName
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowOtpModal(false);
        router.push(`/live/${contestSlug}/lobby`);
      } else {
        setVerificationError("Invalid or expired verification code. Verify spelling.");
      }
    } catch (err) {
      setVerificationError("Verification connection failed.");
    } finally {
      setVerifying(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground animate-pulse">
        <Header />
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 space-y-4">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-96 bg-muted rounded-2xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 space-y-8 select-none printable-container">
        {/* Navigation back */}
        <Link
          href="/dashboard/my-contests"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group non-printable"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 non-printable">
          <div>
            <h1 className="text-xl font-black text-foreground">Official Digital Admit Card</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Please print or save a PDF copy for your academic files.</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="text-xs font-bold gap-1 border-border/60 hover:bg-muted/40"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Double-bordered Admit Card frame */}
        <div
          className="border-8 border-double border-primary/20 bg-card/20 rounded-2xl p-8 relative overflow-hidden space-y-8 shadow-xl"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.04) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Stamps/Branding */}
          <div className="flex justify-between items-start border-b border-border/20 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-primary uppercase block">Ranker&apos;s League</span>
              <span className="text-[9px] text-muted-foreground font-semibold block">National Talent Simulator Arena</span>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-3 h-3" /> Confirmed Seat
              </span>
              <p className="text-[9px] text-muted-foreground font-mono mt-1">ID: {admitCard.registrationNumber}</p>
            </div>
          </div>

          {/* Credentials details section split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Candidate credentials info */}
            <div className="md:col-span-2 space-y-5 text-xs">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-border/10 pb-1.5">
                Candidate Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Aspirant Name</span>
                  <p className="font-bold text-foreground mt-0.5">{admitCard.participantName}</p>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">User Identifier</span>
                  <p className="font-bold text-foreground mt-0.5">@{admitCard.username}</p>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Selected Language</span>
                  <p className="font-bold text-foreground mt-0.5">{admitCard.selectedLanguage}</p>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Masked Mobile</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{admitCard.maskedMobile}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Hall ticket seat & QR placement */}
            <div className="p-4 bg-muted/15 border border-border/40 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
              {/* QR Block */}
              <div className="bg-white p-2 rounded-lg border border-border">
                <QrCode className="w-20 h-20 text-black" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] text-muted-foreground uppercase font-bold">Assigned Seat Index</span>
                <p className="text-xs font-black text-foreground font-mono">{admitCard.seatNumber}</p>
              </div>
            </div>
          </div>

          {/* Timing details ledger */}
          <div className="space-y-4 pt-4 border-t border-border/20">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-primary border-b border-border/10 pb-1.5">
              Simulator Schedule Coordinates
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs leading-normal">
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Exam Date</span>
                <p className="font-bold text-foreground mt-0.5">{admitCard.contestDate}</p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Reporting Time</span>
                <p className="font-bold text-foreground mt-0.5">{admitCard.reportingTime}</p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Start Time</span>
                <p className="font-bold text-foreground mt-0.5">{admitCard.contestStartTime}</p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold">Duration</span>
                <p className="font-bold text-foreground mt-0.5">{admitCard.contestDuration}</p>
              </div>
            </div>
          </div>

          {/* Lobby access triggers and countdown timers */}
          <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-6 non-printable">
            
            {/* Live Countdowns status */}
            {!lobbyOpen && !demoBypass ? (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-muted-foreground uppercase font-black">Lobby Entry Timer</span>
                  <div className="flex items-center gap-1.5 text-sm font-black text-foreground">
                    <span>{timeLeft.days}d</span>
                    <span>{timeLeft.hours}h</span>
                    <span>{timeLeft.minutes}m</span>
                    <span>{timeLeft.seconds}s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                <CheckCircle className="w-4.5 h-4.5" />
                <span>Lobby Verification Ready</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5 items-center">
              {/* Bypass demo */}
              {!lobbyOpen && !demoBypass && (
                <button
                  onClick={() => setDemoBypass(true)}
                  className="px-3 py-1.5 border border-dashed border-primary/45 rounded-lg text-[9px] font-bold text-primary hover:bg-primary/5 transition-colors"
                >
                  Bypass Lobby Lock (Demo)
                </button>
              )}

              <Button
                onClick={handleEnterLobby}
                disabled={!lobbyOpen && !demoBypass}
                className="py-5 px-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5 shadow-lg shadow-primary/20"
              >
                Enter Examination Lobby
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Device Verification Dialog Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowOtpModal(false)} />

          <div className="relative w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <h3 className="text-xs font-black uppercase text-foreground tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-primary" />
                Device Security Verification
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are logging in from an unregistered browser device environment. Enter the One-Time Verification Code sent to your registered mobile number <strong className="text-foreground">{admitCard.maskedMobile}</strong>.
              </p>

              {/* Simulated OTP warning alert */}
              {otpSent && simulatedReceivedOtp && (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-[10px] rounded-xl font-bold leading-normal">
                  <span className="uppercase tracking-widest text-[8px] font-black block mb-1">Simulated Carrier SMS</span>
                  Your Ranker&apos;s League One-Time Verification code is: <strong className="text-foreground text-xs font-mono">{simulatedReceivedOtp}</strong> (Expires in 10 mins).
                </div>
              )}

              {verificationError && (
                <div className="p-3.5 bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-bold leading-relaxed">
                  {verificationError}
                </div>
              )}

              {!otpSent ? (
                <Button
                  onClick={handleSendOtp}
                  className="w-full py-5 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95"
                >
                  Send OTP Verification Code
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      6-Digit Numeric Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="XXXXXX"
                      className="w-full bg-card/45 border border-border/45 rounded-xl px-4 py-3 text-center text-sm font-mono tracking-widest text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOtpSent(false)}
                      className="w-1/3 py-5 font-bold text-xs border-border/60 hover:bg-muted/40"
                    >
                      Resend
                    </Button>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={verifying}
                      className="w-2/3 py-5 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95"
                    >
                      {verifying ? "Verifying..." : "Verify & Authorize Device"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

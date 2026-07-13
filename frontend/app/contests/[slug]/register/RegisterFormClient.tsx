"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  Clock,
  Globe,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { ContestDetail } from "@/types/contests";

interface RegisterFormClientProps {
  contest: ContestDetail;
  seatsDetails: {
    registeredCount: number;
    seatsAvailable: number;
    status: "open" | "closing_soon" | "sold_out";
  };
}

export default function RegisterFormClient({ contest, seatsDetails }: RegisterFormClientProps) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const [agreed, setAgreed] = React.useState(false);
  const [isEligible, setIsEligible] = React.useState(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please review and accept the examination terms and code of conduct.");
      return;
    }
    router.push(`/contests/${contest.slug}/checkout?lang=${selectedLanguage}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        {/* Back Link */}
        <Link
          href={`/contests/${contest.slug}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Contest Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Checkboxes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/20 border border-border/40 rounded-2xl p-6 space-y-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Simulator Registration</span>
                <h1 className="text-xl font-black text-foreground mt-1">Enrollment & Language Selection</h1>
              </div>

              {/* Eligibility Verification Card */}
              <div className={cn(
                "p-4 border rounded-xl flex gap-3 text-xs leading-relaxed",
                isEligible ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-rose-500/5 border-rose-500/20 text-rose-400"
              )}>
                {isEligible ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-foreground">Aspirant Profile Eligible</p>
                      <p className="text-muted-foreground mt-0.5">Your profile matches all difficulty and subject criteria for the {contest.exam}.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <p className="font-bold text-foreground">Ineligible Profile</p>
                      <p className="text-muted-foreground mt-0.5">Requires verified target exam profile settings updates.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Language and Seat selection forms */}
              <form onSubmit={handleProceed} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="language" className="text-xs font-black text-foreground uppercase tracking-wider block">
                    Preferred Examination Language
                  </label>
                  <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-card/45 border border-border/45 rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="English">English (Default)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Regional">Regional (Scheduled Translation)</option>
                  </select>
                  <span className="text-[10px] text-muted-foreground leading-normal block">
                    Admit Card and proctored interface will match this choice. Selected language cannot be modified post checkout.
                  </span>
                </div>

                {/* Terms checkboxes */}
                <div className="space-y-4 pt-4 border-t border-border/20">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">
                    Examination Terms & Proctor Guidelines
                  </span>

                  <div className="space-y-3.5 text-xs text-muted-foreground">
                    {[
                      "I understand that the exam runs in a locked-down browser proctoring environment. Any attempt to minimize, escape fullscreen, or connect secondary devices triggers automatic disqualification.",
                      "I accept that entry fees are final, non-refundable, and cannot be reversed once seat reservations compile.",
                      "I confirm my device has a functional camera, stable broadband (2 Mbps minimum), and complies with proctoring validations.",
                    ].map((rule, idx) => (
                      <div key={idx} className="flex gap-3 leading-relaxed items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p>{rule}</p>
                      </div>
                    ))}
                  </div>

                  <label className="flex gap-3 items-start cursor-pointer pt-3 text-xs font-bold text-foreground">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary mt-0.5 cursor-pointer"
                    />
                    <span>I declare that I have read, understood, and agree to follow all proctor rules and refund policies.</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!agreed || !isEligible || seatsDetails.status === "sold_out"}
                  className="w-full py-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4.5 h-4.5" />
                </Button>
              </form>

            </div>
          </div>

          {/* Right Column: Contest Summary */}
          <div className="space-y-6">
            <div className="bg-card/30 border border-border/40 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Contest Profile</h3>
              
              <div className="space-y-3 text-xs leading-normal">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Tournament Title</span>
                  <p className="font-bold text-foreground mt-0.5 leading-snug">{contest.title}</p>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Championship Exam</span>
                  <p className="font-bold text-foreground mt-0.5">{contest.exam}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Entry Fee</span>
                    <p className="font-black text-foreground text-sm mt-0.5">{contest.entryFee > 0 ? formatCurrency(contest.entryFee) : "Free"}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Prize Pool</span>
                    <p className="font-black text-emerald-400 text-sm mt-0.5">{formatCurrency(contest.prizePool)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Available Seats</span>
                    <p className={cn(
                      "font-black text-sm mt-0.5",
                      seatsDetails.status === "sold_out" ? "text-rose-400" : "text-foreground"
                    )}>
                      {seatsDetails.seatsAvailable.toLocaleString()} seats
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Registered Count</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{seatsDetails.registeredCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/15 border border-border/40 rounded-xl p-4 text-[10px] text-muted-foreground flex gap-2.5 items-start">
              <ShieldAlert className="w-4.5 h-4.5 text-primary shrink-0" />
              <p className="leading-relaxed">
                Seat assignment maps are locked automatically. Registrations close strictly at <strong className="text-foreground">{contest.registrationDeadline}</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

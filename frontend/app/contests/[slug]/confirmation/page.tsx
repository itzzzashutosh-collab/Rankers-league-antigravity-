import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight, Trophy, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { contestsContent } from "@/content/contests";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ regNo?: string }>;
}

export default async function ContestConfirmationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { regNo } = await searchParams;
  const contest = contestsContent.find((c) => c.slug === slug);
  if (!contest) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/contests/${slug}/confirmation`);
  }

  // Fetch profile name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-8">
        {/* Success Splash Card */}
        <div className="w-full bg-card/25 border border-primary/20 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl shadow-primary/5">
          <div className="absolute inset-0 bg-primary/2 pointer-events-none" />

          {/* Success Ring */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Reservation Secured
            </span>
            <h1 className="text-2xl font-black text-foreground">Registration Successful</h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your seat reservation index has been compiled on proctor databases. Review details below.
            </p>
          </div>

          {/* Invoice Parameters Details Grid */}
          <div className="border-t border-b border-border/20 py-4 text-xs leading-relaxed space-y-2.5 max-w-md mx-auto text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Championship</span>
              <span className="font-bold text-foreground truncate max-w-[200px]">{contest.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration Number</span>
              <span className="font-mono font-bold text-primary">{regNo || "RL-REG-XXXXXX"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participant</span>
              <span className="font-bold text-foreground">{profile?.full_name || "Aspirant"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled Date</span>
              <span className="font-bold text-foreground">{contest.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled Time</span>
              <span className="font-bold text-foreground">{contest.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Fee Paid</span>
              <span className="font-bold text-foreground">{contest.entryFee > 0 ? formatCurrency(contest.entryFee) : "Free (Waived)"}</span>
            </div>
          </div>

          {/* Call to action Admit Card redirection */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center max-w-md mx-auto">
            <Link href={`/contests/${slug}/admit-card`} className="w-full">
              <Button className="w-full py-6 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                <FileText className="w-4 h-4" /> Download Admit Card
              </Button>
            </Link>
            <Link href="/dashboard/my-contests" className="w-full">
              <Button variant="outline" className="w-full py-6 font-bold text-xs border-border/60 hover:bg-muted/40 gap-1">
                <Trophy className="w-4 h-4 text-primary" /> View Registered Contests
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";

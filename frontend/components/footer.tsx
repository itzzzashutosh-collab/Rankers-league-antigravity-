"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Scale, FileText, CheckCircle2, Award, Trophy, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

const schema = z.object({
  emailAddress: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function Footer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onRegister = (data: FormValues) => {
    console.log("Newsletter subscription:", data.emailAddress);
    reset();
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: Platform Identity & Newsletter (Colspan 5) */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              The premier national competitive examination arena. Delivering 100% fair, auditable, and proctored mock championships for Indian entrance exams (IIT JEE, NEET, UPSC, CUET).
            </p>

            {/* Newsletter Access Form */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-black text-foreground tracking-wider uppercase">
                Subscribe to Championship Alerts
              </span>
              <form onSubmit={handleSubmit(onRegister)} className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    {...register("emailAddress")}
                    className="w-full h-9 px-3.5 rounded-xl border border-border bg-muted/20 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary font-medium"
                  />
                  {errors.emailAddress && (
                    <span className="absolute left-0 -bottom-5 text-[10px] text-destructive">
                      {errors.emailAddress.message}
                    </span>
                  )}
                </div>
                <Button type="submit" size="sm" className="h-9 gap-1.5 px-4 font-bold rounded-xl">
                  <Send className="w-3.5 h-3.5" />
                  Subscribe
                </Button>
              </form>
              {isSubmitSuccessful && (
                <span className="text-xs text-emerald-500 font-semibold mt-1">
                  ✓ Subscribed successfully to updates.
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Quick Navigation (Colspan 3) */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left">
            <span className="text-xs font-black text-foreground tracking-wider uppercase">
              Quick Navigation
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-muted-foreground">
              <li>
                <Link href="/contests" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  Championship Contests Page
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  National Leaderboard Ranks
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-primary transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Rewards & Prize Arena
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Credit & Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance Center (Colspan 4) */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <span className="text-xs font-black text-foreground tracking-wider uppercase">
              Legal & Compliance Center
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All contests operate under verified academic integrity guidelines, DPDP compliance, and Sec 194BA TDS rules.
            </p>
            
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-2 mt-1">
              <span className="text-xs font-black text-foreground flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-primary" />
                Official Legal & Governance Center
              </span>
              <p className="text-[11px] text-muted-foreground">
                Access complete terms, privacy policy, refund rules, TDS receipts, and anti-cheating rules in one clean hub.
              </p>
              <Link
                href="/legal"
                className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline mt-1"
              >
                Go to Legal & Policies Hub
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Signatures Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 mt-10 pt-6 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Ranker&apos;s League Technologies Private Limited. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/legal" className="text-primary hover:underline font-black text-xs">
              Legal Center Hub
            </Link>
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

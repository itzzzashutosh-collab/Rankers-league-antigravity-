"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const schema = z.object({
  emailAddress: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

const directoryConfig = [
  {
    heading: "Championships",
    links: [
      { name: "Civil Services Elite", path: "/championships/civil-services" },
      { name: "Engineering Apex", path: "/championships/engineering" },
      { name: "Medical Prime", path: "/championships/medical" },
      { name: "Management League", path: "/championships/management" },
      { name: "Commerce Excellence", path: "/championships/commerce" },
      { name: "Law Championship", path: "/championships/law" },
      { name: "Defence Championship", path: "/championships/defence" },
      { name: "School Championship", path: "/championships/school" },
      { name: "International Championship", path: "/championships/international" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { name: "Leaderboard", path: "/leaderboard" },
      { name: "Rewards", path: "/rewards" },
      { name: "Pricing", path: "/pricing" },
      { name: "Verification", path: "/verification" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", path: "/about" },
      { name: "Blog", path: "/blog" },
      { name: "Careers", path: "/careers" },
      { name: "Press Kit", path: "/press" },
      { name: "Contact", path: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" },
      { name: "Honor Code", path: "/honor-code" },
      { name: "Verification Terms", path: "/verification-terms" },
      { name: "Refund Policy", path: "/refund-policy" },
      { name: "Cookie Policy", path: "/cookie-policy" },
      { name: "Community Guidelines", path: "/community-guidelines" },
      { name: "Fair Competition Policy", path: "/fair-competition-policy" },
    ],
  },
];


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
    // Subscription action simulation
    console.log("Newsletter subscription:", data.emailAddress);
    reset();
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Platform Identity */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                Ranker&apos;s League
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The prestigious global arena for scheduled competitive examination championships.
              Encounter national-level challengers in exact replicas of top-tier assessments.
            </p>
            
            {/* Newsletter Access Form */}
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-xs font-semibold text-foreground tracking-wider uppercase">
                Championship Announcements
              </span>
              <form onSubmit={handleSubmit(onRegister)} className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter email..."
                    {...register("emailAddress")}
                    className="w-full h-8 px-3 rounded-lg border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  {errors.emailAddress && (
                    <span className="absolute left-0 -bottom-5 text-[10px] text-destructive">
                      {errors.emailAddress.message}
                    </span>
                  )}
                </div>
                <Button type="submit" size="sm" className="h-8 gap-1.5 px-3">
                  <Send className="w-3.5 h-3.5" />
                  Subscribe
                </Button>
              </form>
              {isSubmitSuccessful && (
                <span className="text-xs text-emerald-500 mt-1">
                  Subscribed successfully to updates.
                </span>
              )}
            </div>
          </div>

          {/* Directory Listings */}
          {directoryConfig.map((dir) => (
            <div key={dir.heading} className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-foreground tracking-wider uppercase">
                {dir.heading}
              </span>
              <ul className="flex flex-col gap-2.5">
                {dir.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Signatures */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/60 mt-16 pt-8 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Ranker&apos;s League. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Breadcrumb } from "@/components/ui";
import { Shield, BookOpen, Scale, Award, RefreshCw, Cookie, Users, CheckSquare } from "lucide-react";


interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

const navigationItems = [
  { name: "Privacy Policy", path: "/privacy-policy", icon: Shield },
  { name: "Terms of Service", path: "/terms-of-service", icon: Scale },
  { name: "Honor Code", path: "/honor-code", icon: Award },
  { name: "Verification Terms", path: "/verification-terms", icon: BookOpen },
  { name: "Refund Policy", path: "/refund-policy", icon: RefreshCw },
  { name: "Cookie Policy", path: "/cookie-policy", icon: Cookie },
  { name: "Community Guidelines", path: "/community-guidelines", icon: Users },
  { name: "Fair Competition Policy", path: "/fair-competition-policy", icon: CheckSquare },
];

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  const pathname = usePathname();

  const breadcrumbItems = [
    { label: "Legal Center", href: "/terms-of-service" },
    { label: title },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1 space-y-6">
                <div className="sticky top-24 p-5 rounded-2xl border border-border bg-card/45 backdrop-blur-md">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-4">
                    Legal & Compliance
                  </span>
                  <nav className="flex flex-col gap-1.5">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                <article className="p-8 md:p-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm shadow-xl shadow-black/10">
                  <header className="border-b border-border/60 pb-6 mb-8">
                    <Typography variant="h1" className="mb-2 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                      {title}
                    </Typography>
                    <span className="text-xs text-muted-foreground font-medium block">
                      Last updated: {lastUpdated}
                    </span>
                  </header>
                  <div className="prose prose-invert prose-xs max-w-none leading-relaxed text-muted-foreground space-y-8">
                    {children}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

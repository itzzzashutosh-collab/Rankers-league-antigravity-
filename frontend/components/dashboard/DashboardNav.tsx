"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  BarChart2,
  Medal,
  FileText,
  Settings,
  User,
  Zap,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/auth";

interface DashboardNavProps {
  profile: UserProfile;
}

const NAV_ITEMS = [
  { label: "Overview",      href: "/dashboard",             icon: LayoutDashboard },
  { label: "My Contests",   href: "/dashboard/my-contests", icon: Trophy },
  { label: "Performance",   href: "/dashboard/performance", icon: BarChart2 },
  { label: "Achievements",  href: "/dashboard/achievements",icon: Medal },
  { label: "Results",       href: "/dashboard/results",     icon: FileText },
  { label: "Prize Architect", href: "/dashboard/prize-matrix-architect", icon: Calculator },
  { label: "Profile",       href: "/dashboard/profile",     icon: User },
  { label: "Settings",      href: "/dashboard/settings",    icon: Settings },
];


export default function DashboardNav({ profile }: DashboardNavProps) {
  const pathname = usePathname();

  // If on wallet pages, do not display the dashboard sub-navigation layout/identity strip
  if (pathname.startsWith("/dashboard/wallet")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="sticky top-[60px] z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User identity strip */}
        <div className="flex items-center justify-between py-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || ""}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xs font-black text-primary">
                  {(profile.full_name || profile.username || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-black text-foreground leading-tight">
                {profile.full_name || profile.username}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                @{profile.username}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-black text-foreground">
                {(profile.aura_points || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground">Aura</span>
            </div>
            {profile.national_rank && (
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-black text-foreground">
                  #{profile.national_rank.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">Rank</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 -mb-px">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-primary" : "")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

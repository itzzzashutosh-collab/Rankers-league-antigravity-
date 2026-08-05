"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  BarChart2,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/auth";

interface DashboardNavProps {
  profile: UserProfile;
}

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/dashboard",             icon: LayoutDashboard, exact: true },
  { label: "My Contests",  href: "/dashboard/my-contests", icon: Trophy },
  { label: "Performance",  href: "/dashboard/performance", icon: BarChart2 },
  { label: "Profile",      href: "/dashboard/profile",     icon: User },
];

export default function DashboardNav({ profile }: DashboardNavProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact || href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="sticky top-[60px] z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Identity strip */}
        <div className="flex items-center justify-between py-2.5 border-b border-border/20">
          <div className="flex items-center gap-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || ""}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-[11px] font-black text-primary">
                  {(profile.full_name || profile.username || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs font-black text-foreground leading-tight">
                {profile.full_name || profile.username}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                @{profile.username}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden sm:flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center">
                <Zap className="w-3 h-3 text-amber-500" />
              </div>
              <span className="text-xs font-black text-foreground">
                {(profile.aura_points || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-muted-foreground">Aura</span>
            </div>
            {profile.national_rank && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-black text-foreground">
                  #{profile.national_rank.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-muted-foreground">Rank</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-0.5 -mb-px">
          {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 rounded-t-lg",
                  active
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 shrink-0", active && "text-primary")} />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

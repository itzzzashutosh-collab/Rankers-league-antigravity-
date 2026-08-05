"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Bell, Sun, Moon, BookOpen, Trophy, HelpCircle, User, Settings, LogOut, ChevronDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { navigationContent } from "@/content/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/auth";
import { cn } from "@/lib/utils";
import { regionService, RegionCode } from "@/services/regionService";

function formatWalletDisplay(bal: number | null | undefined): string {
  if (bal === null || bal === undefined) return "₹0";
  const num = Number(bal);
  if (isNaN(num) || !isFinite(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [authUser, setAuthUser] = React.useState<{ id: string } | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [selectedRegion, setSelectedRegion] = React.useState<RegionCode>("india");
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedRegion(regionService.detectUserRegion());
  }, []);

  const handleRegionChange = (newRegion: RegionCode) => {
    setSelectedRegion(newRegion);
    regionService.setRegion(newRegion);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", authOnly: true },
    { href: "/contests",  label: "Contests" },
    { href: "/exams",     label: "Exams" },
    { href: "/live",      label: "Live" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/mentors",   label: "Mentors" },
    { href: "/pricing",   label: "Pricing" },
  ];

  // Load auth state
  React.useEffect(() => {
    const supabase = createClient();
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user ? { id: user.id } : null);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url, profile_status")
          .eq("id", user.id)
          .single();

        // Merge Google avatar if profile doesn't have one yet
        if (data && !data.avatar_url && user.user_metadata?.avatar_url) {
          data.avatar_url = user.user_metadata.avatar_url;
        }
        if (data && !data.avatar_url && user.user_metadata?.picture) {
          data.avatar_url = user.user_metadata.picture;
        }
        setProfile(data as UserProfile | null);

        // Fetch wallet balance
        const { data: wallet } = await supabase
          .from("wallet_balances")
          .select("available_balance")
          .eq("wallet_id", user.id)
          .maybeSingle();

        if (wallet && wallet.available_balance !== null && wallet.available_balance !== undefined) {
          const parsed = Number(wallet.available_balance);
          setWalletBalance(isNaN(parsed) || !isFinite(parsed) ? 0 : parsed);
        } else {
          setWalletBalance(0);
        }
      }
    };
    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser({ id: session.user.id });
        loadUser();
      } else {
        setAuthUser(null);
        setProfile(null);
        setWalletBalance(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Listen for custom wallet balance updates
  React.useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ balance: number }>;
      if (customEvent.detail && typeof customEvent.detail.balance === "number" && !isNaN(customEvent.detail.balance)) {
        setWalletBalance(customEvent.detail.balance);
      } else {
        setWalletBalance(0);
      }
    };
    window.addEventListener("wallet-update", handleWalletUpdate);
    return () => window.removeEventListener("wallet-update", handleWalletUpdate);
  }, []);


  // Close user menu on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
    setUserMenuOpen(false);
    router.push("/auth/login");
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glass-effect border-b border-border/80 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo Branding */}
          <Link href="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          {/* Navigation Links (Flex layout with clean spacing & dynamic active route highlighting) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((link) => {
              if (link.authOnly && !authUser) return null;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl font-black text-xs tracking-wide uppercase transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Interactive Controls */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
            {authUser && (
              <>
                {/* Sleek Wallet Balance Display with clear icon spacing */}
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 shadow-xs group"
                  title="Wallet Balance"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Wallet:</span>
                    <span className="text-xs font-black text-emerald-400 font-mono tracking-tight">
                      {formatWalletDisplay(walletBalance)}
                    </span>
                  </div>
                </Link>

                <Link href="/dashboard/notifications">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground relative group"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" />
                  </Button>
                </Link>
              </>
            )}

            {/* Region Switcher */}
            <div className="hidden sm:flex items-center bg-secondary/40 border border-border/40 rounded-xl p-0.5 text-xs font-bold select-none">
              <button
                onClick={() => handleRegionChange("india")}
                className={cn(
                  "px-2 py-1 rounded-lg text-[10px] uppercase transition-all flex items-center gap-1",
                  selectedRegion === "india"
                    ? "bg-card text-foreground shadow-xs border border-border/40 font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="India Region (INR ₹)"
              >
                🇮🇳 IN
              </button>
              <button
                onClick={() => handleRegionChange("international")}
                className={cn(
                  "px-2 py-1 rounded-lg text-[10px] uppercase transition-all flex items-center gap-1",
                  selectedRegion === "international"
                    ? "bg-card text-foreground shadow-xs border border-border/40 font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="International Region (USD $)"
              >
                🌐 INT
              </button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle Theme"
            >
              <Sun className="w-4.5 h-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4.5 h-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {authUser ? (
              // Authenticated: User dropdown menu
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-200"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-black text-primary">
                        {(profile?.full_name || profile?.username || "U")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-foreground leading-tight">
                      {profile?.full_name?.split(" ")[0] || profile?.username || "Account"}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {profile?.username ? `@${profile.username}` : "Set up profile"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border/30">
                        <p className="text-xs font-black">{profile?.full_name || "Welcome!"}</p>
                        <p className="text-[10px] text-muted-foreground">{profile?.username ? `@${profile.username}` : "Complete your profile"}</p>
                      </div>
                      <div className="py-1">
                        {profile?.username ? (
                          <Link
                            href={`/profile/${profile.username}`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-muted/30 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            My Profile
                          </Link>
                        ) : (
                          <Link
                            href="/auth/complete-profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                          >
                            <User className="w-3.5 h-3.5" />
                            Complete Profile
                          </Link>
                        )}

                        <Link
                          href="/profile/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-muted/30 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                          Account Settings
                        </Link>
                      </div>
                      <div className="py-1 border-t border-border/30">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Not authenticated: Sign In button
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="px-5 border-primary/30 text-foreground hover:border-primary hover:bg-primary/5 rounded-xl font-bold text-xs"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Display Controls */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              className="text-muted-foreground"
              aria-label="Toggle Theme"
            >
              <Sun className="w-4.5 h-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4.5 h-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-muted-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] bottom-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-b border-border overflow-y-auto"
          >
            <div className="flex flex-col gap-6 p-6 text-left">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  if (link.authOnly && !authUser) return null;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-colors block",
                        active
                          ? "bg-primary text-primary-foreground font-black"
                          : "text-foreground hover:text-primary hover:bg-muted/20"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
                {authUser && (
                  <>
                    <Link href="/dashboard/wallet" onClick={() => setMobileOpen(false)} className="w-full">
                      <Button variant="outline" className="flex items-center justify-center gap-2 w-full mt-2 h-10 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                        <Wallet className="w-4 h-4 text-emerald-400" /> Wallet: {formatWalletDisplay(walletBalance)}
                      </Button>
                    </Link>
                    <Link href="/dashboard/notifications" onClick={() => setMobileOpen(false)} className="w-full">
                      <Button variant="outline" className="flex items-center justify-center gap-2 w-full h-10">
                        <Bell className="w-4 h-4" /> Notifications Inbox
                      </Button>
                    </Link>
                  </>
                )}
                <Button className="w-full h-10">Access Platform</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Global Search Dialog Overlay Removed */}
    </>
  );
}

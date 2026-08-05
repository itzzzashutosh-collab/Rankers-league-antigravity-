"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Bell, Sun, Moon, BookOpen, Trophy, HelpCircle, User, Settings, LogOut, ChevronDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationContent } from "@/content/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/auth";

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [authUser, setAuthUser] = React.useState<{ id: string } | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

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

        if (wallet) {
          setWalletBalance(Number(wallet.available_balance));
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
      if (customEvent.detail && typeof customEvent.detail.balance === "number") {
        setWalletBalance(customEvent.detail.balance);
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 z-10">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              Ranker&apos;s League
            </span>
          </Link>

          {/* Large Screen Navigation Links (strictly centered) */}
          <nav className="hidden md:flex items-center gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {authUser && (
              <Link
                href="/dashboard"
                className="text-xs font-black tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/contests"
              className="text-xs font-black tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Contests
            </Link>
            <Link
              href="/live"
              className="text-xs font-black tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Live
            </Link>
            <Link
              href="/leaderboard"
              className="text-xs font-black tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/mentors"
              className="text-xs font-black tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Mentors
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-black tracking-wide uppercase text-primary hover:text-primary/80 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Interactive Controls */}
          <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto z-10">
            {authUser && (
              <>
                {/* Wallet Balance Display in top right corner */}
                <Link href="/dashboard/wallet" className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-200 group">
                  <Wallet className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-foreground font-mono">
                    {walletBalance !== null ? `₹${walletBalance.toLocaleString("en-IN")}` : "₹0"}
                  </span>
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-200"
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
                  className="px-5 border-primary/30 text-foreground hover:border-primary hover:bg-primary/5 rounded-md"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Display Controls */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
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
              <div className="flex flex-col gap-4">
                {authUser && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/contests"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Contests
                </Link>
                <Link
                  href="/live"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Live
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/rewards"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Rewards
                </Link>
                <Link
                  href="/mentors"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Mentors
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold text-primary hover:text-primary/80 transition-colors block"
                >
                  Pricing ✦
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                >
                  Contact
                </Link>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
                {authUser && (
                  <>
                    <Link href="/dashboard/wallet" onClick={() => setMobileOpen(false)} className="w-full">
                      <Button variant="outline" className="flex items-center justify-center gap-2 w-full mt-2 h-10">
                        <Wallet className="w-4 h-4 text-primary" /> Wallet: {walletBalance !== null ? `₹${walletBalance.toLocaleString("en-IN")}` : "₹0"}
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

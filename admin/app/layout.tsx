"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Inspector from "@/components/Inspector";
import CommandPalette from "@/components/CommandPalette";
import { InspectorProvider } from "@/utils/InspectorContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("admin-theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const token = localStorage.getItem("admin-token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  if (!mounted) {
    return (
      <html lang="en" className="dark">
        <body className="bg-background text-foreground min-h-screen font-sans">
          <div className="flex items-center justify-center min-h-screen">
            <span className="text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
              Loading Redesigned Workspaces...
            </span>
          </div>
        </body>
      </html>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen antialiased select-none font-sans">
        <InspectorProvider>
          {isLoginPage ? (
            <main className="min-h-screen flex items-center justify-center bg-background">
              {children}
            </main>
          ) : (
            <div className="min-h-screen flex bg-background text-foreground">
              {/* Left Navigation Sidebar */}
              <Sidebar collapsed={false} onToggle={() => {}} />

              {/* Main Workspace Frame */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header Top Bar */}
                <Topbar />

                <div className="flex-1 flex overflow-hidden">
                  {/* Central Workspace Page Content */}
                  <main className="flex-1 overflow-y-auto p-8 bg-background">
                    {children}
                  </main>

                  {/* Right Inspector Drawer */}
                  <Inspector />
                </div>
              </div>
            </div>
          )}

          {/* Floating Command Palette listener */}
          <CommandPalette />
        </InspectorProvider>
      </body>
    </html>
  );
}

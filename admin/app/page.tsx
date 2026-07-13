"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists, otherwise redirect to login
    const token = localStorage.getItem("admin-token");
    if (token) {
      router.push("/admin/overview");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
        Loading Console...
      </span>
    </div>
  );
}

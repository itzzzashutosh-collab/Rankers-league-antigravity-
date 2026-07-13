"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSubRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/overview");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
        Loading Console...
      </span>
    </div>
  );
}

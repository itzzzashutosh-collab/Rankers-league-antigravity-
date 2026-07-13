"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublishRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Open main workspace
    router.push("/admin/results");
  }, []);

  return (
    <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
      Redirecting to Results Publishing Console...
    </div>
  );
}

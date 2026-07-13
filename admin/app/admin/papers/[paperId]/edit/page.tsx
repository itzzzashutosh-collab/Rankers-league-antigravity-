"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaperIdEditRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Open main workspace
    router.push("/admin/papers");
  }, []);

  return (
    <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-bold tracking-widest uppercase">
      Loading Exam Paper Canvas Editor...
    </div>
  );
}

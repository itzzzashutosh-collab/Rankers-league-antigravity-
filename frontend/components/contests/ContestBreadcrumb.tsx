"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContestBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function ContestBreadcrumb({ items, className }: ContestBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-xs text-muted-foreground select-none", className)}>
      <Link
        href="/"
        className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-muted-foreground/45 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-semibold"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
export default ContestBreadcrumb;

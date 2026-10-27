"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/track";

// Internal link to a related tool; logs which strip sent the visit (pages per visit, 10/24).
export default function RelatedToolLink({ from, href, slot, className, children }: {
  from: string; href: string; slot: "try_next" | "keep_playing" | "switch_category"; className?: string; children: ReactNode;
}) {
  return (
    <Link prefetch={false} href={href} data-related-slot={slot} className={className}
      onClick={() => track("related_tool_click", { page_path: from, target_path: href, slot })}>
      {children}
    </Link>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { sessionGenerateCount, track } from "@/lib/track";

export type NextEvent = "next_card_click" | "next_result_click" | "next_locale_click";

// Internal link that reports which recommendation card sent the visit. One event
// family (next_*) with the same props everywhere: slot, from, target_path.
export default function NextLink({ event, from, href, slot, className, children }: {
  event: NextEvent; from: string; href: string; slot: string; className?: string; children: ReactNode;
}) {
  return (
    <Link prefetch={false} href={href} data-next-slot={slot} className={className}
      onClick={() => track(event, { slot, from, target_path: href, generations: sessionGenerateCount() })}>
      {children}
    </Link>
  );
}

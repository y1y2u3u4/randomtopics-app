"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/track";

/**
 * Next.js App Router navigation does not reload the root GA script. Send one
 * explicit page_view per pathname so custom events always inherit a landing
 * page instead of falling into GA4's blank / unassigned rows.
 */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return;
    previousPath.current = pathname;

    let attempts = 0;
    let retry: number | undefined;
    const send = () => {
      if (trackPageView()) return;
      attempts += 1;
      if (attempts < 20) retry = window.setTimeout(send, 250);
    };
    send();

    return () => {
      if (retry) window.clearTimeout(retry);
    };
  }, [pathname]);

  return null;
}

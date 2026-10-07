"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { adDocumentBoundary } from "@/lib/adsense";
import { INITIAL_HISTORY_READY } from "@/lib/initialHistoryGuard";

export default function AdDocumentBoundary({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const [documentPath] = useState(pathname);
  const crossing = enabled && adDocumentBoundary(documentPath, pathname);
  useEffect(() => {
    if (crossing) window.location.replace(window.location.href);
  }, [crossing]);
  useEffect(() => {
    // Parent router effects register popstate in this same effect flush. Defer
    // the handoff until they have run; normal hydrated navigation stays with Next.
    queueMicrotask(() => window.dispatchEvent(new Event(INITIAL_HISTORY_READY)));
  }, []);
  // Do not mount a sensitive child tree in a document that may contain AdSense.
  return crossing ? <p role="status" className="p-6 text-center">Opening page…</p> : children;
}

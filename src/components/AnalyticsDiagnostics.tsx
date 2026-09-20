"use client";
import { useEffect, useState } from "react";
import { isProductionHost } from "@/lib/analyticsEnvironment";
export default function AnalyticsDiagnostics() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isProductionHost(location.hostname) || !location.search.includes("measure=1")) return;
    const frame = requestAnimationFrame(() => setShow(true));
    const receive = (e: Event) => setEvents((items) => [...items.slice(-49), (e as CustomEvent).detail]);
    window.addEventListener("rt:analytics", receive);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("rt:analytics", receive); };
  }, []);
  return show ? <details className="m-4 rounded-xl border border-amber-400/30 p-4" open>
    <summary>Preview measurement · local only · {events.length} recent events</summary>
    <pre className="max-h-60 overflow-auto whitespace-pre-wrap text-xs" aria-label="Preview analytics events">{JSON.stringify(events, null, 2)}</pre>
  </details> : null;
}

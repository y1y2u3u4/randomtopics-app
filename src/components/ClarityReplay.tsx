"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isProductionHost, replayPathAllowed } from "@/lib/analyticsEnvironment";
import { trackSpeech } from "@/lib/speech/telemetry";

const storageKey = "rt-replay-consent-v1";
type Consent = "allowed" | "denied" | "unknown";
export default function ClarityReplay() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>("unknown");
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState(false);
  const replayWanted = useRef(false);
  const scriptLoaded = useRef(false);
  const project = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";
  const enabled = /^[a-z0-9]{5,30}$/i.test(project);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved?.expires > Date.now() && ["allowed", "denied"].includes(saved.choice)) setConsent(saved.choice);
    } catch { /* Storage may be unavailable; keep optional replay off. */ }
    setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useLayoutEffect(() => {
    const allowed = enabled && ready && consent === "allowed" && replayPathAllowed(pathname) &&
      !location.search && !location.hash && isProductionHost(location.hostname);
    replayWanted.current = allowed;
    if (!allowed) {
      if (window.__rtReplayActive) window.clarity?.("stop");
      window.__rtReplayActive = false;
      return;
    }
    const start = () => {
      if (!replayWanted.current) return;
      window.clarity?.("start");
      window.__rtReplayActive = true;
      window.clarity?.("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
      window.clarity?.("set", "measurement_version", "speech-v2");
    };
    if (!window.clarity) {
      const queued = Object.assign((...args: unknown[]) => { queued.q.push(args); }, { q: [] as unknown[][] });
      window.clarity = queued;
      // Consent precedes the script request, not after the first collection.
      queued("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
      const script = document.createElement("script");
      script.id = "rt-clarity";
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${project}`;
      script.onload = () => {
        scriptLoaded.current = true;
        if (!replayWanted.current) { window.clarity?.("stop"); return; }
        start();
      };
      document.head.appendChild(script);
    } else if (scriptLoaded.current) {
      start();
    }
    // End replay before navigating to a private or student-oriented destination.
    const stop = () => { window.clarity?.("stop"); window.__rtReplayActive = false; };
    const navigate = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download || e.ctrlKey || e.metaKey || e.shiftKey || anchor.target === "_blank") return;
      const url = new URL(anchor.href);
      if (url.origin === location.origin && (!replayPathAllowed(url.pathname) || url.search || url.hash)) {
        stop();
        e.preventDefault();
        location.assign(url.href);
      }
    };
    document.addEventListener("click", navigate, true);
    window.addEventListener("popstate", stop, true);
    window.addEventListener("hashchange", stop, true);
    return () => {
      replayWanted.current = false;
      stop();
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", stop, true);
      window.removeEventListener("hashchange", stop, true);
    };
  }, [consent, enabled, pathname, project, ready]);
  if (!enabled || !ready || !replayPathAllowed(pathname)) return null;
  function choose(choice: Consent) {
    if (choice === "denied") window.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
    setConsent(choice);
    setSettings(false);
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, expires: Date.now() + 180 * 86400000 })); } catch { /* Optional preference */ }
    trackSpeech(choice === "allowed" ? "speech_replay_allowed" : "speech_replay_declined", { content_source: "speech_hub" });
  }
  return <aside className="mx-auto w-full max-w-3xl px-4 py-4 text-sm" aria-label="Session replay preferences">
    {consent === "unknown" || settings ? <div className="rounded-xl border border-white/15 p-4 space-y-3">
      <p>Help improve speech practice with optional Microsoft Clarity session replay of page interactions. Your audio is not recorded by replay; speech text and email are masked.</p>
      <div className="flex flex-wrap gap-3">
        <button className="min-h-11 rounded-lg border border-white/20 px-3" onClick={() => choose("allowed")}>I’m 18 or older · Allow replay</button>
        <button className="min-h-11 rounded-lg border border-white/20 px-3" onClick={() => choose("denied")}>Continue without replay</button>
        <Link href="/privacy" className="py-3 underline">Privacy details</Link>
      </div>
    </div> : <button className="min-h-11 underline text-[var(--text-muted)]" onClick={() => setSettings(true)}>Session replay: {consent === "allowed" ? "allowed" : "off"} · Change</button>}
  </aside>;
}

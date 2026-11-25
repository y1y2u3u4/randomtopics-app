"use client";
import { useEffect } from "react";
import { adPageAllowed } from "@/lib/adsense";
import { adRuntimeMarks, adRuntimeStage } from "@/lib/adsenseClient";
import { adCoverageProps, adCoverageSampled } from "@/lib/adCoverage";
import { isProductionHost } from "@/lib/analyticsEnvironment";

// One sampled `ad_cov` Umami event per ad-eligible document (see lib/adCoverage).
// Sends nothing, renders nothing and changes no ad behaviour; it only reads the
// runtime state when the visitor hides or leaves the page. In-site navigation
// between ad pages is a new document (AdDocumentBoundary), so "once" is per view.
export default function AdCoverageBeacon() {
  useEffect(() => {
    const path = location.pathname;
    if (!isProductionHost(location.hostname) || !adPageAllowed(path) || !adCoverageSampled(Math.random())) return;
    const openedAs = document.visibilityState;
    let sent = false;
    const send = () => {
      if (sent || location.pathname !== path) return;
      const track = window.umami?.track;
      if (!track) return; // Umami not loaded yet: it has not counted this view either.
      sent = true;
      try {
        track("ad_cov", adCoverageProps({ stage: adRuntimeStage(), marks: adRuntimeMarks(),
          elapsedMs: performance.now(), openedAs, path }));
      } catch { /* analytics must never break the page */ }
    };
    const hidden = () => { if (document.visibilityState === "hidden") send(); };
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", send);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("pagehide", send);
    };
  }, []);
  return null;
}

// Lightweight GA4 event helper. The site already loads gtag.js (G-C23RTYX4QS)
// in layout.tsx with default pageviews only — these custom events are what turn
// GA into a real usage dataset (which topics/modes/depths people actually
// generate), the raw material for the /stats "Usage Insights" section.
//
// Safe no-op when gtag is absent (adblock, SSR, tests). Never throws.

export type GtagParams = Record<string, string | number | boolean | null | undefined | Record<string, string | number>[]>;
import { isProductionHost } from "./analyticsEnvironment";
import { coreUsageEvents } from "./coreUsage";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
    dataLayer?: unknown[];
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    __rtReplayActive?: boolean;
  }
}

export function track(eventName: string, params?: GtagParams): void {
  try {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/internal")) return;
      let usageQa = false;
      try {
        const choice = new URLSearchParams(window.location.search || "").get("usage_qa");
        if (choice === "1") sessionStorage.setItem("rt_usage_qa", "1");
        if (choice === "0") sessionStorage.removeItem("rt_usage_qa");
        usageQa = choice === "1" || sessionStorage.getItem("rt_usage_qa") === "1";
      } catch { usageQa = new URLSearchParams(window.location.search || "").get("usage_qa") === "1"; }
      const qa = usageQa || eventName.startsWith("qa_");
      const rawName = eventName.replace(/^qa_/, "");
      const lazyStorage = (kind: "localStorage" | "sessionStorage") => ({
        getItem: (key: string) => window[kind].getItem(key),
        setItem: (key: string, value: string) => window[kind].setItem(key, value),
        removeItem: (key: string) => window[kind].removeItem(key),
      });
      const derived = coreUsageEvents(window.location.pathname, rawName, params ?? {}, lazyStorage("localStorage"), lazyStorage("sessionStorage"), Date.now(), qa);
      const eventParams = {
        ...params,
        // Query strings on /share may contain user-selected topic text. Keep
        // analytics useful without sending that content to GA4.
        page_path: window.location.pathname,
        page_location: `${window.location.origin}${window.location.pathname}`,
        page_title: document.title,
        page_language: document.documentElement.lang || "en",
      };

      // Preview QA stays local; never send test sessions to the production property.
      for (const name of [rawName, ...derived]) {
        const measuredName = `${qa ? "qa_" : ""}${name}`;
        if (!isProductionHost(window.location.hostname) || usageQa) {
          window.dispatchEvent(new CustomEvent("rt:analytics", { detail: { event: measuredName, params: eventParams } }));
        }
        if (!isProductionHost(window.location.hostname)) continue;
        if (!window.gtag) {
          window.dataLayer ??= [];
          window.gtag = (...args) => { window.dataLayer!.push(args); };
        }
        window.gtag("event", measuredName, eventParams);
      }
    }
  } catch {
    /* analytics must never break the app */
  }
}

/**
 * Emit one explicit GA4 page_view for the current App Router location.
 * Returns false while gtag is still loading so the caller can retry briefly.
 */
export function trackPageView(): boolean {
  try {
    if (typeof window === "undefined") return false;
    track("page_view", {
      page_path: window.location.pathname,
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_title: document.title,
      page_language: document.documentElement.lang || "en",
    });
    return true;
  } catch {
    return false;
  }
}

// Lightweight GA4 event helper. The site already loads gtag.js (G-C23RTYX4QS)
// in layout.tsx with default pageviews only — these custom events are what turn
// GA into a real usage dataset (which topics/modes/depths people actually
// generate), the raw material for the /stats "Usage Insights" section.
//
// Safe no-op when gtag is absent (adblock, SSR, tests). Never throws.

export type GtagParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
  }
}

export function track(eventName: string, params?: GtagParams): void {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        page_path: `${window.location.pathname}${window.location.search}`,
        page_location: window.location.href,
        page_title: document.title,
        page_language: document.documentElement.lang || "en",
        ...params,
      });
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
    if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
    window.gtag("event", "page_view", {
      page_path: `${window.location.pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
      page_language: document.documentElement.lang || "en",
    });
    return true;
  } catch {
    return false;
  }
}

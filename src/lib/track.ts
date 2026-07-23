// Lightweight GA4 event helper. The site already loads gtag.js (G-C23RTYX4QS)
// in layout.tsx with default pageviews only — these custom events are what turn
// GA into a real usage dataset (which topics/modes/depths people actually
// generate), the raw material for the /stats "Usage Insights" section.
//
// Safe no-op when gtag is absent (adblock, SSR, tests). Never throws.

type GtagParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
  }
}

export function track(eventName: string, params?: GtagParams): void {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    /* analytics must never break the app */
  }
}

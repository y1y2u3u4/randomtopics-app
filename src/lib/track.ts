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
    __rtClarityLoaded?: boolean;
    umami?: { track: (eventName: string, data?: Record<string, string | number | boolean>) => void };
  }
}

// Portfolio-wide funnel names (same on every site). Existing GA4 events keep
// their names so current reports/conversions don't break; the canonical name is
// sent once more to GA4 and is the only custom event sent to Umami.
const CANONICAL_EVENTS: Record<string, string> = {
  generate_success: "generate",
  copy_result: "copy",
  share_result: "share",
  share_click: "share",
  qotd_share_card: "share",
};

export function canonicalEventName(eventName: string): string | undefined {
  return CANONICAL_EVENTS[eventName];
}

// Host Pass funnel (2026-10-24): same names in GA4 and Umami.
const UMAMI_DIRECT_EVENTS = new Set([
  "host_entry_view", "host_entry_click", "host_trial_start", "host_trial_end", "host_paywall_view",
  "host_plan_select", "host_checkout_start", "host_purchase", "host_session_start", "timer_set", "no_repeat_reset",
  // 2026-10-27: related-tool strips, for the daily pages-per-visit report.
  "related_tool_click",
]);

// Subscription products (2026-10-24): {product}_{step}, same names in GA4 and Umami.
const SUB_EVENT = /^(teacher|bot|journal|couples|wheel)_(entry_view|entry_click|landing_view|trial_start|paywall_view|plan_select|checkout_start|purchase)$/;
const SUB_USAGE_EVENTS = new Set(["teacher_present", "bot_message_sent", "journal_entry_saved", "couples_reveal", "wheel_list_saved"]);

// 2026-10-28: recommendation-card events share the next_* prefix (next_card_click,
// next_result_click, next_locale_click) with props slot, from, target_path.
const NEXT_EVENT = /^next_[a-z_]+$/;

export function umamiDirectEvent(eventName: string): boolean {
  return UMAMI_DIRECT_EVENTS.has(eventName) || NEXT_EVENT.test(eventName) || SUB_EVENT.test(eventName) || SUB_USAGE_EVENTS.has(eventName);
}

/** generate_success count in this browser tab session (drives the Host mode entry). */
export function sessionGenerateCount(): number {
  try { return Number(sessionStorage.getItem("rt_gen_count")) || 0; } catch { return 0; }
}

function umamiProps(params: GtagParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const key of ["tool_type", "locale", "share_method", "content_source", "page_path", "plan", "generator", "seconds", "product", "entry_page", "slot", "from", "target_path", "locale_from", "generations"]) {
    const value = params[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") out[key] = value;
  }
  return out;
}

// Umami's script loads after idle; retry briefly so an early first action isn't lost.
function sendUmami(name: string, props: Record<string, string | number | boolean>, attempt = 0): void {
  try {
    if (window.umami?.track) { window.umami.track(name, props); return; }
    if (attempt < 10) window.setTimeout(() => sendUmami(name, props, attempt + 1), 500);
  } catch { /* analytics must never break the app */ }
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
      if (rawName === "generate_success") {
        try { sessionStorage.setItem("rt_gen_count", String(sessionGenerateCount() + 1)); } catch { /* optional */ }
        try { window.dispatchEvent(new Event("rt:generate")); } catch { /* optional */ }
      }
      const lazyStorage = (kind: "localStorage" | "sessionStorage") => ({
        getItem: (key: string) => window[kind].getItem(key),
        setItem: (key: string, value: string) => window[kind].setItem(key, value),
        removeItem: (key: string) => window[kind].removeItem(key),
      });
      const derived = coreUsageEvents(window.location.pathname, rawName, params ?? {}, lazyStorage("localStorage"), lazyStorage("sessionStorage"), Date.now(), qa);
      const eventParams = {
        ...params,
        // Derive these at the transport boundary, never trust caller overrides.
        // Preserve existing QA names so historical reports remain comparable.
        schema_version: "1",
        environment: isProductionHost(window.location.hostname) ? "production" : "local_preview",
        is_test: qa || !isProductionHost(window.location.hostname),
        // Query strings on /share may contain user-selected topic text. Keep
        // analytics useful without sending that content to GA4.
        page_path: window.location.pathname,
        page_location: `${window.location.origin}${window.location.pathname}`,
        page_title: document.title,
        page_language: document.documentElement.lang || "en",
      };

      const canonical = canonicalEventName(rawName);
      // Preview QA stays local; never send test sessions to the production property.
      for (const name of [rawName, ...derived, ...(canonical ? [canonical] : [])]) {
        const measuredName = `${qa ? "qa_" : ""}${name}`;
        const diagnose = (stage: "constructed" | "dispatch_called" | "dispatch_error") => {
          if (isProductionHost(window.location.hostname) && !qa) return;
          try {
            window.dispatchEvent(new CustomEvent("rt:analytics", { detail: {
              event: measuredName, params: eventParams, stage,
              ...(stage === "dispatch_error" ? { error_code: "dispatch_exception" } : {}),
            } }));
          } catch { /* Diagnostics must not suppress the actual event. */ }
        };
        diagnose("constructed");
        if (!isProductionHost(window.location.hostname)) continue;
        try {
          if (!window.gtag) {
            window.dataLayer ??= [];
            window.gtag = (...args) => { window.dataLayer!.push(args); };
          }
          window.gtag("event", measuredName, eventParams);
          if ((name === canonical || umamiDirectEvent(name)) && !qa) sendUmami(name, umamiProps(eventParams));
          diagnose("dispatch_called");
        } catch {
          diagnose("dispatch_error");
        }
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

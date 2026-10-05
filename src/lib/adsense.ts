export const ADSENSE_CLIENT = "ca-pub-1513206179290827";
// Existing account, manual Display unit confirmed in AdSense on 2026-10-05.
export const ADSENSE_ARTICLE_SLOT = "8217822741";
// Reviewed public-page whitelist, ranked by LA 2026-09-27–10-03 page views.
export const ADSENSE_PUBLIC_PATHS = [
  "/",
  "/question-of-the-day",
  "/spin-the-wheel",
  "/es",
  "/debate",
  "/conversation",
  "/writing",
  "/es/topics/most-likely-to-questions",
  "/impromptu-speech-topics",
  "/topics/ethical-dilemma-questions",
  "/funny",
  "/icebreaker",
  "/random-learning-topic-generator",
  "/es/spin-the-wheel",
  "/random-subject-generator",
  "/this-or-that",
  "/funny-question-of-the-day",
  "/question-generator",
  "/es/conversation",
  "/truth-or-dare",
] as const;

export function adPageAllowed(path: string) {
  return ADSENSE_PUBLIC_PATHS.some(allowed => allowed === path);
}

export function adConfiguration(mode: string | undefined, slot: string | undefined = ADSENSE_ARTICLE_SLOT) {
  // This reviewed rollout includes: manual units only, Auto ads OFF, published
  // Google CMP and reviewed regional choices. A publisher ID is not a slot ID.
  return mode === "manual-public-reviewed-v1" && /^\d{6,20}$/.test(slot ?? "")
    ? { slot: slot! } : null;
}

export function adRequestAllowed(options: {
  path: string; host: string; search: string; qa: boolean; globalPrivacyControl: boolean;
}) {
  return adPageAllowed(options.path) &&
    ["randomtopics.app", "www.randomtopics.app"].includes(options.host) &&
    !options.search && !options.qa && !options.globalPrivacyControl;
}

export function adDocumentBoundary(previousPath: string, nextPath: string) {
  // AdSense has no supported SPA teardown. A fresh document also prevents a
  // later visit to private practice from inheriting a public-page ad runtime.
  return previousPath !== nextPath && (adPageAllowed(previousPath) || adPageAllowed(nextPath));
}

// A deny-only marker: the existing no-query policy excludes the next document
// before either CMP or AdSense can start. It never grants paid access.
export function adRetirementUrl(href: string) {
  const url = new URL(href);
  url.searchParams.set("rt_ads", "off");
  return url.href;
}

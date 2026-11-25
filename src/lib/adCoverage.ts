// Ad coverage diagnostics (2026-11-25). AdSense counted ~60% of Umami page
// views on randomtopics.app although every public path and template loads the
// runtime. One sampled `ad_cov` event per ad-eligible document, sent when the
// visitor leaves or hides it, records where the ad runtime stood at that point.
// Props reuse the existing Umami keys: reason = stage, seconds = time on page,
// slot = time to the first ad request, from = visibility when the page opened.

export const AD_COVERAGE_SAMPLE = 0.25;

export type AdRuntimeMarks = { load?: number; settled?: number; script?: number; request?: number; slow?: number; late?: number; cmp?: number; cmpError?: number };

/** Coarse buckets keep the event low-cardinality and comparable across days. */
export function msBucket(ms: number | undefined): string {
  if (ms === undefined || !Number.isFinite(ms) || ms < 0) return "none";
  if (ms < 1000) return "<1s";
  if (ms < 2000) return "1-2s";
  if (ms < 3000) return "2-3s";
  if (ms < 5000) return "3-5s";
  if (ms < 10000) return "5-10s";
  if (ms < 30000) return "10-30s";
  return "30s+";
}

export function adCoverageProps(input: { stage: string; marks: AdRuntimeMarks; elapsedMs: number; openedAs: string; path: string }) {
  // A timed-out SDK that arrived later is a slow network, not a blocker.
  const reason = input.stage === "script_timeout" && input.marks.late !== undefined ? "script_late" : input.stage;
  return {
    reason,
    seconds: msBucket(input.elapsedMs),
    slot: msBucket(input.marks.request),
    from: input.openedAs,
    page_path: input.path,
  };
}

/** Deterministic per-document sampling from a [0,1) draw. */
export function adCoverageSampled(draw: number, rate = AD_COVERAGE_SAMPLE) {
  return draw >= 0 && draw < rate;
}

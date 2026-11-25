// Read only the booleans required for the gate. Never store/log a TC string.
export type AdConsentData = {
  gdprApplies?: boolean;
  cmpStatus?: string;
  eventStatus?: string;
  purpose?: { consents?: Record<number, boolean> };
  vendor?: { consents?: Record<number, boolean> };
};
export type UsAdStatus = "unavailable" | "unknown" | "not-applicable" | "not-opted-out" | "opted-out";

export function advertisingConsent(data: AdConsentData | undefined, usStatus: UsAdStatus, gppStatus: UsAdStatus = "unavailable") {
  if (usStatus === "opted-out" || gppStatus === "opted-out") return false;
  if (data?.cmpStatus !== "loaded" || typeof data.gdprApplies !== "boolean") return false;
  if (data.gdprApplies) {
    if (data.eventStatus !== "tcloaded" && data.eventStatus !== "useractioncomplete") return false;
    // Non-personalized ads still require storage consent where applicable.
    // Google Advertising Products (GVL 755) must also have vendor consent.
    // AdSense independently validates the complete TCF legal bases/restrictions.
    return data.purpose?.consents?.[1] === true && data.vendor?.consents?.[755] === true;
  }
  // Explicit publisher policy: known non-European traffic uses mandatory RDP.
  // Missing optional US APIs are not consent or evidence of a non-US location.
  // An installed API that has not resolved (or failed) must still wait.
  // A configured applicable US message needs its live GPP subscription before
  // release, so a later opt-out can retire the document. No such dependency
  // is introduced for visitors whose optional US interfaces are absent.
  if (usStatus === "not-opted-out" && gppStatus === "unavailable") return false;
  return usStatus !== "unknown" && gppStatus !== "unknown";
}

export type ConsentBlocker = "us_opted_out" | "cmp_missing" | "cmp_not_loaded" | "gdpr_unknown" | "tcf_pending" |
  "tcf_denied" | "us_no_gpp" | "us_unknown" | "gpp_unknown";

/**
 * Diagnostics only (2026-11-25 ad coverage): which rule of advertisingConsent
 * holds requests back, or null when it allows them. Must stay in lockstep with
 * advertisingConsent; scripts/ad-coverage-regression.mjs checks every combination.
 */
export function consentBlocker(data: AdConsentData | undefined, usStatus: UsAdStatus, gppStatus: UsAdStatus = "unavailable"): ConsentBlocker | null {
  if (usStatus === "opted-out" || gppStatus === "opted-out") return "us_opted_out";
  if (!data) return "cmp_missing";
  if (data.cmpStatus !== "loaded") return "cmp_not_loaded";
  if (typeof data.gdprApplies !== "boolean") return "gdpr_unknown";
  if (data.gdprApplies) {
    if (data.eventStatus !== "tcloaded" && data.eventStatus !== "useractioncomplete") return "tcf_pending";
    return data.purpose?.consents?.[1] === true && data.vendor?.consents?.[755] === true ? null : "tcf_denied";
  }
  if (usStatus === "not-opted-out" && gppStatus === "unavailable") return "us_no_gpp";
  if (usStatus === "unknown") return "us_unknown";
  if (gppStatus === "unknown") return "gpp_unknown";
  return null;
}

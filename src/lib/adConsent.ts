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

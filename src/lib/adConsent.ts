// Read only the booleans required for the gate. Never store/log a TC string.
export type AdConsentData = {
  gdprApplies?: boolean;
  cmpStatus?: string;
  eventStatus?: string;
  purpose?: { consents?: Record<number, boolean> };
  vendor?: { consents?: Record<number, boolean> };
};
export type UsAdStatus = "unknown" | "not-applicable" | "not-opted-out" | "opted-out";

export function advertisingConsent(data: AdConsentData | undefined, usStatus: UsAdStatus) {
  if (data?.cmpStatus !== "loaded" || typeof data.gdprApplies !== "boolean") return false;
  if (data.gdprApplies) {
    if (data.eventStatus !== "tcloaded" && data.eventStatus !== "useractioncomplete") return false;
    // Non-personalized ads still require storage consent where applicable.
    // Google Advertising Products (GVL 755) must also have vendor consent.
    // AdSense independently validates the complete TCF legal bases/restrictions.
    return data.purpose?.consents?.[1] === true && data.vendor?.consents?.[755] === true;
  }
  // Until a US state message is verified published, do not infer permission
  // from NOT_OPTED_OUT. Confirmed non-applicability can use NPA + RDP.
  return usStatus === "not-applicable";
}

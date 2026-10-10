import type { UsAdStatus } from "./adConsent";

export type UsAdApi = {
  getInitialUsStatesOptOutStatus?: () => number | undefined;
  InitialUsStatesOptOutStatusEnum?: Record<string, number>;
};

// A missing optional interface is distinct from an installed but unresolved API.
// Neither value is a consent grant or a geographic classification.
export function initialUsAdAvailability(api: UsAdApi | undefined): UsAdStatus {
  return !api || (api.getInitialUsStatesOptOutStatus === undefined && api.InitialUsStatesOptOutStatusEnum === undefined)
    ? "unavailable" : "unknown";
}

// Invoke only from INITIAL_US_STATES_OPT_OUT_DATA_READY, per Google's API.
export function readInitialUsAdStatus(api: UsAdApi | undefined): UsAdStatus {
  if (initialUsAdAvailability(api) === "unavailable") return "unavailable";
  if (typeof api?.getInitialUsStatesOptOutStatus !== "function") return "unknown";
  const names = ["UNKNOWN", "DOES_NOT_APPLY", "NOT_OPTED_OUT", "OPTED_OUT"] as const;
  const values = names.map(name => api.InitialUsStatesOptOutStatusEnum?.[name]);
  if (values.some(value => typeof value !== "number" || !Number.isFinite(value)) || new Set(values).size !== 4) return "unknown";
  try {
    const value = api.getInitialUsStatesOptOutStatus();
    const statuses: UsAdStatus[] = ["unknown", "not-applicable", "not-opted-out", "opted-out"];
    return typeof value === "number" ? statuses[values.indexOf(value)] ?? "unknown" : "unknown";
  } catch { return "unknown"; }
}

export type GppAdData = {
  gppVersion?: string;
  cmpStatus?: string;
  signalStatus?: string;
  applicableSections?: number[];
  supportedAPIs?: string[];
  parsedSections?: Record<string, Record<string, unknown>[]>;
};

const sale = "SaleOptOut", sharing = "SharingOptOut", targeting = "TargetedAdvertisingOptOut";
const optOutFields: Record<string, string[]> = {
  usnat: [sale, sharing, targeting], usca: [sale, sharing],
  usco: [sale, targeting], usct: [sale, targeting], usva: [sale, targeting], usfl: [sale, targeting],
};

// GPP 1.1 parsedSections are arrays of segment objects. Read only the supported
// opt-out/GPC fields; never store, emit, decode or log the encoded GPP string.
export function gppAdStatus(data: GppAdData | undefined): UsAdStatus {
  if (data?.gppVersion !== "1.1" || data.cmpStatus !== "loaded" || data.signalStatus !== "ready" ||
    !Array.isArray(data.applicableSections) || !data.applicableSections.length) return "unknown";
  if (data.applicableSections.length === 1 && data.applicableSections[0] === -1) return "not-applicable";
  let unknown = false;
  for (const id of data.applicableSections) {
    const apis = Array.isArray(data.supportedAPIs)
      ? data.supportedAPIs.filter(api => typeof api === "string" && api.startsWith(`${id}:`)) : [];
    const name = apis?.length === 1 ? apis[0].split(":")[1] : "";
    const fields = Object.hasOwn(optOutFields, name) ? optOutFields[name] : undefined;
    const segments = data.parsedSections?.[name];
    if (!Number.isInteger(id) || id <= 0 || !fields || !Array.isArray(segments) || !segments.length ||
      segments.some(segment => !segment || typeof segment !== "object" || Array.isArray(segment))) { unknown = true; continue; }
    if (segments.some(segment => segment.Gpc === true)) return "opted-out";
    if (segments.some(segment => segment.Gpc !== undefined && typeof segment.Gpc !== "boolean")) unknown = true;
    for (const field of fields) {
      const values = segments.filter(segment => field in segment).map(segment => segment[field]);
      if (values.includes(1)) return "opted-out";
      // IAB: 0 = not applicable, 1 = opted out, 2 = not opted out.
      if (values.length !== 1 || ![0, 2].includes(values[0] as number)) unknown = true;
    }
  }
  return unknown ? "unknown" : "not-opted-out";
}

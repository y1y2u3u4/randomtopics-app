"use client";
import { ADSENSE_CLIENT, adRetirementUrl } from "./adsense";
import { advertisingConsent, type AdConsentData, type UsAdStatus } from "./adConsent";
import { gppAdStatus, initialUsAdAvailability, readInitialUsAdStatus, type GppAdData, type UsAdApi } from "./usAdSignal";

type AdQueue = { push(value: Record<string, unknown>): unknown; requestNonPersonalizedAds?: number; pauseAdRequests?: number };
declare global {
  interface Window {
    adsbygoogle?: AdQueue;
    googlefc?: {
      callbackQueue?: { push(callback: Record<string, () => void>): unknown };
      showRevocationMessage?: () => void;
      usstatesoptout?: UsAdApi;
    };
    __gpp?: (command: "addEventListener", callback: (data: { eventName?: string; data?: unknown; pingData?: GppAdData }, success: boolean) => void) => void;
    __tcfapi?: (command: "addEventListener", version: number, callback: (data: AdConsentData, success: boolean) => void) => void;
  }
  interface Navigator { readonly globalPrivacyControl?: boolean }
}

let loading: Promise<void> | undefined;
const prepared = new WeakSet<HTMLElement>();
const requested = new WeakSet<HTMLElement>();
let permitted = false, hasRequested = false;
let retired = false;
export function pauseAdRequests() {
  if (window.adsbygoogle) window.adsbygoogle.pauseAdRequests = 1;
}

export function retireAdDocument() {
  if (retired) return;
  retired = true;
  permitted = false;
  pauseAdRequests();
  // Removing a slot/script tag cannot revoke an executed SDK. Replace the
  // document with the same content at a URL that cannot bootstrap advertising.
  window.location.replace(adRetirementUrl(window.location.href));
}

export function loadAdSense() {
  if (retired) return Promise.reject(new Error("Advertising retired"));
  if (loading) return loading;
  const queue: AdQueue = window.adsbygoogle ??= [];
  // These settings reduce data use; they do not replace the published CMP.
  queue.requestNonPersonalizedAds = 1;
  queue.pauseAdRequests = 1;
  loading = new Promise<void>((resolve, reject) => {
    let scriptReady = false;
    let consent: AdConsentData | undefined;
    let usStatus: UsAdStatus = "unknown", gppStatus: UsAdStatus = "unavailable";
    let usResolved = false, gppSubscribed = false, tcfSubscribed = false, privacyFailed = false;
    const complete = () => {
      permitted = !retired && advertisingConsent(consent, usStatus, gppStatus) && navigator.globalPrivacyControl !== true;
      if (!permitted && window.adsbygoogle) window.adsbygoogle.pauseAdRequests = 1;
      // Dispose the complete third-party runtime after a final withdrawal.
      // Never reload while the message is open, which would interrupt choices.
      const withdrawn = navigator.globalPrivacyControl === true || usStatus === "opted-out" || gppStatus === "opted-out";
      if (!retired && hasRequested && !permitted && (withdrawn || privacyFailed ||
        consent?.eventStatus === "useractioncomplete" || consent?.cmpStatus === "error")) retireAdDocument();
      if (scriptReady && permitted) resolve();
    };
    // Published Google Privacy & messaging supplies the actual regional choice.
    // Missing/delayed CMP must not silently fall back to requesting ads.
    const messaging: NonNullable<Window["googlefc"]> = window.googlefc ??= {};
    const callbacks: NonNullable<NonNullable<Window["googlefc"]>["callbackQueue"]> = messaging.callbackQueue ??= [];
    const connectPrivacyApis = () => {
      if (!usResolved) usStatus = initialUsAdAvailability(window.googlefc?.usstatesoptout);
      // GPP is optional. If installed, wait for its own ready snapshot and keep
      // listening: Google's initial US getter does not report later choices.
      if (!gppSubscribed && typeof window.__gpp === "function") {
        gppSubscribed = true; gppStatus = "unknown";
        try {
          window.__gpp("addEventListener", (event, success) => {
            if (retired) return;
            const failed = !success || event?.eventName === "error" ||
              (event?.eventName === "listenerRegistered" && event.data === false);
            gppStatus = failed ? "unknown" : gppAdStatus(event?.pingData);
            privacyFailed = failed;
            complete();
          });
        } catch { gppStatus = "unknown"; privacyFailed = true; }
      }
      if (!tcfSubscribed && typeof window.__tcfapi === "function") {
        tcfSubscribed = true;
        try {
          window.__tcfapi("addEventListener", 2, (data, success) => {
            consent = success ? data : undefined;
            if (!success) privacyFailed = true;
            complete();
          });
        } catch { consent = undefined; privacyFailed = true; }
      }
      complete();
    };
    callbacks.push({ CONSENT_API_READY: connectPrivacyApis });
    callbacks.push({ CONSENT_DATA_READY: connectPrivacyApis });
    callbacks.push({ INITIAL_US_STATES_OPT_OUT_DATA_READY: () => {
      usResolved = true;
      usStatus = readInitialUsAdStatus(window.googlefc?.usstatesoptout);
      complete();
    } });
    // GPC has no standard change event. Recheck at focus/visibility boundaries;
    // requestAd also checks it immediately before its only possible release.
    window.addEventListener("focus", complete);
    document.addEventListener("visibilitychange", complete);
    // Initialize the existing published Google message independently. The
    // paused AdSense tag does not reliably start its own CMP bootstrap.
    // This is the message entrypoint used by Google's publisher SDK (ers=2),
    // with the same public publisher ID; it creates no messages/settings.
    if (!document.querySelector('iframe[name="googlefcPresent"]')) {
      const marker = document.createElement("iframe");
      marker.name = "googlefcPresent";
      marker.title = "Google privacy message availability";
      marker.style.display = "none";
      document.body.appendChild(marker);
    }
    const cmpScript = document.createElement("script");
    cmpScript.async = true;
    cmpScript.dataset.rtCmp = "published-google-message";
    cmpScript.src = `https://fundingchoicesmessages.google.com/i/${ADSENSE_CLIENT.slice(3)}?ers=2`;
    if (location.pathname === "/es" || location.pathname.startsWith("/es/")) cmpScript.src += "&hl=es";
    document.head.appendChild(cmpScript);
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.setAttribute("data-privacy-treatments", "disablePersonalization");
    script.setAttribute("data-rt-adsense", "manual-public-v1");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    const timeout = window.setTimeout(() => reject(new Error("Advertising unavailable")), 10000);
    script.onload = () => { window.clearTimeout(timeout); scriptReady = true; complete(); };
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("Advertising unavailable")); };
    document.head.appendChild(script);
  });
  return loading;
}

export function requestAd(element: HTMLElement) {
  if (retired || !permitted || navigator.globalPrivacyControl === true || !element.isConnected || !prepared.has(element) || element.getAttribute("data-restrict-data-processing") !== "1" || requested.has(element) || element.offsetWidth < 300 || element.offsetHeight < 250) return;
  // Mark before unpausing: a failure must not cause a refresh/retry loop or another
  // request on React StrictMode's repeated effects.
  requested.add(element);
  if (window.adsbygoogle) {
    window.adsbygoogle.requestNonPersonalizedAds = 1;
    window.adsbygoogle.pauseAdRequests = 0;
    hasRequested = true;
  }
}

export function prepareAd(element: HTMLElement) {
  if (retired || !element.isConnected || element.getAttribute("data-restrict-data-processing") !== "1" || prepared.has(element) || element.dataset.adsbygoogleStatus || element.offsetWidth < 300 || element.offsetHeight < 250) return;
  const queue: AdQueue = window.adsbygoogle ??= [];
  queue.requestNonPersonalizedAds = 1;
  queue.pauseAdRequests = 1;
  prepared.add(element);
  // Google's documented pause-before-push flow prepares the slot without an
  // ad request. The CMP starts independently; requestAd alone unpauses.
  queue.push({});
}

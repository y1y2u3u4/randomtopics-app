"use client";
import { ADSENSE_CLIENT } from "./adsense";
import { advertisingConsent, type AdConsentData, type UsAdStatus } from "./adConsent";

type AdQueue = { push(value: Record<string, unknown>): unknown; requestNonPersonalizedAds?: number; pauseAdRequests?: number };
declare global {
  interface Window {
    adsbygoogle?: AdQueue;
    googlefc?: {
      callbackQueue?: { push(callback: Record<string, () => void>): unknown };
      showRevocationMessage?: () => void;
      usstatesoptout?: {
        getInitialUsStatesOptOutStatus?: () => number;
        InitialUsStatesOptOutStatusEnum?: Record<string, number>;
      };
    };
    __tcfapi?: (command: "addEventListener", version: number, callback: (data: AdConsentData, success: boolean) => void) => void;
  }
  interface Navigator { readonly globalPrivacyControl?: boolean }
}

let loading: Promise<void> | undefined;
const prepared = new WeakSet<HTMLElement>();
const requested = new WeakSet<HTMLElement>();
let permitted = false, hasRequested = false;
export function loadAdSense() {
  if (loading) return loading;
  const queue: AdQueue = window.adsbygoogle ??= [];
  // These settings reduce data use; they do not replace the published CMP.
  queue.requestNonPersonalizedAds = 1;
  queue.pauseAdRequests = 1;
  loading = new Promise<void>((resolve, reject) => {
    let scriptReady = false;
    let consent: AdConsentData | undefined;
    let usStatus: UsAdStatus = "unknown";
    const complete = () => {
      permitted = advertisingConsent(consent, usStatus) && navigator.globalPrivacyControl !== true;
      if (!permitted && window.adsbygoogle) window.adsbygoogle.pauseAdRequests = 1;
      // Dispose the complete third-party runtime after a final withdrawal.
      // Never reload while the message is open, which would interrupt choices.
      if (hasRequested && !permitted && consent?.eventStatus === "useractioncomplete") window.location.reload();
      if (scriptReady && permitted) resolve();
    };
    // Published Google Privacy & messaging supplies the actual regional choice.
    // Missing/delayed CMP must not silently fall back to requesting ads.
    const messaging: NonNullable<Window["googlefc"]> = window.googlefc ??= {};
    const callbacks: NonNullable<NonNullable<Window["googlefc"]>["callbackQueue"]> = messaging.callbackQueue ??= [];
    callbacks.push({ CONSENT_API_READY: () => {
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        consent = success ? data : undefined;
        complete();
      });
    } });
    callbacks.push({ INITIAL_US_STATES_OPT_OUT_DATA_READY: () => {
      const api = window.googlefc?.usstatesoptout;
      const status = api?.getInitialUsStatesOptOutStatus?.();
      const values = api?.InitialUsStatesOptOutStatusEnum;
      usStatus = typeof status === "number" && values && status === values.DOES_NOT_APPLY
        ? "not-applicable" : "unknown";
      complete();
    } });
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
  if (!permitted || navigator.globalPrivacyControl === true || !element.isConnected || !prepared.has(element) || requested.has(element) || element.offsetWidth < 300 || element.offsetHeight < 250) return;
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
  if (!element.isConnected || prepared.has(element) || element.dataset.adsbygoogleStatus || element.offsetWidth < 300 || element.offsetHeight < 250) return;
  const queue: AdQueue = window.adsbygoogle ??= [];
  queue.requestNonPersonalizedAds = 1;
  queue.pauseAdRequests = 1;
  prepared.add(element);
  // Google's documented pause-before-push flow prepares the slot without an
  // ad request. The CMP starts independently; requestAd alone unpauses.
  queue.push({});
}

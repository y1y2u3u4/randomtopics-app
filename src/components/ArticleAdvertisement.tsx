"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, adRequestAllowed } from "@/lib/adsense";
import { loadAdSense, setAdEligibility, prepareAd, observeAdRequestsReady, showAdPrivacyChoices, retireAdDocument } from "@/lib/adsenseClient";
import { observeSpeechAdEntitlement } from "@/lib/speech/adEligibilityClient";

export default function ArticleAdvertisement({ path, slot }: { path: string; slot: string }) {
  const spanish = path === "/es" || path.startsWith("/es/");
  const unit = useRef<HTMLModElement>(null);
  const [choicesReady, setChoicesReady] = useState(false);
  const [excluded, setExcluded] = useState(false);
  useEffect(() => {
    const element = unit.current;
    let active = true, started = false;
    const allowed = () => {
      let qa = true;
      try { qa = sessionStorage.getItem("rt_usage_qa") === "1" || sessionStorage.getItem("rt_speech_qa") === "1"; }
      catch { return false; }
      return active && location.pathname === path && adRequestAllowed({ path, host: location.hostname,
        search: location.search, qa, globalPrivacyControl: navigator.globalPrivacyControl === true });
    };
    if (!element || !allowed()) {
      setExcluded(true);
      return;
    }
    const messaging: NonNullable<Window["googlefc"]> = window.googlefc ??= {};
    const callbacks: NonNullable<NonNullable<Window["googlefc"]>["callbackQueue"]> = messaging.callbackQueue ??= [];
    callbacks.push({ CONSENT_API_READY: () => {
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        if (active) setChoicesReady(success && data?.gdprApplies === true && Boolean(window.googlefc?.showRevocationMessage));
      });
    } });
    const start = () => {
      const bounds = element.getBoundingClientRect();
      if (!allowed() || !entitlement.gate.mayRequest() || document.hidden || bounds.width < 300 || bounds.height < 250 ||
        element.getAttribute("data-restrict-data-processing") !== "1") return;
      if (!started) {
        if (!entitlement.gate.begin()) return;
        started = true;
        // Bootstrap Auto ads after server eligibility, without requiring a
        // visitor to scroll down to the separate manual article placement.
        void loadAdSense().then(start).catch(() => { /* Failed ads must not interrupt the article. */ });
      }
      if (bounds.top <= window.innerHeight + 300 && bounds.bottom >= -300) prepareAd(element);
    };
    let frame: number | undefined;
    const entitlement = observeSpeechAdEntitlement({
      changed: state => {
        if (!active) return;
        setAdEligibility(state === "free" && allowed());
        // Only collapse a unit that has never loaded an SDK. Loaded documents
        // retire wholesale; CSS hiding is not used as their privacy boundary.
        if (!started) setExcluded(state === "paid" || state === "unavailable");
        if (state === "free") {
          if (frame !== undefined) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(start);
        }
      },
      retire: () => {
        setAdEligibility(false);
        // Cross-route unmount is already owned by AdDocumentBoundary, which
        // opens the destination as a fresh document. Avoid competing redirects.
        if (location.pathname === path) retireAdDocument();
      },
    });
    const stopReady = observeAdRequestsReady(start);
    const observer = new IntersectionObserver(start, { rootMargin: "300px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", start);
    return () => {
      active = false;
      stopReady();
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect(); document.removeEventListener("visibilitychange", start);
      entitlement.dispose();
    };
  }, [path, slot]);

  return <aside hidden={excluded} aria-label={spanish ? "Publicidad" : "Advertisement"} className="rt-article-ad print:hidden" data-ad-placement="public-content">
    <p className="mb-3 text-center text-xs text-[var(--text-muted)]">{spanish ? "Publicidad" : "Advertisement"}</p>
    <div style={{ width: 300, height: 250, margin: "0 auto" }}>
      <ins ref={unit} className="adsbygoogle" style={{ display: "inline-block", width: 300, height: 250 }}
        data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} data-restrict-data-processing="1" />
    </div>
    <div className="mt-6 h-16 text-center text-xs">
      <div className="h-11">{choicesReady && <button type="button" className="min-h-11 px-3 underline underline-offset-4" onClick={() => {
        showAdPrivacyChoices();
      }}>{spanish ? "Opciones de privacidad publicitaria" : "Advertising privacy choices"}</button>}</div>
      <Link href={spanish ? "/es/privacy" : "/privacy"} className="block underline underline-offset-4">{spanish ? "Política de privacidad" : "Privacy policy"}</Link>
    </div>
  </aside>;
}

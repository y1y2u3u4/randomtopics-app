"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, adRequestAllowed } from "@/lib/adsense";
import { loadAdSense, prepareAd, requestAd } from "@/lib/adsenseClient";

export default function ArticleAdvertisement({ path, slot }: { path: string; slot: string }) {
  const spanish = path === "/es" || path.startsWith("/es/");
  const unit = useRef<HTMLModElement>(null);
  const [choicesReady, setChoicesReady] = useState(false);
  useEffect(() => {
    const element = unit.current;
    let active = true, starting = false;
    const allowed = () => {
      let qa = true;
      try { qa = sessionStorage.getItem("rt_usage_qa") === "1" || sessionStorage.getItem("rt_speech_qa") === "1"; }
      catch { return false; }
      return active && location.pathname === path && adRequestAllowed({ path, host: location.hostname,
        search: location.search, qa, globalPrivacyControl: navigator.globalPrivacyControl === true });
    };
    if (!element || !allowed()) return;
    const messaging: NonNullable<Window["googlefc"]> = window.googlefc ??= {};
    const callbacks: NonNullable<NonNullable<Window["googlefc"]>["callbackQueue"]> = messaging.callbackQueue ??= [];
    callbacks.push({ CONSENT_API_READY: () => {
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        if (active) setChoicesReady(success && data?.gdprApplies === true && Boolean(window.googlefc?.showRevocationMessage));
      });
    } });
    const start = () => {
      const bounds = element.getBoundingClientRect();
      if (starting || !allowed() || document.hidden || bounds.width < 300 || bounds.height < 250 ||
        bounds.top > window.innerHeight + 300 || bounds.bottom < -300) return;
      starting = true;
      prepareAd(element);
      void loadAdSense().then(() => {
        if (!allowed()) return;
        if (document.hidden) { starting = false; return; }
        requestAd(element);
        observer.disconnect();
        document.removeEventListener("visibilitychange", start);
      }).catch(() => { /* Blocked/failed ads must not interrupt the article. */ });
    };
    const observer = new IntersectionObserver(start, { rootMargin: "300px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", start);
    return () => { active = false; observer.disconnect(); document.removeEventListener("visibilitychange", start); };
  }, [path, slot]);

  return <aside aria-label={spanish ? "Publicidad" : "Advertisement"} className="rt-article-ad print:hidden" data-ad-placement="public-content">
    <p className="mb-3 text-center text-xs text-[var(--text-muted)]">{spanish ? "Publicidad" : "Advertisement"}</p>
    <div style={{ width: 300, height: 250, margin: "0 auto" }}>
      <ins ref={unit} className="adsbygoogle" style={{ display: "inline-block", width: 300, height: 250 }}
        data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} data-restrict-data-processing="1" />
    </div>
    <div className="mt-6 h-16 text-center text-xs">
      <div className="h-11">{choicesReady && <button type="button" className="min-h-11 px-3 underline underline-offset-4" onClick={() => {
        if (window.adsbygoogle) window.adsbygoogle.pauseAdRequests = 1;
        window.googlefc?.callbackQueue?.push({ CONSENT_API_READY: () => window.googlefc?.showRevocationMessage?.() });
      }}>{spanish ? "Opciones de privacidad publicitaria" : "Advertising privacy choices"}</button>}</div>
      <Link href={spanish ? "/es/privacy" : "/privacy"} className="block underline underline-offset-4">{spanish ? "Política de privacidad" : "Privacy policy"}</Link>
    </div>
  </aside>;
}

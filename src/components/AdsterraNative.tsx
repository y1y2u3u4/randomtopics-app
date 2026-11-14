"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adPageAllowed, adRequestAllowed } from "@/lib/adsense";
import { ADSTERRA_NONE, adsterraCookie, adsterraNativeFromEnv } from "@/lib/adsterra";
import { observeSpeechAdEntitlement } from "@/lib/speech/adEligibilityClient";
import { track } from "@/lib/track";

// Adsterra Native experiment (src/lib/adsterra.ts). Renders no markup of its own: it inserts one container just above the
// page's <footer> (bottom of the content, never the first screen) after the server says this visitor's country is allowed.
// Same gates as the AdSense units: public ad page, host, no query, QA flag, GPC, paid/ad-free entitlement; never in an iframe.
// The script is injected fresh on every route (Next keeps the layout mounted, so a one-time injection only served page 1).
const RESERVED_HEIGHT = 300;

export default function AdsterraNative() {
  const path = usePathname() ?? "/";
  useEffect(() => {
    const config = adsterraNativeFromEnv();
    if (!config || !adPageAllowed(path)) return;
    let active = true, host: HTMLDivElement | undefined, observer: IntersectionObserver | undefined, loaded = false;
    const allowed = () => {
      let qa = true;
      try { qa = sessionStorage.getItem("rt_usage_qa") === "1" || sessionStorage.getItem("rt_speech_qa") === "1"; }
      catch { return false; }
      try { if (window.self !== window.top) return false; } catch { return false; }
      return active && location.pathname === path && adRequestAllowed({ path, host: location.hostname,
        search: location.search, qa, globalPrivacyControl: navigator.globalPrivacyControl === true });
    };
    if (!allowed()) return;
    const remove = () => { observer?.disconnect(); host?.remove(); host = undefined; };
    const mount = (country: string) => {
      if (!active || host || !allowed()) return;
      const footer = document.querySelector("footer");
      const anchor = footer?.parentElement;
      if (!footer || !anchor) return;
      host = document.createElement("div");
      host.className = "rt-adst print:hidden";
      host.setAttribute("aria-label", "Advertisement");
      host.setAttribute("data-ad-placement", "adsterra-native-foot");
      host.style.cssText = `min-height:${RESERVED_HEIGHT}px;margin:24px auto;max-width:720px;padding:0 16px;text-align:center`;
      const label = document.createElement("p");
      label.textContent = "Advertisement";
      label.style.cssText = "font-size:12px;margin:0 0 8px;color:var(--text-muted)";
      const box = document.createElement("div");
      box.id = config.id;
      host.append(label, box);
      anchor.insertBefore(host, footer);
      // Request only when the block is about to be seen.
      observer = new IntersectionObserver((entries) => {
        if (loaded || !entries.some((e) => e.isIntersecting) || document.hidden || !allowed()) return;
        loaded = true;
        observer?.disconnect();
        const s = document.createElement("script");
        s.async = true;
        s.src = config.src;
        s.setAttribute("data-cfasync", "false");
        box.appendChild(s);
        track("adsterra_native_load", { country, page_path: path });
      }, { rootMargin: "300px 0px" });
      observer.observe(host);
    };
    const start = async () => {
      let country = adsterraCookie(document.cookie);
      if (country === ADSTERRA_NONE) return;
      if (!country) {
        try {
          const r = await fetch("/api/adslot/", { credentials: "same-origin" });
          const s: { src?: string; id?: string; country?: string } = r.ok ? await r.json() : {};
          if (!s.src || !s.id || !s.country) return;
          country = s.country;
        } catch { return; }
      }
      mount(country);
    };
    // Paid or ad-free visitors never see it; an entitlement change mid-visit removes it.
    const entitlement = observeSpeechAdEntitlement({
      changed: (state) => {
        if (!active) return;
        if (state === "free") void start();
        else if (!loaded) remove();
      },
      retire: () => { active = false; remove(); },
    });
    return () => { active = false; entitlement.dispose(); remove(); };
  }, [path]);
  return null;
}

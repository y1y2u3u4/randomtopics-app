"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPath, stripLocale, localizePath, isEnOnly } from "@/i18n/config";

/**
 * Toggles between the English (root) and Spanish (/es) version of the current
 * page. Purely client-side — derives the counterpart URL from the pathname.
 */
export default function LocaleSwitcher() {
  const pathname = usePathname() || "/";
  const current = localeFromPath(pathname);
  const rootPath = stripLocale(pathname);
  const target = current === "es" ? "en" : "es";
  const href = localizePath(rootPath, target);

  // English-only pages have no Spanish counterpart — hide the toggle so it
  // never links to a nonexistent /es route.
  if (target === "es" && isEnOnly(rootPath)) return null;

  return (
    <Link
      href={href}
      hrefLang={target}
      aria-label={target === "es" ? "Ver en español" : "View in English"}
      className="nav-link px-2.5 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
    >
      <span aria-hidden>🌐</span>
      <span className="font-medium">{target === "es" ? "ES" : "EN"}</span>
    </Link>
  );
}

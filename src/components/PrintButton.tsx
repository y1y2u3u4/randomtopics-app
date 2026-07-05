"use client";

import { useCallback } from "react";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

interface PrintButtonProps {
  /** Heading printed at the top of the document. */
  heading: string;
  /** Ordered list of items (questions / prompts / topics) to print. */
  items: string[];
  /** Optional short intro line under the heading. */
  intro?: string;
  label?: string;
  locale?: Locale;
}

/**
 * Dependency-free "Save as PDF" export. Opens a print-optimised document in a
 * new window and triggers the browser's print dialog, where the user can pick
 * "Save as PDF". Produces a clean, brandable handout for classrooms, parties,
 * and Teachers-Pay-Teachers / Pinterest distribution.
 */
export default function PrintButton({ heading, items, intro, label, locale = defaultLocale }: PrintButtonProps) {
  const t = getDict(locale);
  const btnLabel = label ?? t.print.defaultLabel;
  const handlePrint = useCallback(() => {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const rows = items
      .map(
        (q, i) =>
          `<li><span class="n">${i + 1}.</span> ${esc(q)}</li>`
      )
      .join("");

    win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(heading)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a2e; margin: 40px; line-height: 1.5; }
  h1 { font-size: 26px; margin: 0 0 6px; }
  .intro { color: #555; margin: 0 0 24px; font-size: 14px; }
  ol, ul { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 40px; }
  li { break-inside: avoid; margin: 0 0 12px; font-size: 14px; padding-left: 4px; }
  .n { color: #b14eff; font-weight: 700; margin-right: 6px; }
  footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #ddd; color: #888; font-size: 12px; }
  @media print { body { margin: 24px; } @page { margin: 16mm; } }
</style>
</head>
<body>
  <h1>${esc(heading)}</h1>
  ${intro ? `<p class="intro">${esc(intro)}</p>` : ""}
  <ul>${rows}</ul>
  <footer>${esc(t.print.footerNote(items.length))}</footer>
  <script>window.onload = function () { window.print(); };<\/script>
</body>
</html>`);
    win.document.close();
  }, [heading, items, intro, t]);

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
    >
      {btnLabel}
    </button>
  );
}

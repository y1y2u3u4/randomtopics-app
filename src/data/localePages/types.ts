import type { LocaleTopicGroup } from "@/components/LocaleTopicPicker";

// One standalone es/pt/fr/tr landing page rendered by LocaleToolPage (2026-10-21 batch).
export type LocalePageConfig = {
  /** Full path, e.g. "/es/preguntas-filosoficas". */
  path: string;
  /** English original this page is the counterpart of (hreflang). */
  enPath: string;
  /** English page name, used in the "English version" footer link. */
  englishLabel: string;
  /** <title>, absolute. May contain {n} for the item count. */
  metaTitle: string;
  /** Meta description, 140–160 chars. May contain {n}. */
  description: string;
  /** H1. */
  title: string;
  /** Intro paragraph under the H1. May contain {n}. */
  lead: string;
  buttonLabel: string;
  mode?: "card" | "wheel" | "timer";
  /** Short label + detail for the sibling-page cards. */
  sibling: { label: string; detail: string; emoji?: string };
  groups: LocaleTopicGroup[];
  howTo: string[];
  faq: { question: string; answer: string }[];
};

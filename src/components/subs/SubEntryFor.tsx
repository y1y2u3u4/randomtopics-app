import { SUB_ENTRY_PAGES, type SubEntryConfig } from "@/lib/subs/entries";
import SubEntry from "./SubEntry";

/** Renders the paid entry listed for this path in SUB_ENTRY_PAGES (nothing otherwise). */
export default function SubEntryFor({ path, after }: { path: string; after?: SubEntryConfig["after"] }) {
  const entry = SUB_ENTRY_PAGES[path];
  if (!entry || (after && entry.after !== after)) return null;
  return <SubEntry product={entry.product} href={entry.href} text={entry.text} cta={entry.cta} after={entry.after} locale={entry.locale ?? "en"} />;
}

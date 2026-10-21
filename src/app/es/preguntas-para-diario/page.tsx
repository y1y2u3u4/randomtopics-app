import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/preguntas-para-diario";

export const metadata = localePageMetadata(path);

export default function EsJournalPromptsPage() {
  return <LocaleConfigPage path={path} />;
}

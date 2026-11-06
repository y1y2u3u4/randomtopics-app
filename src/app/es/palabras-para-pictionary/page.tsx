import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/palabras-para-pictionary";

export const metadata = localePageMetadata(path);

export default function EsPictionaryWordsPage() {
  return <LocaleConfigPage path={path} />;
}

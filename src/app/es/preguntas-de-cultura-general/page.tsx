import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/preguntas-de-cultura-general";

export const metadata = localePageMetadata(path);

export default function EsTriviaPage() {
  return <LocaleConfigPage path={path} />;
}

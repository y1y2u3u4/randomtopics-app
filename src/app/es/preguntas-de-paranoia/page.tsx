import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/preguntas-de-paranoia";

export const metadata = localePageMetadata(path);

export default function EsParanoiaPage() {
  return <LocaleConfigPage path={path} />;
}

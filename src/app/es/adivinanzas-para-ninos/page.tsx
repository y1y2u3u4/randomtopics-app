import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/adivinanzas-para-ninos";

export const metadata = localePageMetadata(path);

export default function EsRiddlesPage() {
  return <LocaleConfigPage path={path} />;
}

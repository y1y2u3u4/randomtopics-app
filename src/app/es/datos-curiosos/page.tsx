import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/datos-curiosos";

export const metadata = localePageMetadata(path);

export default function EsFunFactsPage() {
  return <LocaleConfigPage path={path} />;
}

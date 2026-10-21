import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/charadas-para-criancas";

export const metadata = localePageMetadata(path);

export default function PtRiddlesPage() {
  return <LocaleConfigPage path={path} />;
}

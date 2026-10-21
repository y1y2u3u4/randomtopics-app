import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/temas-para-ensayos";

export const metadata = localePageMetadata(path);

export default function EsEssayTopicsPage() {
  return <LocaleConfigPage path={path} />;
}

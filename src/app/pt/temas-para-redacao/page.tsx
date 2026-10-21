import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/temas-para-redacao";

export const metadata = localePageMetadata(path);

export default function PtEssayThemesPage() {
  return <LocaleConfigPage path={path} />;
}

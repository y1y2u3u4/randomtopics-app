import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/temas-para-pesquisa";

export const metadata = localePageMetadata(path);

export default function PtResearchTopicsPage() {
  return <LocaleConfigPage path={path} />;
}

import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/perguntas-de-conhecimentos-gerais";

export const metadata = localePageMetadata(path);

export default function PtTriviaPage() {
  return <LocaleConfigPage path={path} />;
}

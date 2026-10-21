import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/perguntas-profundas";

export const metadata = localePageMetadata(path);

export default function PtDeepQuestionsPage() {
  return <LocaleConfigPage path={path} />;
}

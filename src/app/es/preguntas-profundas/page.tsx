import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/preguntas-profundas";

export const metadata = localePageMetadata(path);

export default function EsDeepQuestionsPage() {
  return <LocaleConfigPage path={path} />;
}

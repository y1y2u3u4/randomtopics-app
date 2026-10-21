import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/preguntas-filosoficas";

export const metadata = localePageMetadata(path);

export default function EsPhilosophicalQuestionsPage() {
  return <LocaleConfigPage path={path} />;
}

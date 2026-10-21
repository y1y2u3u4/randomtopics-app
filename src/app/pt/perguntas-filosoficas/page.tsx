import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/perguntas-filosoficas";

export const metadata = localePageMetadata(path);

export default function PtPhilosophicalQuestionsPage() {
  return <LocaleConfigPage path={path} />;
}

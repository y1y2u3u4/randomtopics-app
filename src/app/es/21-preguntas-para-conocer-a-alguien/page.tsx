import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/21-preguntas-para-conocer-a-alguien";

export const metadata = localePageMetadata(path);

export default function Es21QuestionsPage() {
  return <LocaleConfigPage path={path} />;
}

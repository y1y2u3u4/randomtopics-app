import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/perguntas-para-quebrar-o-gelo";

export const metadata = localePageMetadata(path);

export default function PtIcebreakerPage() {
  return <LocaleConfigPage path={path} />;
}

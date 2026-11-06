import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/ideas-para-escribir-historias";

export const metadata = localePageMetadata(path);

export default function EsStoryIdeasPage() {
  return <LocaleConfigPage path={path} />;
}

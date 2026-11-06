import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/temas-para-debatir-en-grupo";

export const metadata = localePageMetadata(path);

export default function EsGroupDiscussionPage() {
  return <LocaleConfigPage path={path} />;
}

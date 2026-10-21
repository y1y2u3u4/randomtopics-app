import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/ideias-para-desenhar";

export const metadata = localePageMetadata(path);

export default function PtDrawingIdeasPage() {
  return <LocaleConfigPage path={path} />;
}

import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/ideas-para-dibujar";

export const metadata = localePageMetadata(path);

export default function EsDrawingIdeasPage() {
  return <LocaleConfigPage path={path} />;
}

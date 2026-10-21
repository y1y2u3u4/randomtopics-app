import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/gerador-de-palavras-aleatorias";

export const metadata = localePageMetadata(path);

export default function PtRandomWordPage() {
  return <LocaleConfigPage path={path} />;
}

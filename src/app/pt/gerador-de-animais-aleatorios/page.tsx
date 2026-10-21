import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/gerador-de-animais-aleatorios";

export const metadata = localePageMetadata(path);

export default function PtRandomAnimalPage() {
  return <LocaleConfigPage path={path} />;
}

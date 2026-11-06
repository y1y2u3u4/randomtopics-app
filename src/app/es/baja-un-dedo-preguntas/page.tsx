import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/baja-un-dedo-preguntas";

export const metadata = localePageMetadata(path);

export default function EsPutAFingerDownPage() {
  return <LocaleConfigPage path={path} />;
}

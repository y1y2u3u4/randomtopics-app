import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/es/dilemas-morales";

export const metadata = localePageMetadata(path);

export default function EsMoralDilemmasPage() {
  return <LocaleConfigPage path={path} />;
}

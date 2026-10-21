import { LocaleConfigPage, localePageMetadata } from "@/lib/localePages";

const path = "/pt/isso-ou-aquilo";

export const metadata = localePageMetadata(path);

export default function PtThisOrThatPage() {
  return <LocaleConfigPage path={path} />;
}

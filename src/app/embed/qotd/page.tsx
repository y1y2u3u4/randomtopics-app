import { Suspense } from "react";
import QotdEmbed from "./QotdEmbed";

export const metadata = {
  title: "Question of the Day Widget",
  alternates: { canonical: "/question-of-the-day-widget" },
  robots: { index: false, follow: true },
};

export default function QotdEmbedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16, color: "#8b95b0", fontFamily: "system-ui" }}>Loading today&apos;s question…</div>}>
      <QotdEmbed />
    </Suspense>
  );
}

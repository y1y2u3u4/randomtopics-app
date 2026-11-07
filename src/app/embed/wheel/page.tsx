import { Suspense } from "react";
import WheelEmbed from "./WheelEmbed";

export const metadata = {
  title: "Spin the Wheel Widget",
  alternates: { canonical: "/question-of-the-day-widget" },
  robots: { index: false, follow: true },
};

export default function WheelEmbedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16, color: "#8b95b0", fontFamily: "system-ui" }}>Loading wheel…</div>}>
      <WheelEmbed />
    </Suspense>
  );
}

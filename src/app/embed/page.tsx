import { Suspense } from "react";
import EmbedContent from "./EmbedContent";

export const metadata = {
  title: "Random Topics Widget",
  robots: { index: false, follow: false },
};

export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 16, color: "#8b95b0" }}>Loading...</div>
      }
    >
      <EmbedContent />
    </Suspense>
  );
}

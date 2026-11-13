import WouldYouRatherCollectionPage, { wouldYouRatherMetadata } from "@/components/collections/WouldYouRatherCollectionPage";
import { getWouldYouRatherCollection } from "@/data/wouldYouRatherCollections";

const c = getWouldYouRatherCollection("christmas");
export const metadata = wouldYouRatherMetadata(c);

export default function Page() {
  return <WouldYouRatherCollectionPage c={c} />;
}

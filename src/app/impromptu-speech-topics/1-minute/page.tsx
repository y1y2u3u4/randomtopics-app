import ImpromptuCollectionPage, { impromptuMetadata } from "@/components/collections/ImpromptuCollectionPage";
import { getImpromptuCollection } from "@/data/impromptuCollections";

const c = getImpromptuCollection("1-minute");
export const metadata = impromptuMetadata(c);

export default function Page() {
  return <ImpromptuCollectionPage c={c} />;
}

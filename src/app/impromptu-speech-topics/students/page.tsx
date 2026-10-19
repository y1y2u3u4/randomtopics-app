import ImpromptuCollectionPage, { impromptuMetadata } from "@/components/collections/ImpromptuCollectionPage";
import { getImpromptuCollection } from "@/data/impromptuCollections";

const c = getImpromptuCollection("students");
export const metadata = impromptuMetadata(c);

export default function Page() {
  return <ImpromptuCollectionPage c={c} />;
}

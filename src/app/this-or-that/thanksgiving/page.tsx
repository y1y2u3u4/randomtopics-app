import ThisOrThatCollectionPage, { thisOrThatMetadata } from "@/components/collections/ThisOrThatCollectionPage";
import { getThisOrThatCollection } from "@/data/thisOrThatCollections";

const c = getThisOrThatCollection("thanksgiving");
export const metadata = thisOrThatMetadata(c);

export default function Page() {
  return <ThisOrThatCollectionPage c={c} />;
}

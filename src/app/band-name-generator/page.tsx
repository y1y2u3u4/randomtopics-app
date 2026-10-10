import NameGeneratorPage, { nameGeneratorMetadata } from "@/components/NameGeneratorPage";
export const metadata = nameGeneratorMetadata("band");
export default function Page() { return <NameGeneratorPage kind="band" />; }

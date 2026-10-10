import NameGeneratorPage, { nameGeneratorMetadata } from "@/components/NameGeneratorPage";
export const metadata = nameGeneratorMetadata("dragon");
export default function Page() { return <NameGeneratorPage kind="dragon" />; }

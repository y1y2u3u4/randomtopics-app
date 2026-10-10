import RandomPickerPage, { pickerMetadata } from "@/components/RandomPickerPage";
export const metadata = pickerMetadata("object");
export default function Page() { return <RandomPickerPage kind="object" />; }

import RandomPickerPage, { pickerMetadata } from "@/components/RandomPickerPage";
export const metadata = pickerMetadata("state");
export default function Page() { return <RandomPickerPage kind="state" />; }

import RandomPickerPage, { pickerMetadata } from "@/components/RandomPickerPage";
export const metadata = pickerMetadata("country");
export default function Page() { return <RandomPickerPage kind="country" />; }

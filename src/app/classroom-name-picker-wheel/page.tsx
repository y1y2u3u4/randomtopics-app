import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("classroom-name-picker-wheel");

export default function Page() {
  return <WheelTemplatePage slug="classroom-name-picker-wheel" />;
}

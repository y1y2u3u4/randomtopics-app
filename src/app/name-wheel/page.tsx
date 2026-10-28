import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("name-wheel");

export default function Page() {
  return <WheelTemplatePage slug="name-wheel" />;
}

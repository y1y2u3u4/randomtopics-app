import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("random-wheel");

export default function Page() {
  return <WheelTemplatePage slug="random-wheel" />;
}

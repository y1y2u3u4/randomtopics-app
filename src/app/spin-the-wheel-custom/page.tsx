import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("spin-the-wheel-custom");

export default function Page() {
  return <WheelTemplatePage slug="spin-the-wheel-custom" />;
}

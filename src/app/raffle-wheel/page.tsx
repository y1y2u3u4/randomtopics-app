import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("raffle-wheel");

export default function Page() {
  return <WheelTemplatePage slug="raffle-wheel" />;
}

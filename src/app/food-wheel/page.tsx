import WheelTemplatePage, { wheelTemplateMetadata } from "@/components/generators/WheelTemplatePage";

export const metadata = wheelTemplateMetadata("food-wheel");

export default function Page() {
  return <WheelTemplatePage slug="food-wheel" />;
}

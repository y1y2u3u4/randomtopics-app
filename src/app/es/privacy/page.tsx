import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { hreflangAlternates } from "@/i18n/config";
export const metadata: Metadata = { title: { absolute: "Política de privacidad | Random Topics" }, description: "Cómo RandomTopics trata las cuentas, las prácticas orales, las estadísticas y tus opciones de privacidad.", alternates: { canonical: "/es/privacy", languages: hreflangAlternates("/privacy") } };
export default function Page() { return <PrivacyPolicy locale="es" />; }

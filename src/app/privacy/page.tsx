import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { hreflangAlternates } from "@/i18n/config";
export const metadata: Metadata = { title: { absolute: "Privacy Policy | Random Topics" }, description: "How RandomTopics handles accounts, speech practice, analytics and your privacy choices.", alternates: { canonical: "/privacy", languages: hreflangAlternates("/privacy") } };
export default function Page() { return <PrivacyPolicy locale="en" />; }

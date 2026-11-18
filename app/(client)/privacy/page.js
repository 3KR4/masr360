import LegalPage from "@/components/LegalPage";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Privacy Policy | M360",
  description:
    "Understand how M360 collects, uses, and protects your personal data and privacy across our website and services.",
  url: "/privacy",
  image: "/brand/og-image.jpg",
});

export default function PrivacyPolicyPage() {
  return <LegalPage activeTab="privacy" />;
}

import LegalPage from "@/components/LegalPage";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Privacy Policy | Masr360",
  description:
    "Understand how Masr360 collects, uses, and protects your personal data and privacy across our website and services.",
  url: "/privacy",
  image: "/brand/og-image.jpg",
});

export default function PrivacyPolicyPage() {
  return <LegalPage activeTab="privacy" />;
}

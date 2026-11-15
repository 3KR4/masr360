import LegalPage from "@/components/LegalPage";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Terms of Service | Masr360",
  description:
    "Read the Terms of Service governing the use of the Masr360 platform, services, marketplace, and content.",
  url: "/terms",
  image: "/brand/og-image.jpg",
});

export default function TermsAndConditionsPage() {
  return <LegalPage activeTab="terms" />;
}

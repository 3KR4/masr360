import SupportClient from "./SupportClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Contact & Support | M360",
  description:
    "Need help or have questions? Get in touch with the M360 support team for inquiries, feedback, or assistance.",
  url: "/support",
  image: "/brand/og-image.jpg",
});

export default function SupportPage() {
  return <SupportClient />;
}

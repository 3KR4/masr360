import SupportSuccessClient from "./SupportSuccessClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Message Received | M360 Support",
  description:
    "Thank you for reaching out. The M360 team will get back to you shortly.",
  url: "/support-success",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function SupportSuccessPage() {
  return <SupportSuccessClient />;
}

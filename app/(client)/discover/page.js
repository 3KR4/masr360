import DiscoverClient from "./DiscoverClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Discover Egypt's Governorates & Regions | M360",
  description:
    "Explore Egypt governorate by governorate. Learn about Cairo, Alexandria, Luxor, Aswan, and beyond with comprehensive guides on M360.",
  url: "/discover",
  image: "/brand/og-image.jpg",
});

export default function DiscoverPage() {
  return <DiscoverClient />;
}

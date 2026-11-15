import MarketplaceClient from "./MarketplaceClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Egyptian Heritage Marketplace | Handmade Crafts & Souvenirs | Masr360",
  description:
    "Shop authentic Egyptian handmade crafts, jewelry, home decor, and souvenirs made by talented local artisans on Masr360.",
  url: "/marketplace",
  image: "/brand/og-image.jpg",
});

export default function MarketplacePage() {
  return <MarketplaceClient />;
}

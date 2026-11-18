import FavoritesClient from "./FavoritesClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Your Saved Favorites | M360",
  description:
    "View your saved places, events, and authentic products on M360.",
  url: "/favorites",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function FavoritesPage() {
  return <FavoritesClient />;
}

import PlacesClient from "./PlacesClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Explore Historic & Iconic Places in Egypt | Masr360",
  description:
    "Browse and discover ancient monuments, religious landmarks, beaches, and hidden gems across Egypt with Masr360.",
  url: "/places",
  image: "/brand/og-image.jpg",
});

export default function PlacesPage() {
  return <PlacesClient />;
}

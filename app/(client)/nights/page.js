import NightsClient from "./NightsClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Nightlife & Evening Entertainment in Egypt | Masr360",
  description:
    "Experience the best of Egyptian nightlife, live music, river cruises, and evening entertainment with Masr360.",
  url: "/nights",
  image: "/brand/og-image.jpg",
});

export default function NightsPage() {
  return <NightsClient />;
}

import AboutClient from "./AboutClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "About Us | Masr360 - Promoting Egypt's Rich Heritage",
  description:
    "Learn about the mission, vision, and team behind Masr360, dedicated to showcasing Egypt's heritage, culture, and beauty to the world.",
  url: "/about",
  image: "/brand/og-image.jpg",
});

export default function AboutPage() {
  return <AboutClient />;
}

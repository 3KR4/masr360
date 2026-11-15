import { notFound } from "next/navigation";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Page Not Found | Masr360",
  description: "The page you are looking for does not exist on Masr360.",
  url: "/404",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function CatchAllNotFound() {
  notFound();
}

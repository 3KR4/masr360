import GamesClient from "./GamesClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Interactive Egyptian Cultural Games & Trivia | M360",
  description:
    "Test your knowledge of Egyptian heritage, history, and geography with fun, interactive games and challenges on M360.",
  url: "/games",
  image: "/brand/og-image.jpg",
});

export default function GamesPage() {
  return <GamesClient />;
}

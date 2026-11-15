import GamesClient from "./GamesClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Interactive Egyptian Cultural Games & Trivia | Masr360",
  description:
    "Test your knowledge of Egyptian heritage, history, and geography with fun, interactive games and challenges on Masr360.",
  url: "/games",
  image: "/brand/og-image.jpg",
});

export default function GamesPage() {
  return <GamesClient />;
}

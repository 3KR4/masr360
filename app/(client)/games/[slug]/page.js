import GamePlayClient from "./GamePlayClient";
import { getGameBySlug, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const game = getGameBySlug(slug);

  if (!game) {
    return buildSEO({
      title: "Interactive Egyptian Cultural Games & Trivia",
      description:
        "Test your knowledge of Egyptian heritage, history, and geography with fun, interactive games and challenges on M360.",
      url: `/games/${slug || ""}`,
    });
  }

  const gameName = game.name || "Egyptian Trivia Game";
  const gameDesc =
    game.description ||
    `Play ${gameName} on M360 and test your knowledge of Egyptian culture, history, and landmarks.`;

  return buildSEO({
    title: `Play ${gameName} | M360 Games`,
    description: `Play ${gameName} on M360 and test your knowledge of Egyptian culture, history, and landmarks. ${gameDesc}`,
    image: game.image || "/brand/og-image.jpg",
    url: `/games/${slug}`,
    extraOpenGraph: {
      type: "website",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <GamePlayClient slug={resolvedParams?.slug} />;
}

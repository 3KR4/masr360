import GamePreviewClient from "./GamePreviewClient";
import { getGameBySlug, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const game = getGameBySlug(slug);

  if (!game) {
    return buildSEO({
      title: "Preview Egyptian Games & Trivia",
      description:
        "Preview games on M360. Challenge yourself with interactive Egyptian trivia and adventure games.",
      url: `/games/preview/${slug || ""}`,
    });
  }

  const gameName = game.name || "Egyptian Trivia Game";
  const gameDesc =
    game.description ||
    `Preview ${gameName} on M360. Get ready to challenge yourself with interactive Egyptian trivia and games.`;

  return buildSEO({
    title: `Preview: ${gameName} | M360 Games`,
    description: `Preview ${gameName} on M360. Get ready to challenge yourself with interactive Egyptian trivia and games. ${gameDesc}`,
    image: game.image || "/brand/og-image.jpg",
    url: `/games/preview/${slug}`,
    extraOpenGraph: {
      type: "website",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <GamePreviewClient slug={resolvedParams?.slug} />;
}

import { Noto_Sans_Egyptian_Hieroglyphs } from "next/font/google";
import GameComingSoon from "@/components/games/GameComingSoon";

// Hieroglyphs for the coming-soon chamber walls
const glyphFont = Noto_Sans_Egyptian_Hieroglyphs({
  subsets: ["egyptian-hieroglyphs"],
  weight: "400",
  display: "swap",
  variable: "--font-glyph",
});

// Flip NEXT_PUBLIC_GAME_LAUNCHED=true in the env when the game is ready.
// Until then every /games route shows the coming-soon page.
const GAME_LAUNCHED = process.env.NEXT_PUBLIC_GAME_LAUNCHED === "true";

export default function GamesLayout({ children }) {
  if (GAME_LAUNCHED) return children;

  return (
    <div className={glyphFont.variable} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <GameComingSoon />
    </div>
  );
}

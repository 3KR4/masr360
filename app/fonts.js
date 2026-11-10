import localFont from "next/font/local";
import { Poppins, Alexandria } from "next/font/google";

// Brand primary / display face (MASR 360 Brand Guidelines → Gotham Black)
export const gotham = localFont({
  src: "./fonts/Gotham-Black.otf",
  weight: "900",
  style: "normal",
  display: "swap",
  variable: "--font-gotham",
  fallback: ["Poppins", "Arial Black", "sans-serif"],
});

// Brand "type in use" (Light, Regular, Medium, SemiBold, Bold)
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

// Arabic companion: geometric, heavy-capable, named after an Egyptian city
export const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-alexandria",
});

export const fontVariables = `${gotham.variable} ${poppins.variable} ${alexandria.variable}`;

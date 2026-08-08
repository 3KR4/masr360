import { Cinzel, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MainProvider } from "@/Contexts/mainContext";
import "@/styles/globals.css";
import { AuthProvider } from "@/Contexts/AuthContext";
import { CartProvider } from "@/Contexts/CartContext";
import { FavouritesProvider } from "@/Contexts/FavouritesContext";
import { NotificationProvider } from "@/Contexts/NotificationContext";
import NotificationHolder from "@/components/settings/NotificationHolder";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cinzel",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});
export const metadata = {
  title: "Masr360",
  description:
    "Explore hidden gems, exciting night spots, and real Egyptian culture with Masr360. Your journey starts here — fun, local, and unforgettable.",

  openGraph: {
    title: "Masr360",
    description:
      "Explore hidden gems, exciting night spots, and real Egyptian culture with Masr360. Your journey starts here — fun, local, and unforgettable.",
    url: "https://masr360.vercel.app/",
    siteName: "Masr360",
    images: [
      {
        url: "/favicon-512.png",
        width: 1000,
        height: 1000,
        alt: "Masr360-logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon-512.png",
    shortcut: "/favicon-512.png",
    apple: "/favicon-512.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="EN" className={`${poppins.variable} ${cinzel.variable}`}>
      <body>
        <MainProvider>
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>
                <FavouritesProvider>
                  <Header />

                  {children}
                  <Footer />
                  <NotificationHolder />
                </FavouritesProvider>
              </CartProvider>
            </AuthProvider>
          </NotificationProvider>
        </MainProvider>
      </body>
    </html>
  );
}

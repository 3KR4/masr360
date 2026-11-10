import { fontVariables } from "@/app/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreFooterCTA from "@/components/PreFooterCTA";
import MotionFX from "@/components/brand/MotionFX";
import { MainProvider } from "@/Contexts/mainContext";
import "@/styles/globals.css";
import "@/styles/components/brand.css";
import { AuthProvider } from "@/Contexts/AuthContext";
import { CartProvider } from "@/Contexts/CartContext";
import { FavouritesProvider } from "@/Contexts/FavouritesContext";
import { NotificationProvider } from "@/Contexts/NotificationContext";
import NotificationHolder from "@/components/settings/NotificationHolder";
import GoldDust from "@/components/GoldDust";
import AOSInit from "@/components/AOSInit";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#140b08" },
  ],
};

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
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Masr360-logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/brand/favicon-32.png",
    apple: "/brand/favicon-180.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="EN" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Apply saved theme + language before first paint (no theme flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,t=localStorage.getItem("theme")||"dark",l=localStorage.getItem("locale")||"EN";d.setAttribute("data-theme",t);d.setAttribute("lang",l);d.setAttribute("dir",l==="AR"?"rtl":"ltr")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <AOSInit />
        <MotionFX />
        <GoldDust />
        <MainProvider>
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>
                <FavouritesProvider>
                  <Header />

                  {children}
                  <PreFooterCTA />
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

import { Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MainProvider } from "@/Contexts/mainContext";
import "@/styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
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
        url: "/full-logo.jpg",
        width: 1000,
        height: 1000,
        alt: "Masr360-logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/full-logo.jpg",
    shortcut: "/full-logo.jpg",
    apple: "/full-logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <MainProvider>
          <Header />
          {children}
          <Footer />
        </MainProvider>
      </body>
    </html>
  );
}

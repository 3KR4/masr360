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
  title: "Your App Name",
  description: "App description here",
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
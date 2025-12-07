import { Roboto } from "next/font/google";
import SideNav from "@/components/dashboard/SideNav";
import { MainProvider } from "@/Contexts/mainContext";
import { DashBoardProvider } from "@/Contexts/dashboard";
import "@/styles/globals.css";
import "@/styles/dashboard/globals.css";
import Navigations from "@/components/Navigations";
import Head from "@/components/dashboard/Head";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Masr360 DashBoard",
  description: "",

  openGraph: {
    title: "Masr360 DashBoard",
    description: "",
    url: "https://masr360.vercel.app/dashboard",
    siteName: "Masr360 DashBoard",
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
          <DashBoardProvider>
            <div className="dashboard">
              <SideNav />

              <div className="dash-holder">
                <Head />
                {children}
              </div>
            </div>
          </DashBoardProvider>
        </MainProvider>
      </body>
    </html>
  );
}

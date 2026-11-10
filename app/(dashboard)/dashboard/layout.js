import { fontVariables } from "@/app/fonts";
import SideNav from "@/components/dashboard/SideNav";
import { MainProvider } from "@/Contexts/mainContext";
import { DashBoardProvider } from "@/Contexts/dashboard";
import "@/styles/globals.css";
import "@/styles/components/brand.css";
import "@/styles/dashboard/globals.css";
import Head from "@/components/dashboard/Head";
import Toolbar from "@/components/dashboard/Toolbar";
import { FormsCompsProvider } from "@/Contexts/forms";
import { NotificationProvider } from "@/Contexts/NotificationContext";
import { AuthProvider } from "@/Contexts/AuthContext";
import AdminGuard from "@/components/dashboard/AdminGuard";
  import NotificationHolder from "@/components/settings/NotificationHolder";

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
    icon: "/brand/favicon-32.png",
    shortcut: "/brand/favicon-32.png",
    apple: "/brand/favicon-180.png",
  },
};
export default function RootLayout({ children }) {

  return (
    <html lang="EN" className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,t=localStorage.getItem("theme")||"dark",l=localStorage.getItem("locale")||"EN";d.setAttribute("data-theme",t);d.setAttribute("lang",l);d.setAttribute("dir",l==="AR"?"rtl":"ltr")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <MainProvider>
          <NotificationProvider>
            <AuthProvider>
            <DashBoardProvider>
              <FormsCompsProvider>
                <AdminGuard>
                <div className="dashboard">
                  <SideNav />

                  <div className="dash-holder">
                    <Head />
                    <Toolbar />
                    {children}
                  </div>
                </div>
                </AdminGuard>
                <NotificationHolder />
              </FormsCompsProvider>
            </DashBoardProvider>
            </AuthProvider>
          </NotificationProvider>
        </MainProvider>
      </body>
    </html>
  );
}

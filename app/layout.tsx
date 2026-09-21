import type { Metadata } from "next";
import { Baloo_Tamma_2, Noto_Sans_Display } from "next/font/google";
import "./globals.css";

import Header from "@/app/components/header/index";
import SubFooter from "@/app/components/subfooter";
import Footer from "@/app/components/footer";


const noto = Noto_Sans_Display({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const baloo = Baloo_Tamma_2({
  variable: "--font-baloo-tamma",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raider Robotics",
  description: "Milwaukee School of Engineering's Competitive VexU Robotics Team.",
  icons: {
    icon: "/branding/favico.ico"
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
        <html lang="en" className={`${noto.variable} ${baloo.variable}`}>
            <body>
                <Header />
                {children}
                <SubFooter/>
                <Footer/>
            </body>
        </html>
  );
}

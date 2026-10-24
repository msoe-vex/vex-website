import type { Metadata } from "next";
import { Baloo_Tamma_2, Noto_Sans_Display } from "next/font/google";
import "./globals.css";

import MeetingBanner from "@/app/components/MeetingBanner";
import Header from "@/app/components/header/index";
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
  title: "Raider Robotics | MSOE Vex U",
  description: "Milwaukee School of Engineering's Competitive Vex U Robotics Team.",
  icons: {
    icon: "/branding/favico.ico"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${noto.variable} ${baloo.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-sans selection:bg-[#c5050c] selection:text-white">
        {/* Meeting Banner scrolls with document, above navbar */}
        <MeetingBanner />

        {/* Navigation Bar */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* Unified Bottom Bar */}
        <Footer />
      </body>
    </html>
  );
}

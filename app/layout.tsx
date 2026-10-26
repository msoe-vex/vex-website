import type { Metadata } from "next";
import { Baloo_Tamma_2, Noto_Sans_Display } from "next/font/google";
import "./globals.css";

import MeetingBanner from "@/app/components/MeetingBanner";
import Header from "@/app/components/header/index";
import Footer from "@/app/components/footer";
import siteConfig, { getOrganizationSchema } from "@/app/data/seo";

const noto = Noto_Sans_Display({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const baloo = Baloo_Tamma_2({
  variable: "--font-baloo-tamma",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Raider Robotics | MSOE VEX U",
    template: "%s | Raider Robotics"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Raider Robotics | MSOE VEX U",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Raider Robotics - MSOE VEX U"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Raider Robotics | MSOE VEX U",
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: "/branding/favico.ico"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getOrganizationSchema();

  return (
    <html lang="en" className={`${noto.variable} ${baloo.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-sans selection:bg-[#c5050c] selection:text-white">
        {/* Document Top Anchor */}
        <div id="top" className="absolute top-0 left-0 w-full h-0 pointer-events-none" />

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

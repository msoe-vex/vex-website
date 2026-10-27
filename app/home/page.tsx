"use client";

import { useState } from "react";
import HeaderBackground, { set_mouse_position } from "./components/HeaderBackground";
import "./local.css";
import RandomFeature from "../util/featured_images";
import MissionStatement from "./components/MissionStatement";
import DonorScroller from "./components/DonorScroller";
import ProjectShowcase from "./components/ProjectShowcase";
import MemberPreview from "./components/MemberPreview";
import SubFooter from "../components/subfooter";
import Image from "next/image";

export default function Home() {
    const [isLogoAnimating, setIsLogoAnimating] = useState(false);

    const handleLogoClick = () => {
        setIsLogoAnimating(true);
        setTimeout(() => setIsLogoAnimating(false), 650);
    };

    return (
        <main className="w-full bg-[#0d0d0d] text-white">
            {/* HERO FEATURE SECTION */}
            <section onMouseMove={set_mouse_position} className="main-header-div relative overflow-hidden">
                {/* Background cycling images */}
                <RandomFeature id="header-images" className="absolute inset-0 z-0" />

                {/* Binary tree canvas animation overlay */}
                <HeaderBackground id="header-background" classes="w-full h-full absolute inset-0 z-10 pointer-events-none" />

                {/* Hero Foreground Content: Interactive Hover Logo + Angled Mission Box */}
                <div className="relative z-20 flex flex-col items-center justify-between min-h-[560px] sm:min-h-[660px] lg:min-h-[740px] pt-8 pb-10 px-4">
                    {/* Centered Logo with hover red transition and dynamic click pulse */}
                    <div
                        onClick={handleLogoClick}
                        className={`relative group cursor-pointer select-none w-72 sm:w-96 md:w-[440px] h-28 sm:h-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] transition-transform duration-200 active:scale-95 ${
                            isLogoAnimating ? "hero-logo-clicked" : ""
                        }`}
                        title="Click to pulse!"
                    >
                        <Image
                            src="/branding/RR_Logo_White.png"
                            alt="Raider Robotics"
                            fill
                            priority
                            loading="eager"
                            sizes="(max-width: 640px) 288px, (max-width: 768px) 384px, 440px"
                            className="transition-opacity duration-300 group-hover:opacity-0"
                            style={{ objectFit: "contain" }}
                        />
                        <Image
                            src="/branding/RR_Logo.png"
                            alt="Raider Robotics"
                            fill
                            loading="eager"
                            sizes="(max-width: 640px) 288px, (max-width: 768px) 384px, 440px"
                            className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                            style={{ objectFit: "contain" }}
                        />
                    </div>

                    {/* Mission statement overlaid directly within the hero */}
                    <MissionStatement />
                </div>
            </section>

            {/* DONOR SCROLLER */}
            <DonorScroller />

            {/* PROJECTS & ROBOTS SHOWCASE */}
            <ProjectShowcase />

            {/* MEMBER PREVIEW (3 Random Active Eboard Members) */}
            <MemberPreview />

            {/* CONTACT US SECTION */}
            <SubFooter />
        </main>
    );
}

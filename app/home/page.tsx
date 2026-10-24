"use client";

import HeaderBackground, { set_mouse_position } from "./components/HeaderBackground";
import "./local.css";
import RandomFeature from "../util/featured_images";
import MissionStatement from "./components/MissionStatement";
import SponsorScroller from "./components/SponsorScroller";
import ProjectShowcase from "./components/ProjectShowcase";
import MemberPreview from "./components/MemberPreview";
import SubFooter from "../components/subfooter";
import Image from "next/image";

export default function Home() {
    return (
        <main className="w-full bg-[#0d0d0d] text-white">
            {/* HERO FEATURE SECTION */}
            <section onMouseMove={set_mouse_position} className="main-header-div relative overflow-hidden">
                {/* Background cycling images */}
                <RandomFeature id="header-images" className="absolute inset-0 z-0" />

                {/* Binary tree canvas animation overlay */}
                <HeaderBackground id="header-background" classes="w-full h-full absolute inset-0 z-10 pointer-events-none" />

                {/* Hero Foreground Content: Interactive Hover Logo + Angled Mission Box */}
                <div className="relative z-20 flex flex-col items-center justify-between min-h-[740px] pt-8 pb-10 px-4">
                    {/* Centered Logo with hover red transition */}
                    <div className="relative group cursor-pointer w-72 sm:w-96 md:w-[440px] h-28 sm:h-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
                        <Image
                            src="/branding/RR_Logo_White.png"
                            alt="Raider Robotics"
                            fill
                            priority
                            className="transition-opacity duration-300 group-hover:opacity-0"
                            style={{ objectFit: "contain" }}
                        />
                        <Image
                            src="/branding/RR_Logo.png"
                            alt="Raider Robotics"
                            fill
                            className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                            style={{ objectFit: "contain" }}
                        />
                    </div>

                    {/* Mission statement overlaid directly within the hero */}
                    <MissionStatement />
                </div>
            </section>

            {/* VERTICAL SPONSOR SCROLLER */}
            <SponsorScroller />

            {/* PROJECTS & ROBOTS SHOWCASE */}
            <ProjectShowcase />

            {/* MEMBER PREVIEW (3 Random Active Eboard Members) */}
            <MemberPreview />

            {/* CONTACT US SECTION */}
            <SubFooter />
        </main>
    );
}

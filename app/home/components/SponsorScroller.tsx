"use client";

import Image from "next/image";
import sponsors, { Sponsor } from "@/app/data/sponsors";
import locales from "@/app/data/locales";
import "./sponsors.css";

export default function SponsorScroller() {
    const loopedSponsors: Sponsor[] = [...sponsors, ...sponsors];

    return (
        <section id="sponsors" className="py-8 px-4 bg-[#0d0d0f] text-white overflow-hidden border-t border-b border-[#1f1f23]">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#2b2b2b] pb-3 gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="section-diamond" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                {locales.sponsors.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                            {locales.sponsors.sectionTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="hidden lg:block text-gray-400 text-xs max-w-sm">
                            {locales.sponsors.description}
                        </p>
                        <a
                            href={`mailto:${locales.contact.emailAddress}?subject=${encodeURIComponent(locales.sponsors.sponsorSubject)}`}
                            className="inline-flex items-center px-4 py-1.5 bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-wider transition-colors clip-angle-action"
                        >
                            {locales.sponsors.ctaButton}
                        </a>
                    </div>
                </div>

                {/* Horizontal Marquee Scroller Viewport */}
                <div className="w-full">
                    <div className="sponsor-marquee-viewport relative w-full overflow-hidden border-2 border-[#2b2b2b] bg-[#161619] shadow-2xl py-4 px-2">
                        {/* Left & Right gradient fades */}
                        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#161619] to-transparent z-10" />
                        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#161619] to-transparent z-10" />

                        {/* Horizontal scrolling track */}
                        <div className="sponsor-track-horizontal flex items-center gap-4">
                            {loopedSponsors.map((sponsor, index) => (
                                <a
                                    key={`${sponsor.alt}-${index}`}
                                    href={sponsor.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sponsor-card group flex items-center justify-between gap-4 p-3 bg-[#1e1e22] hover:bg-[#28282e] border-l-4 border-transparent hover:border-[#c5050c] transition-all duration-200 flex-shrink-0 min-w-[220px]"
                                    style={{
                                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-16 h-10 flex-shrink-0 bg-white/95 p-1 rounded-sm flex items-center justify-center">
                                            <Image
                                                src={`/sponsors/${sponsor.img}`}
                                                alt={sponsor.alt}
                                                width={70}
                                                height={38}
                                                style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
                                            />
                                        </div>
                                        <span className="font-semibold text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors whitespace-nowrap">
                                            {sponsor.alt}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#c5050c] group-hover:translate-x-0.5 transition-transform font-bold">
                                        ↗
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

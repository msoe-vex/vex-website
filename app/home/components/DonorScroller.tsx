"use client";

import Image from "next/image";
import donors, { Donor } from "@/app/data/donors";
import locales from "@/app/data/locales";
import "./donors.css";

export default function DonorScroller() {
    const loopedDonors: Donor[] = [...donors, ...donors];

    return (
        <section id="donors" className="py-8 px-4 bg-[#0d0d0f] text-white overflow-hidden border-t border-b border-[#1f1f23]">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#2b2b2b] pb-3 gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="section-diamond" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                {locales.donors.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                            {locales.donors.sectionTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="hidden lg:block text-gray-400 text-xs max-w-sm">
                            {locales.donors.description}
                        </p>
                        <a
                            href={`mailto:${locales.contact.emailAddress}?subject=${encodeURIComponent(locales.donors.donorSubject)}`}
                            className="inline-flex items-center px-4 py-1.5 bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-wider transition-colors clip-chamfer-btn"
                        >
                            {locales.donors.ctaButton}
                        </a>
                    </div>
                </div>

                {/* Horizontal Marquee Scroller Viewport */}
                <div className="w-full">
                    <div className="donor-marquee-viewport relative w-full overflow-hidden border-2 border-[#2b2b2b] bg-[#161619] shadow-2xl py-4 px-2">
                        {/* Left & Right gradient fades */}
                        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#161619] to-transparent z-10" />
                        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#161619] to-transparent z-10" />

                        {/* Horizontal scrolling track */}
                        <div className="donor-track-horizontal flex items-center gap-4">
                            {loopedDonors.map((donor, index) => (
                                <a
                                    key={`${donor.alt}-${index}`}
                                    href={donor.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="donor-card group flex items-center justify-between gap-4 p-3 bg-[#1e1e22] hover:bg-[#28282e] border-l-4 border-transparent hover:border-[#c5050c] transition-all duration-200 flex-shrink-0 min-w-[220px] clip-chamfer-btn"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-16 h-10 flex-shrink-0 bg-white/95 p-1 rounded-sm flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={`/donors/${donor.img}`}
                                                alt={donor.alt}
                                                fill
                                                sizes="64px"
                                                style={{ objectFit: "contain", padding: "2px" }}
                                            />
                                        </div>
                                        <span className="font-semibold text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors whitespace-nowrap">
                                            {donor.alt}
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

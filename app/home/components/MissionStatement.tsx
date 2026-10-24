"use client";

import locales from "@/app/data/locales";
import "./mission.css";

export default function MissionStatement() {
    return (
        <div id="mission" className="mission-container relative w-full flex justify-center px-4 py-3 pointer-events-auto">
            <div className="mission-card max-w-4xl w-full bg-white text-black p-5 md:p-6 shadow-2xl relative border-l-8 border-[#c5050c]">
                <div className="flex flex-col gap-2.5">
                    {/* Header with vertically aligned diamond icon */}
                    <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 bg-[#c5050c] rotate-45 flex-shrink-0" />
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-[#111111] leading-none m-0">
                            {locales.mission.title}
                        </h2>
                    </div>

                    <p className="text-xs md:text-sm font-medium text-gray-800 leading-relaxed m-0">
                        {locales.mission.statement}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 border-t-2 border-gray-200">
                        {locales.mission.pillars.map((pillar) => (
                            <div key={pillar.number} className="flex flex-col">
                                <span className="font-extrabold text-[#c5050c] text-base md:text-lg">
                                    {pillar.number} {'\\\\'} {pillar.label}
                                </span>
                                <span className="text-[11px] text-gray-600 mt-0.5">
                                    {pillar.description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

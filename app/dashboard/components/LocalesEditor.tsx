"use client";

import { useState } from "react";
import { locales as defaultLocales } from "@/app/data/locales";

type LocalesType = typeof defaultLocales;

interface LocalesEditorProps {
    locales: LocalesType;
    onChange: (updated: LocalesType) => void;
}

export default function LocalesEditor({ locales, onChange }: LocalesEditorProps) {
    const [activeSection, setActiveSection] = useState<"mission" | "branding" | "sections">("mission");

    const updateNested = (path: string[], value: unknown) => {
        // deep clone
        const clone = JSON.parse(JSON.stringify(locales));
        let cur = clone;
        for (let i = 0; i < path.length - 1; i++) {
            cur = cur[path[i]];
        }
        cur[path[path.length - 1]] = value;
        onChange(clone);
    };

    return (
        <div className="bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-4">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-white">
                        Website Copy & Content Texts
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Customize mission statement, pillars, hero branding, and page descriptions.
                    </p>
                </div>

                <div className="flex gap-2">
                    {(["mission", "branding", "sections"] as const).map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                                activeSection === sec
                                    ? "bg-[#c5050c] text-white"
                                    : "bg-[#202022] text-gray-400 hover:text-white"
                            }`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
            </div>

            {activeSection === "mission" && (
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Mission Section Title
                        </label>
                        <input
                            type="text"
                            value={locales.mission.title}
                            onChange={(e) => updateNested(["mission", "title"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Mission Statement Paragraph
                        </label>
                        <textarea
                            rows={4}
                            value={locales.mission.statement}
                            onChange={(e) => updateNested(["mission", "statement"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                            The Three Engineering Pillars
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {locales.mission.pillars.map((pillar, idx) => (
                                <div key={idx} className="bg-[#1a1a1d] border border-[#2e2e32] p-4 flex flex-col gap-2">
                                    <span className="text-xs font-mono font-bold text-[#c5050c]">
                                        Pillar #{pillar.number}
                                    </span>
                                    <input
                                        type="text"
                                        value={pillar.label}
                                        onChange={(e) => {
                                            const nextPillars = [...locales.mission.pillars];
                                            nextPillars[idx] = { ...pillar, label: e.target.value };
                                            updateNested(["mission", "pillars"], nextPillars);
                                        }}
                                        className="bg-[#242428] border border-[#333] px-2 py-1 text-xs text-white font-bold"
                                    />
                                    <textarea
                                        rows={3}
                                        value={pillar.description}
                                        onChange={(e) => {
                                            const nextPillars = [...locales.mission.pillars];
                                            nextPillars[idx] = { ...pillar, description: e.target.value };
                                            updateNested(["mission", "pillars"], nextPillars);
                                        }}
                                        className="bg-[#242428] border border-[#333] px-2 py-1 text-xs text-gray-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeSection === "branding" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={locales.branding.teamName}
                            onChange={(e) => updateNested(["branding", "teamName"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Institution Name
                        </label>
                        <input
                            type="text"
                            value={locales.branding.institution}
                            onChange={(e) => updateNested(["branding", "institution"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Tagline
                        </label>
                        <input
                            type="text"
                            value={locales.branding.tagline}
                            onChange={(e) => updateNested(["branding", "tagline"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>
                </div>
            )}

            {activeSection === "sections" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Projects Page Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.projects.pageDescription}
                            onChange={(e) => updateNested(["projects", "pageDescription"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Members Page Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.members.pageDescription}
                            onChange={(e) => updateNested(["members", "pageDescription"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Sponsors Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.sponsors.longDescription}
                            onChange={(e) => updateNested(["sponsors", "longDescription"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                            Contact Section Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.contact.description}
                            onChange={(e) => updateNested(["contact", "description"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

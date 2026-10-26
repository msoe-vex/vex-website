"use client";

import { useState } from "react";
import { locales as defaultLocales } from "@/app/data/locales";

type LocalesType = typeof defaultLocales;

interface LocalesEditorProps {
    locales: LocalesType;
    onChange: (updated: LocalesType) => void;
}

export default function LocalesEditor({ locales, onChange }: LocalesEditorProps) {
    const [activeSection, setActiveSection] = useState<"contact" | "mission" | "branding" | "sections" | "footer">("contact");

    const updateNested = (path: string[], value: unknown) => {
        // Deep clone
        const clone = JSON.parse(JSON.stringify(locales));
        let cur = clone;
        for (let i = 0; i < path.length - 1; i++) {
            cur = cur[path[i]];
        }
        cur[path[path.length - 1]] = value;
        onChange(clone);
    };

    return (
        <div className="dash-editor-card flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2b2b2b] pb-4 gap-4">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-white">
                        Website Copy & Social Settings
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Customize Discord, email, GitHub links, mission pillars, hero branding, and footer copy.
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {[
                        { id: "contact", label: "Social & Contact" },
                        { id: "mission", label: "Mission & Pillars" },
                        { id: "branding", label: "Branding" },
                        { id: "sections", label: "Page Copy" },
                        { id: "footer", label: "Footer & Legal" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as typeof activeSection)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                                activeSection === tab.id
                                    ? "bg-[#c5050c] text-white"
                                    : "bg-[#202022] text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 1. SOCIAL & CONTACT */}
            {activeSection === "contact" && (
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="dash-label">
                                Section Heading
                            </label>
                            <input
                                type="text"
                                value={locales.contact.heading}
                                onChange={(e) => updateNested(["contact", "heading"], e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div>
                            <label className="dash-label">
                                Section Subtitle
                            </label>
                            <input
                                type="text"
                                value={locales.contact.sectionSubtitle}
                                onChange={(e) => updateNested(["contact", "sectionSubtitle"], e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="dash-label">
                                Section Description
                            </label>
                            <textarea
                                rows={2}
                                value={locales.contact.description}
                                onChange={(e) => updateNested(["contact", "description"], e.target.value)}
                                className="dash-input"
                            />
                        </div>
                    </div>

                    <div className="border-t border-[#26262a] pt-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#c5050c] block mb-3">
                            Direct Social & Communication Channels
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Discord */}
                            <div className="bg-[#1c1c20] border border-[#2e2e34] p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2]" />
                                    <span className="text-xs font-bold uppercase text-white">Discord</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Invite Link
                                    </label>
                                    <input
                                        type="url"
                                        value={locales.contact.discordUrl}
                                        onChange={(e) => updateNested(["contact", "discordUrl"], e.target.value)}
                                        className="dash-input font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={locales.contact.discordButton}
                                        onChange={(e) => updateNested(["contact", "discordButton"], e.target.value)}
                                        className="dash-input"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-[#1c1c20] border border-[#2e2e34] p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#c5050c]" />
                                    <span className="text-xs font-bold uppercase text-white">Email Contact</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={locales.contact.emailAddress}
                                        onChange={(e) => updateNested(["contact", "emailAddress"], e.target.value)}
                                        className="dash-input font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={locales.contact.emailButton}
                                        onChange={(e) => updateNested(["contact", "emailButton"], e.target.value)}
                                        className="dash-input"
                                    />
                                </div>
                            </div>

                            {/* GitHub */}
                            <div className="bg-[#1c1c20] border border-[#2e2e34] p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                                    <span className="text-xs font-bold uppercase text-white">GitHub Page</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Organization URL
                                    </label>
                                    <input
                                        type="url"
                                        value={locales.contact.githubUrl}
                                        onChange={(e) => updateNested(["contact", "githubUrl"], e.target.value)}
                                        className="dash-input font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={locales.contact.githubButton}
                                        onChange={(e) => updateNested(["contact", "githubButton"], e.target.value)}
                                        className="dash-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#26262a] pt-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#c5050c] block mb-1">
                            Sponsorship Call-To-Action (Sponsors Section)
                        </span>
                        <p className="text-[11px] text-gray-400 mb-3">
                            Configures the sponsor inquiry email button shown on the homepage sponsors scroller. It automatically addresses inquiries to your configured email above.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="dash-label">
                                    Sponsor Button Label
                                </label>
                                <input
                                    type="text"
                                    value={locales.sponsors.ctaButton}
                                    onChange={(e) => updateNested(["sponsors", "ctaButton"], e.target.value)}
                                    placeholder="Become a Sponsor →"
                                    className="dash-input"
                                />
                            </div>

                            <div>
                                <label className="dash-label">
                                    Sponsorship Email Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={locales.sponsors.sponsorSubject}
                                    onChange={(e) => updateNested(["sponsors", "sponsorSubject"], e.target.value)}
                                    placeholder="Sponsorship Inquiry"
                                    className="dash-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MISSION & PILLARS */}
            {activeSection === "mission" && (
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="dash-label">
                            Mission Section Title
                        </label>
                        <input
                            type="text"
                            value={locales.mission.title}
                            onChange={(e) => updateNested(["mission", "title"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Mission Statement Paragraph
                        </label>
                        <textarea
                            rows={4}
                            value={locales.mission.statement}
                            onChange={(e) => updateNested(["mission", "statement"], e.target.value)}
                            className="dash-input"
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

            {/* 3. BRANDING */}
            {activeSection === "branding" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="dash-label">
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={locales.branding.teamName}
                            onChange={(e) => updateNested(["branding", "teamName"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Short Name
                        </label>
                        <input
                            type="text"
                            value={locales.branding.shortName}
                            onChange={(e) => updateNested(["branding", "shortName"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Institution Name
                        </label>
                        <input
                            type="text"
                            value={locales.branding.institution}
                            onChange={(e) => updateNested(["branding", "institution"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Institution Abbreviation
                        </label>
                        <input
                            type="text"
                            value={locales.branding.institutionAbbr}
                            onChange={(e) => updateNested(["branding", "institutionAbbr"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            Tagline
                        </label>
                        <input
                            type="text"
                            value={locales.branding.tagline}
                            onChange={(e) => updateNested(["branding", "tagline"], e.target.value)}
                            className="dash-input"
                        />
                    </div>
                </div>
            )}

            {/* 4. PAGE COPY */}
            {activeSection === "sections" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="dash-label">
                            Projects Page Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.projects.pageDescription}
                            onChange={(e) => updateNested(["projects", "pageDescription"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Members Page Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.members.pageDescription}
                            onChange={(e) => updateNested(["members", "pageDescription"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Sponsors Section Subtitle
                        </label>
                        <input
                            type="text"
                            value={locales.sponsors.sectionSubtitle}
                            onChange={(e) => updateNested(["sponsors", "sectionSubtitle"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Sponsors Section Title
                        </label>
                        <input
                            type="text"
                            value={locales.sponsors.sectionTitle}
                            onChange={(e) => updateNested(["sponsors", "sectionTitle"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            Sponsors Section Description (Homepage)
                        </label>
                        <textarea
                            rows={2}
                            value={locales.sponsors.description}
                            onChange={(e) => updateNested(["sponsors", "description"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            Sponsors Long Description
                        </label>
                        <textarea
                            rows={3}
                            value={locales.sponsors.longDescription}
                            onChange={(e) => updateNested(["sponsors", "longDescription"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Events Page Title
                        </label>
                        <input
                            type="text"
                            value={locales.events.pageTitle}
                            onChange={(e) => updateNested(["events", "pageTitle"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            Events Empty State Text
                        </label>
                        <input
                            type="text"
                            value={locales.events.emptyEventsText}
                            onChange={(e) => updateNested(["events", "emptyEventsText"], e.target.value)}
                            className="dash-input"
                        />
                    </div>
                </div>
            )}

            {/* 5. FOOTER & LEGAL */}
            {activeSection === "footer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="dash-label">
                            Raider Robotics Copyright Notice
                        </label>
                        <input
                            type="text"
                            value={locales.footer.raiderCopyright}
                            onChange={(e) => updateNested(["footer", "raiderCopyright"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Institution Copyright Notice
                        </label>
                        <input
                            type="text"
                            value={locales.footer.msoeCopyright}
                            onChange={(e) => updateNested(["footer", "msoeCopyright"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            VEX Trademark Disclaimer
                        </label>
                        <input
                            type="text"
                            value={locales.footer.vexDisclaimer}
                            onChange={(e) => updateNested(["footer", "vexDisclaimer"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Site Creator Name
                        </label>
                        <input
                            type="text"
                            value={locales.footer.creatorName}
                            onChange={(e) => updateNested(["footer", "creatorName"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div>
                        <label className="dash-label">
                            Creator Handle (e.g. @Akiisqt)
                        </label>
                        <input
                            type="text"
                            value={locales.footer.creatorHandle}
                            onChange={(e) => updateNested(["footer", "creatorHandle"], e.target.value)}
                            className="dash-input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="dash-label">
                            Creator Portfolio / GitHub URL
                        </label>
                        <input
                            type="url"
                            value={locales.footer.creatorUrl}
                            onChange={(e) => updateNested(["footer", "creatorUrl"], e.target.value)}
                            className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white font-mono"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useSyncExternalStore } from "react";
import members, { Member } from "@/app/data/members";
import locales from "@/app/data/locales";
import Image from "next/image";
import Link from "next/link";

function getActiveEboard(): Member[] {
    return members.filter((m) => m.subsystems.includes("Eboard") && m.status === "active");
}

const initialEboard = getActiveEboard().slice(0, 3);
let clientShuffledEboard: Member[] | null = null;

function subscribe() {
    return () => {};
}

function getClientSnapshot(): Member[] {
    if (!clientShuffledEboard) {
        const active = getActiveEboard();
        clientShuffledEboard = [...active].sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    return clientShuffledEboard;
}

function getServerSnapshot(): Member[] {
    return initialEboard;
}

/**
 * Renders a preview section on the home page highlighting 3 active Eboard members.
 * Uses useSyncExternalStore to guarantee SSR hydration parity while cleanly shuffling on the client.
 */
export default function MemberPreview() {
    const eboardList = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot
    );

    if (eboardList.length === 0) return null;

    return (
        <section id="members-preview" className="py-8 px-4 bg-[#0d0d0d] text-white border-t border-[#1f1f23]">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#2b2b2b] pb-3 gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="section-diamond" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                {locales.members.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                            {locales.members.previewTitle}
                        </h2>
                    </div>
                    <Link
                        href="/members"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c5050c] hover:text-white uppercase tracking-wider transition-colors"
                    >
                        {locales.members.previewCta}
                    </Link>
                </div>

                {/* 3 Eboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {eboardList.map((member) => (
                        <div
                            key={member.id}
                            className="chamfer-card-outer group hover:z-20 h-full"
                        >
                            <Link
                                href={`/members#select#${member.id}`}
                                className="chamfer-card-inner bg-[#161619] flex flex-col justify-between overflow-hidden cursor-pointer h-full"
                            >
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {member.subsystems.map((sub) => (
                                                <span
                                                    key={sub}
                                                    className="px-2 py-0.5 bg-[#252525] text-[#c5050c] font-bold text-[10px] uppercase tracking-wider border border-[#333333]"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            Class of {member.gradYear}
                                        </span>
                                    </div>

                                    {/* Main Row: Big Square Image on left, Name/Major/Contributions on right */}
                                    <div className="flex items-start gap-4">
                                        {member.image && (
                                            <div className="chamfer-thumb-outer w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                                                <div className="chamfer-thumb-inner bg-[#222226]">
                                                    <Image
                                                        src={member.image || "/branding/RR_Icon.png"}
                                                        alt={member.name}
                                                        fill
                                                        priority
                                                        loading="eager"
                                                        sizes="(max-width: 640px) 80px, 96px"
                                                        style={{ objectFit: "cover", objectPosition: "center" }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#c5050c] transition-colors leading-tight">
                                                {member.name}
                                            </h3>
                                            <div className="text-xs text-[#c5050c] font-semibold mt-0.5">
                                                {member.role}
                                            </div>
                                            {member.major && (
                                                <p className="text-xs font-semibold text-gray-400 mt-1">
                                                    {member.major}
                                                </p>
                                            )}
                                            {member.contributions && (
                                                <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-3">
                                                    {member.contributions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Card Prompt with darker background and clear divide matching ProjectShowcase */}
                                <div className="p-3 bg-[#141416] border-t border-[#2b2b2b] flex items-center justify-between text-xs font-bold text-[#c5050c] group-hover:text-white uppercase tracking-wider">
                                    <span>{locales.members.cardCta}</span>
                                    <span>→</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

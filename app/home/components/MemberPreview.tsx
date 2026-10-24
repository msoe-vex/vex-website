"use client";

import { useSyncExternalStore } from "react";
import members, { Member } from "@/app/data/members";
import locales from "@/app/data/locales";
import Image from "next/image";
import Link from "next/link";

function getActiveEboard(): Member[] {
    return members.filter((m) => m.subsystem === "Eboard" && m.status === "active");
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
        <section id="members-preview" className="py-8 px-4 bg-[#0d0d0f] text-white border-t border-[#1f1f23]">
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
                                className="chamfer-card-inner bg-[#161619] p-5 flex flex-col justify-between gap-3 cursor-pointer h-full"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 bg-[#252525] text-[#c5050c] font-bold text-[10px] uppercase tracking-wider border border-[#333333]">
                                            {member.role}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            Class of {member.gradYear}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {member.image && (
                                            <div
                                                className="relative w-12 h-12 flex-shrink-0 bg-[#222226] border border-[#333338] p-1 overflow-hidden"
                                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                                            >
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    sizes="48px"
                                                    style={{ objectFit: "contain" }}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-[#c5050c] transition-colors leading-snug">
                                                {member.name}
                                            </h3>
                                            {member.major && (
                                                <p className="text-xs font-semibold text-gray-400">
                                                    {member.major}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {member.contributions && (
                                        <p className="text-xs text-gray-400 leading-relaxed border-t border-[#26262b] pt-2 line-clamp-2">
                                            {member.contributions}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-[#222226] flex items-center justify-between text-xs font-bold text-[#c5050c] group-hover:text-white uppercase tracking-wider">
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

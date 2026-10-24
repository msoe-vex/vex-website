"use client";

import { useEffect, useState } from "react";
import members, { Member, SubsystemRole, MemberStatus } from "@/app/data/members";
import Image from "next/image";

const subsystems: (SubsystemRole | "All")[] = ["All", "Controls", "Design", "Eboard"];

export default function MembersPage() {
    const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemRole | "All">("All");
    const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash.startsWith("#select#")) {
                const targetId = hash.replace("#select#", "");
                setHighlightedId(targetId);
                const targetMember = members.find((m) => m.id === targetId);
                if (targetMember) {
                    setSelectedSubsystem("All");
                    setStatusFilter("all");
                }
                setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }, 100);
            }
        };

        handleHash();
        window.addEventListener("hashchange", handleHash);
        return () => window.removeEventListener("hashchange", handleHash);
    }, []);

    const filteredMembers = members.filter((member) => {
        const matchesSubsystem = selectedSubsystem === "All" || member.subsystem === selectedSubsystem;
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;
        return matchesSubsystem && matchesStatus;
    });

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                {/* Header */}
                <div className="border-b-2 border-[#2b2b2b] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 bg-[#c5050c] rotate-45" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                Roster & Leadership
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                            Meet The Team
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm max-w-md">
                        The multidisciplinary engineers, developers, and builders shaping Raider Robotics across Controls, Design, and Executive Board.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141416] p-4 border border-[#26262b]">
                    {/* Subsystem tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                            Subsystem:
                        </span>
                        {subsystems.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubsystem(sub)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                                    selectedSubsystem === sub
                                        ? "bg-[#c5050c] text-white shadow-md"
                                        : "bg-[#222222] text-gray-300 hover:bg-[#333333] hover:text-white"
                                }`}
                                style={{
                                    /* Chamfer with negative slope y = -x on bottom-left */
                                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                                }}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    {/* Status tabs */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                            Status:
                        </span>
                        {(["all", "active", "alumni"] as const).map((stat) => (
                            <button
                                key={stat}
                                onClick={() => setStatusFilter(stat)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                                    statusFilter === stat
                                        ? "bg-white text-black font-extrabold shadow-md"
                                        : "bg-[#222222] text-gray-400 hover:text-white hover:bg-[#2c2c32]"
                                }`}
                                style={{
                                    /* Chamfer with negative slope y = -x on bottom-left */
                                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
                                }}
                            >
                                {stat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member: Member) => {
                        const isSelected = highlightedId === member.id;

                        return (
                            <div
                                id={member.id}
                                key={member.id}
                                className={`bg-[#161616] border transition-all duration-500 p-6 flex flex-col justify-between gap-4 group ${
                                    isSelected
                                        ? "border-[#c5050c] ring-2 ring-[#c5050c] shadow-[0_0_25px_rgba(197,5,12,0.6)] scale-[1.02]"
                                        : "border-[#2b2b2b] hover:border-[#c5050c]"
                                }`}
                                style={{
                                    /* Chamfer with negative slope y = -x on bottom-left */
                                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
                                }}
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 bg-[#252525] text-[#c5050c] font-bold text-[11px] uppercase tracking-wider border border-[#333333]">
                                            {member.subsystem}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {isSelected && (
                                                <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider animate-bounce">
                                                    Selected
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 font-mono">
                                                {member.status === "alumni" ? `Alumni (${member.gradYear})` : `Class of ${member.gradYear}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {member.image && (
                                            <div className="relative w-14 h-14 flex-shrink-0 bg-[#222226] border border-[#333338] p-1 overflow-hidden"
                                                 style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    style={{ objectFit: "contain" }}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-xl font-bold text-white group-hover:text-[#f87171] transition-colors leading-snug">
                                                {member.name}
                                            </h2>
                                            <p className="text-xs font-semibold text-gray-300">
                                                {member.role} {member.major && `• ${member.major}`}
                                            </p>
                                        </div>
                                    </div>

                                    {member.contributions && (
                                        <p className="text-xs text-gray-400 leading-relaxed border-t border-[#26262b] pt-3">
                                            {member.contributions}
                                        </p>
                                    )}
                                </div>

                                {member.github && (
                                    <div className="border-t border-[#222222] pt-3 flex justify-end">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-[#c5050c] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                                        >
                                            GitHub Profile ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-16 text-gray-500 text-sm">
                        No team members found matching the selected filter criteria.
                    </div>
                )}
            </div>
        </main>
    );
}

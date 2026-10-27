"use client";

import { useState, useCallback } from "react";
import members, { Member, SubsystemRole, MemberStatus, SUBSYSTEM_ROLES } from "@/app/data/members";
import locales from "@/app/data/locales";
import { useHashSelection } from "@/app/util/useHashSelection";
import Image from "next/image";

export default function MembersPage() {
    const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemRole | "All">("All");
    const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");

    const onHashSelect = useCallback((targetId: string) => {
        const targetMember = members.find((m) => m.id === targetId);
        if (targetMember) {
            setSelectedSubsystem("All");
            setStatusFilter("all");
        }
    }, []);

    const highlightedId = useHashSelection(onHashSelect);

    const filteredMembers = members
        .filter((member) => {
            const matchesSubsystem =
                selectedSubsystem === "All" || member.subsystems.includes(selectedSubsystem);
            const matchesStatus = statusFilter === "all" || member.status === statusFilter;
            return matchesSubsystem && matchesStatus;
        })
        .sort((a, b) => {
            const aIsEboard = a.subsystems.includes("Eboard");
            const bIsEboard = b.subsystems.includes("Eboard");

            // Eboard members come first
            if (aIsEboard && !bIsEboard) return -1;
            if (!aIsEboard && bIsEboard) return 1;

            // Alphabetical by name within each group
            return a.name.localeCompare(b.name);
        });

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                {/* Header */}
                <div className="border-b-2 border-[#2b2b2b] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="section-diamond" />
                            <span className="section-eyebrow">
                                {locales.members.pageSubtitle}
                            </span>
                        </div>
                        <h1 className="section-title">
                            {locales.members.pageTitle}
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm max-w-md">
                        {locales.members.pageDescription}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141416] p-4 border border-[#26262b]">
                    {/* Subsystem tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                            {locales.members.filterSubsystemLabel}
                        </span>
                        {SUBSYSTEM_ROLES.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubsystem(sub)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all clip-chamfer-tag ${
                                    selectedSubsystem === sub
                                        ? "bg-[#c5050c] text-white shadow-md"
                                        : "bg-[#222222] text-gray-300 hover:bg-[#333333] hover:text-white"
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    {/* Status tabs */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                            {locales.members.filterStatusLabel}
                        </span>
                        {(["all", "active", "alumni"] as const).map((stat) => (
                            <button
                                key={stat}
                                onClick={() => setStatusFilter(stat)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all clip-chamfer-tag ${
                                    statusFilter === stat
                                        ? "bg-white text-black font-extrabold shadow-md"
                                        : "bg-[#222222] text-gray-400 hover:text-white hover:bg-[#2c2c32]"
                                }`}
                            >
                                {stat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {filteredMembers.length === 0 && (
                    <div className="text-center py-16 text-gray-400 border border-dashed border-[#333333] p-8">
                        {locales.members.emptyFilterText}
                    </div>
                )}

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member: Member, index: number) => {
                        const isSelected = highlightedId === member.id;

                        return (
                            <div
                                key={member.id}
                                className={`chamfer-card-outer group ${isSelected ? "selected" : ""}`}
                            >
                                <div
                                    id={member.id}
                                    className="chamfer-card-inner bg-[#161616] flex flex-col justify-between overflow-hidden h-full"
                                >
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {member.subsystems.map((sub) => (
                                                <span
                                                    key={sub}
                                                    className="subsystem-tag"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {isSelected && (
                                                <span className="badge-selected">
                                                    Selected
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400">
                                                {member.status === "alumni" ? `Alumni (${member.gradYear})` : `Class of ${member.gradYear}`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Row: Big Square Image on left, Name/Role/Major/Contributions on right */}
                                    <div className="flex items-start gap-4">
                                        {member.image && (
                                            <div className="chamfer-thumb-outer w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                                                <div className="chamfer-thumb-inner bg-[#222226]">
                                                    <Image
                                                        src={member.image || "/branding/RR_Icon.png"}
                                                        alt={member.name}
                                                        fill
                                                        priority={index < 3}
                                                        loading={index < 3 ? "eager" : "lazy"}
                                                        sizes="(max-width: 640px) 96px, 112px"
                                                        className="object-cover object-center"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#f87171] transition-colors leading-tight">
                                                {member.name}
                                            </h2>
                                            <div className="text-xs text-[#f87171] font-semibold mt-0.5">
                                                {member.role}
                                            </div>
                                            {member.major && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {member.major}
                                                </div>
                                            )}
                                            {member.contributions && (
                                                <p className="text-xs text-gray-300 leading-relaxed mt-2 line-clamp-3">
                                                    {member.contributions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Link Footer styled identically to project card CTAs (clear divide, dark tray) */}
                                {(member.github || member.linkedin) && (
                                    <div className="p-3 bg-[#141416] border-t border-[#2b2b2b] flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                                        {member.github && (
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#f87171] hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                <span>GitHub</span>
                                                <span>↗</span>
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#0A66C2] hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                <span>LinkedIn</span>
                                                <span>↗</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

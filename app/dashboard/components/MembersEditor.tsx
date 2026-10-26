"use client";

import { useState } from "react";
import Image from "next/image";
import type { Member, SubsystemRole, MemberStatus } from "@/app/data/members";
import { SUBSYSTEM_ROLES } from "@/app/data/members";
import ImageUploader, { PendingUpload } from "./ImageUploader";

interface MembersEditorProps {
    members: Member[];
    onChange: (updated: Member[], pendingUpload?: PendingUpload) => void;
}

export default function MembersEditor({ members, onChange }: MembersEditorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || "");
    const [filterStatus, setFilterStatus] = useState<"all" | MemberStatus>("all");

    const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

    const filteredMembers = members.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || m.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateField = <K extends keyof Member>(field: K, value: Member[K]) => {
        if (!currentMember) return;
        const updatedList = members.map((m) => (m.id === currentMember.id ? { ...m, [field]: value } : m));
        onChange(updatedList);
    };

    const handleSubsystemToggle = (sub: SubsystemRole) => {
        if (!currentMember) return;
        const exists = currentMember.subsystems.includes(sub);
        const newSubs = exists
            ? currentMember.subsystems.filter((s) => s !== sub)
            : [...currentMember.subsystems, sub];
        handleUpdateField("subsystems", newSubs);
    };

    const handleAddNewMember = () => {
        const newId = `member-${Date.now().toString().slice(-4)}`;
        const newMember: Member = {
            id: newId,
            name: "New Member",
            role: "Controls Member",
            subsystems: ["Controls"],
            status: "active",
            gradYear: 2028,
            major: "Computer Engineering",
            image: "/branding/RR_Icon.png",
            contributions: "",
        };
        const updatedList = [newMember, ...members];
        onChange(updatedList);
        setSelectedMemberId(newId);
    };

    const handleDeleteMember = (id: string) => {
        if (confirm(`Are you sure you want to delete this member?`)) {
            const updatedList = members.filter((m) => m.id !== id);
            onChange(updatedList);
            if (selectedMemberId === id) {
                setSelectedMemberId(updatedList[0]?.id || "");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Member Directory */}
            <div className="lg:col-span-4 bg-[#141416] border border-[#2b2b2b] p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                        Team Directory ({members.length})
                    </h2>
                    <button
                        onClick={handleAddNewMember}
                        className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        + Add Member
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5050c]"
                    />
                    <div className="flex gap-1">
                        {(["all", "active", "alumni"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                    filterStatus === status
                                        ? "bg-[#c5050c] text-white"
                                        : "bg-[#202022] text-gray-400 hover:text-white"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Member List */}
                <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-1">
                    {filteredMembers.map((m) => {
                        const isSelected = m.id === currentMember?.id;
                        return (
                            <div
                                key={m.id}
                                onClick={() => setSelectedMemberId(m.id)}
                                className={`p-2.5 text-left transition-all border cursor-pointer flex items-center justify-between ${
                                    isSelected
                                        ? "bg-[#222226] border-[#c5050c] text-white"
                                        : "bg-[#18181b] border-transparent hover:border-[#333333] text-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                                        <Image
                                            src={m.image || "/branding/RR_Icon.png"}
                                            alt={m.name}
                                            fill
                                            sizes="32px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate leading-tight">{m.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono uppercase bg-[#282828] px-1.5 py-0.5 text-gray-300 flex-shrink-0">
                                    {m.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Middle: Edit Form */}
            {currentMember && (
                <div className="lg:col-span-5 bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-3">
                        <div>
                            <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest">
                                Editing Member
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentMember.name}</h3>
                        </div>
                        <button
                            onClick={() => handleDeleteMember(currentMember.id)}
                            className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={currentMember.name}
                                onChange={(e) => handleUpdateField("name", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                ID Slug
                            </label>
                            <input
                                type="text"
                                value={currentMember.id}
                                onChange={(e) => handleUpdateField("id", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Team Role / Title
                            </label>
                            <input
                                type="text"
                                value={currentMember.role}
                                onChange={(e) => handleUpdateField("role", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Status
                            </label>
                            <select
                                value={currentMember.status}
                                onChange={(e) => handleUpdateField("status", e.target.value as MemberStatus)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            >
                                <option value="active">Active</option>
                                <option value="alumni">Alumni</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Subsystems (Assigned Teams)
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {SUBSYSTEM_ROLES.filter((s): s is SubsystemRole => s !== "All").map((sub) => {
                                    const checked = currentMember.subsystems.includes(sub);
                                    return (
                                        <button
                                            key={sub}
                                            type="button"
                                            onClick={() => handleSubsystemToggle(sub)}
                                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                                                checked
                                                    ? "bg-[#c5050c] border-[#c5050c] text-white"
                                                    : "bg-[#1c1c1f] border-[#333333] text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {sub}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Major
                            </label>
                            <input
                                type="text"
                                value={currentMember.major || ""}
                                onChange={(e) => handleUpdateField("major", e.target.value)}
                                placeholder="e.g. Mechanical Engineering"
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Graduation Year
                            </label>
                            <input
                                type="number"
                                value={currentMember.gradYear || 2027}
                                onChange={(e) => handleUpdateField("gradYear", Number(e.target.value))}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={currentMember.linkedin || ""}
                                onChange={(e) => handleUpdateField("linkedin", e.target.value)}
                                placeholder="https://linkedin.com/in/..."
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={currentMember.github || ""}
                                onChange={(e) => handleUpdateField("github", e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2">
                            <ImageUploader
                                currentPath={currentMember.image}
                                targetDirectory="members"
                                itemIdentifier={currentMember.id}
                                onImageSelected={(path, upload) => {
                                    if (!currentMember) return;
                                    const updatedList = members.map((m) =>
                                        m.id === currentMember.id ? { ...m, image: path } : m
                                    );
                                    onChange(updatedList, upload);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Right: Live Preview Card */}
            {currentMember && (
                <div className="lg:col-span-3 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Live Card Preview
                    </span>

                    <div className="chamfer-card-outer">
                        <div className="chamfer-card-inner bg-[#161616] flex flex-col justify-between overflow-hidden p-5">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {currentMember.subsystems.map((sub) => (
                                            <span
                                                key={sub}
                                                className="px-2 py-0.5 bg-[#252525] text-[#c5050c] font-bold text-[10px] uppercase tracking-wider border border-[#333333]"
                                            >
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                        {currentMember.status === "alumni"
                                            ? `Alumni (${currentMember.gradYear})`
                                            : `Class of ${currentMember.gradYear}`}
                                    </span>
                                </div>

                                <div className="flex items-start gap-4 mt-2">
                                    <div className="relative w-20 h-20 bg-[#222226] border border-[#333333] flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={currentMember.image || "/branding/RR_Icon.png"}
                                            alt={currentMember.name}
                                            fill
                                            sizes="80px"
                                            style={{ objectFit: "cover" }}
                                            unoptimized={currentMember.image?.startsWith("data:")}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h4 className="text-base font-bold text-white truncate">
                                            {currentMember.name}
                                        </h4>
                                        <span className="text-xs text-[#c5050c] font-semibold mt-0.5">
                                            {currentMember.role}
                                        </span>
                                        {currentMember.major && (
                                            <span className="text-[11px] text-gray-400 mt-1">
                                                {currentMember.major}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#26262a]">
                                {currentMember.linkedin && (
                                    <span className="text-[10px] uppercase font-bold text-blue-400">
                                        LinkedIn Linked
                                    </span>
                                )}
                                {currentMember.github && (
                                    <span className="text-[10px] uppercase font-bold text-gray-300">
                                        GitHub Linked
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


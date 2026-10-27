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
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

    const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

    const getMemberImage = (m: Member) => {
        return (
            previewUrls[m.id] ||
            (m.image ? previewUrls[m.image] : null) ||
            m.image ||
            "/branding/RR_Icon.png"
        );
    };

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
            <div className="lg:col-span-4 dash-sidebar-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="dash-section-title">
                        Team Directory ({members.length})
                    </h2>
                    <button
                        onClick={handleAddNewMember}
                        className="btn-add"
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
                        className="dash-input"
                    />
                    <div className="flex gap-1">
                        {(["all", "active", "alumni"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`dash-tab flex-1 py-1 text-[10px] ${
                                    filterStatus === status
                                        ? "dash-tab-active"
                                        : "dash-tab-inactive"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Member List */}
                <div className="dash-list-container">
                    {filteredMembers.map((m) => {
                        const isSelected = m.id === currentMember?.id;
                        return (
                            <div
                                key={m.id}
                                onClick={() => setSelectedMemberId(m.id)}
                                className={`dash-list-item ${
                                    isSelected
                                        ? "dash-list-item-active"
                                        : "dash-list-item-inactive"
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                                        <Image
                                            src={getMemberImage(m)}
                                            alt={m.name}
                                            fill
                                            sizes="32px"
                                            className="object-cover"
                                            unoptimized={
                                                getMemberImage(m).startsWith("data:") ||
                                                getMemberImage(m).startsWith("blob:")
                                            }
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate leading-tight">{m.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
                                    </div>
                                </div>
                                <span
                                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border flex-shrink-0 ${
                                        m.status === "active"
                                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                                            : "bg-[#202022] text-gray-400 border-[#333333]"
                                    }`}
                                >
                                    {m.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Middle: Edit Form */}
            {currentMember && (
                <div className="lg:col-span-5 dash-editor-card flex flex-col gap-4">
                    <div className="dash-editor-header">
                        <div>
                            <span className="dash-eyebrow">
                                Editing Member
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentMember.name}</h3>
                        </div>
                        <button
                            onClick={() => handleDeleteMember(currentMember.id)}
                            className="dash-delete-btn"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={currentMember.name}
                                onChange={(e) => handleUpdateField("name", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                ID Slug
                            </label>
                            <input
                                type="text"
                                value={currentMember.id}
                                onChange={(e) => handleUpdateField("id", e.target.value)}
                                className="dash-input font-mono"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Team Role / Title
                            </label>
                            <input
                                type="text"
                                value={currentMember.role}
                                onChange={(e) => handleUpdateField("role", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Status
                            </label>
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateField("status", "active")}
                                    className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                                        currentMember.status === "active"
                                            ? "bg-[#c5050c] border-[#c5050c] text-white shadow-sm"
                                            : "bg-[#1c1c1f] border-[#333333] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateField("status", "alumni")}
                                    className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                                        currentMember.status === "alumni"
                                            ? "bg-[#c5050c] border-[#c5050c] text-white shadow-sm"
                                            : "bg-[#1c1c1f] border-[#333333] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    Alumni
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="dash-label">
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
                            <label className="dash-label">
                                Major
                            </label>
                            <input
                                type="text"
                                value={currentMember.major || ""}
                                onChange={(e) => handleUpdateField("major", e.target.value)}
                                placeholder="e.g. Mechanical Engineering"
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Graduation Year
                            </label>
                            <input
                                type="number"
                                value={currentMember.gradYear || 2027}
                                onChange={(e) => handleUpdateField("gradYear", Number(e.target.value))}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="dash-label">
                                Contributions
                            </label>
                            <textarea
                                rows={2}
                                value={currentMember.contributions || ""}
                                onChange={(e) => handleUpdateField("contributions", e.target.value)}
                                placeholder="Write a sentence about what this member has contributed..."
                                className="dash-textarea"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={currentMember.linkedin || ""}
                                onChange={(e) => handleUpdateField("linkedin", e.target.value)}
                                placeholder="https://linkedin.com/in/..."
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={currentMember.github || ""}
                                onChange={(e) => handleUpdateField("github", e.target.value)}
                                placeholder="https://github.com/..."
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2">
                            <ImageUploader
                                key={`member-img-${currentMember.id}`}
                                currentPath={currentMember.image}
                                previewOverride={
                                    previewUrls[currentMember.id] ||
                                    (currentMember.image ? previewUrls[currentMember.image] : undefined)
                                }
                                targetDirectory="assets/members"
                                itemIdentifier={currentMember.id}
                                onImageSelected={(path, upload) => {
                                    if (!currentMember) return;
                                    if (upload?.previewUrl) {
                                        setPreviewUrls((prev) => ({
                                            ...prev,
                                            [currentMember.id]: upload.previewUrl,
                                            [path]: upload.previewUrl,
                                        }));
                                    } else {
                                        setPreviewUrls((prev) => {
                                            const copy = { ...prev };
                                            delete copy[currentMember.id];
                                            delete copy[path];
                                            return copy;
                                        });
                                    }
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
                    <span className="dash-preview-label">
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
                                                className="subsystem-tag"
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
                                            src={getMemberImage(currentMember)}
                                            alt={currentMember.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                            unoptimized={
                                                getMemberImage(currentMember).startsWith("data:") ||
                                                getMemberImage(currentMember).startsWith("blob:")
                                            }
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
                                        {currentMember.contributions && (
                                            <p className="text-xs text-gray-300 leading-relaxed mt-2 line-clamp-3">
                                                {currentMember.contributions}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {(currentMember.github || currentMember.linkedin) && (
                                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#26262a] text-xs font-bold uppercase tracking-wider">
                                    {currentMember.linkedin && (
                                        <a
                                            href={currentMember.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#0A66C2] hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            <span>LinkedIn</span>
                                            <span>→</span>
                                        </a>
                                    )}
                                    {currentMember.github && (
                                        <a
                                            href={currentMember.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#c5050c] hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            <span>GitHub</span>
                                            <span>→</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


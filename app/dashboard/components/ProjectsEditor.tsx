"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/app/data/projects";
import ImageUploader, { PendingUpload } from "./ImageUploader";

interface ProjectsEditorProps {
    projects: Project[];
    onChange: (updated: Project[], pendingUpload?: PendingUpload) => void;
}

export default function ProjectsEditor({ projects, onChange }: ProjectsEditorProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
    const [newHighlight, setNewHighlight] = useState("");
    const [newAward, setNewAward] = useState("");

    const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

    const handleUpdateField = <K extends keyof Project>(field: K, value: Project[K]) => {
        if (!currentProject) return;
        const updatedList = projects.map((p) => (p.id === currentProject.id ? { ...p, [field]: value } : p));
        onChange(updatedList);
    };

    const handleAddHighlight = () => {
        if (!newHighlight.trim() || !currentProject) return;
        const updatedHighlights = [...(currentProject.highlights || []), newHighlight.trim()];
        handleUpdateField("highlights", updatedHighlights);
        setNewHighlight("");
    };

    const handleRemoveHighlight = (index: number) => {
        if (!currentProject) return;
        const updatedHighlights = (currentProject.highlights || []).filter((_, i) => i !== index);
        handleUpdateField("highlights", updatedHighlights);
    };

    const handleAddAward = () => {
        if (!newAward.trim() || !currentProject) return;
        const updatedAwards = [...(currentProject.awards || []), newAward.trim()];
        handleUpdateField("awards", updatedAwards);
        setNewAward("");
    };

    const handleRemoveAward = (index: number) => {
        if (!currentProject) return;
        const updatedAwards = (currentProject.awards || []).filter((_, i) => i !== index);
        handleUpdateField("awards", updatedAwards);
    };

    const handleAddNewProject = () => {
        const newId = `project-${Date.now().toString().slice(-4)}`;
        const newProject: Project = {
            id: newId,
            title: "New Robot Platform",
            season: "2025-2026",
            orderIndex: 1,
            description: "High-performance collegiate robot platform built for competitive match play.",
            image: "/branding/RR_Logo.png",
            githubUrl: "https://github.com/msoe-vex",
            highlights: ["Custom 6-motor drivetrain"],
            awards: [],
        };
        const updatedList = [newProject, ...projects];
        onChange(updatedList);
        setSelectedProjectId(newId);
    };

    const handleDeleteProject = (id: string) => {
        if (confirm(`Are you sure you want to delete this project?`)) {
            const updatedList = projects.filter((p) => p.id !== id);
            onChange(updatedList);
            if (selectedProjectId === id) {
                setSelectedProjectId(updatedList[0]?.id || "");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Project Catalog List */}
            <div className="lg:col-span-4 bg-[#141416] border border-[#2b2b2b] p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                        Robots & Projects ({projects.length})
                    </h2>
                    <button
                        onClick={handleAddNewProject}
                        className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        + Add Project
                    </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1">
                    {projects.map((p) => {
                        const isSelected = p.id === currentProject?.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProjectId(p.id)}
                                className={`p-3 text-left transition-all border cursor-pointer flex items-center justify-between ${
                                    isSelected
                                        ? "bg-[#222226] border-[#c5050c] text-white"
                                        : "bg-[#18181b] border-transparent hover:border-[#333333] text-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 bg-[#252525] border border-[#333] flex-shrink-0">
                                        <Image
                                            src={p.image || "/branding/RR_Logo.png"}
                                            alt={p.title}
                                            fill
                                            sizes="40px"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate leading-tight">{p.title}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">{p.season}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-gray-500">#{p.orderIndex}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Middle: Edit Form */}
            {currentProject && (
                <div className="lg:col-span-5 bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-3">
                        <div>
                            <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest">
                                Editing Robot / Project
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentProject.title}</h3>
                        </div>
                        <button
                            onClick={() => handleDeleteProject(currentProject.id)}
                            className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={currentProject.title}
                                onChange={(e) => handleUpdateField("title", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Season Tag
                            </label>
                            <input
                                type="text"
                                value={currentProject.season}
                                onChange={(e) => handleUpdateField("season", e.target.value)}
                                placeholder="e.g. 2024-2025"
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Display Order Index
                            </label>
                            <input
                                type="number"
                                value={currentProject.orderIndex}
                                onChange={(e) => handleUpdateField("orderIndex", Number(e.target.value))}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={currentProject.description}
                                onChange={(e) => handleUpdateField("description", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={currentProject.githubUrl || ""}
                                onChange={(e) => handleUpdateField("githubUrl", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        {/* Technical Highlights */}
                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Technical Highlights
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newHighlight}
                                    onChange={(e) => setNewHighlight(e.target.value)}
                                    placeholder="Add engineering highlight..."
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                                    className="flex-1 bg-[#1e1e20] border border-[#333333] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddHighlight}
                                    className="px-3 py-1.5 bg-[#252528] hover:bg-[#333] text-white text-xs font-bold"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                {(currentProject.highlights || []).map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-[#19191c] px-3 py-1 text-xs text-gray-300 border border-[#26262a]"
                                    >
                                        <span>• {h}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveHighlight(i)}
                                            className="text-red-400 hover:text-red-300 text-xs font-bold ml-2 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Awards */}
                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                                Awards Won
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newAward}
                                    onChange={(e) => setNewAward(e.target.value)}
                                    placeholder="e.g. Design Award Finalist..."
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAward())}
                                    className="flex-1 bg-[#1e1e20] border border-[#333333] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddAward}
                                    className="px-3 py-1.5 bg-[#252528] hover:bg-[#333] text-white text-xs font-bold"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {(currentProject.awards || []).map((a, i) => (
                                    <span
                                        key={i}
                                        className="bg-[#242428] text-amber-300 text-[11px] font-bold px-2 py-0.5 border border-amber-600/30 flex items-center gap-1.5"
                                    >
                                        <span>🏆 {a}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAward(i)}
                                            className="text-gray-400 hover:text-red-400 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Image Uploader */}
                        <div className="col-span-2">
                            <ImageUploader
                                currentPath={currentProject.image}
                                targetDirectory="projects"
                                itemIdentifier={currentProject.id}
                                onImageSelected={(path, upload) => {
                                    if (!currentProject) return;
                                    const updatedList = projects.map((p) =>
                                        p.id === currentProject.id ? { ...p, image: path } : p
                                    );
                                    onChange(updatedList, upload);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Right: Live Preview Card */}
            {currentProject && (
                <div className="lg:col-span-3 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Live Card Preview
                    </span>

                    <div className="chamfer-card-outer">
                        <div className="chamfer-card-inner bg-[#161616] p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 bg-[#252525] text-[#c5050c] font-bold text-[10px] uppercase tracking-wider border border-[#333333]">
                                    {currentProject.season}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">
                                    Priority #{currentProject.orderIndex}
                                </span>
                            </div>

                            <div className="relative w-full h-36 bg-[#202022] border border-[#333333] flex items-center justify-center overflow-hidden">
                                <Image
                                    src={currentProject.image || "/branding/RR_Logo.png"}
                                    alt={currentProject.title}
                                    fill
                                    sizes="250px"
                                    style={{ objectFit: "contain" }}
                                    unoptimized={currentProject.image?.startsWith("data:")}
                                />
                            </div>

                            <h4 className="text-base font-bold text-white leading-tight">
                                {currentProject.title}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-3">
                                {currentProject.description}
                            </p>

                            {currentProject.highlights && currentProject.highlights.length > 0 && (
                                <div className="text-[11px] text-gray-300 space-y-0.5 pt-2 border-t border-[#26262a]">
                                    <span className="text-[10px] font-bold uppercase text-[#c5050c] block">
                                        Highlights:
                                    </span>
                                    {currentProject.highlights.slice(0, 2).map((h, i) => (
                                        <div key={i} className="truncate">• {h}</div>
                                    ))}
                                </div>
                            )}

                            {currentProject.awards && currentProject.awards.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {currentProject.awards.map((a, i) => (
                                        <span
                                            key={i}
                                            className="text-[9px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 border border-amber-700/40"
                                        >
                                            🏆 {a}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


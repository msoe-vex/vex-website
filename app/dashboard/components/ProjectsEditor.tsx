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
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

    const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

    const getProjectImage = (p: Project) => {
        return (
            previewUrls[p.id] ||
            (p.image ? previewUrls[p.image] : null) ||
            p.image ||
            "/branding/RR_Logo.png"
        );
    };

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
            <div className="lg:col-span-4 dash-sidebar-card flex flex-col gap-4">
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

                <div className="dash-list-container">
                    {projects.map((p) => {
                        const isSelected = p.id === currentProject?.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProjectId(p.id)}
                                className={`dash-list-item ${
                                    isSelected
                                        ? "dash-list-item-active"
                                        : "dash-list-item-inactive"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 bg-[#252525] border border-[#333] flex-shrink-0">
                                        <Image
                                            src={getProjectImage(p)}
                                            alt={p.title}
                                            fill
                                            sizes="40px"
                                            className="object-contain"
                                            unoptimized={
                                                getProjectImage(p).startsWith("data:") ||
                                                getProjectImage(p).startsWith("blob:")
                                            }
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
                <div className="lg:col-span-5 dash-editor-card flex flex-col gap-4">
                    <div className="dash-editor-header">
                        <div>
                            <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest">
                                Editing Robot / Project
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentProject.title}</h3>
                        </div>
                        <button
                            onClick={() => handleDeleteProject(currentProject.id)}
                            className="dash-delete-btn"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="dash-label">
                                Title
                            </label>
                            <input
                                type="text"
                                value={currentProject.title}
                                onChange={(e) => handleUpdateField("title", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Season Tag
                            </label>
                            <input
                                type="text"
                                value={currentProject.season}
                                onChange={(e) => handleUpdateField("season", e.target.value)}
                                placeholder="e.g. 2024-2025"
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Display Order Index
                            </label>
                            <input
                                type="number"
                                value={currentProject.orderIndex}
                                onChange={(e) => handleUpdateField("orderIndex", Number(e.target.value))}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="dash-label">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={currentProject.description}
                                onChange={(e) => handleUpdateField("description", e.target.value)}
                                className="dash-textarea"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="dash-label">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={currentProject.githubUrl || ""}
                                onChange={(e) => handleUpdateField("githubUrl", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        {/* Technical Highlights */}
                        <div className="col-span-2">
                            <label className="dash-label">
                                Technical Highlights
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newHighlight}
                                    onChange={(e) => setNewHighlight(e.target.value)}
                                    placeholder="Add engineering highlight..."
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                                    className="dash-input flex-1"
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
                                        key={`proj-highlight-${i}`}
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
                            <label className="dash-label">
                                Awards Won
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newAward}
                                    onChange={(e) => setNewAward(e.target.value)}
                                    placeholder="e.g. Design Award Finalist..."
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAward())}
                                    className="dash-input flex-1"
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
                                        key={`proj-award-${i}`}
                                        className="badge-award flex items-center gap-1.5"
                                    >
                                        <span>{a}</span>
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
                                key={`project-img-${currentProject.id}`}
                                currentPath={currentProject.image}
                                previewOverride={
                                    previewUrls[currentProject.id] ||
                                    (currentProject.image ? previewUrls[currentProject.image] : undefined)
                                }
                                targetDirectory="assets/projects"
                                itemIdentifier={currentProject.id}
                                onImageSelected={(path, upload) => {
                                    if (!currentProject) return;
                                    if (upload?.previewUrl) {
                                        setPreviewUrls((prev) => ({
                                            ...prev,
                                            [currentProject.id]: upload.previewUrl,
                                            [path]: upload.previewUrl,
                                        }));
                                    } else {
                                        setPreviewUrls((prev) => {
                                            const copy = { ...prev };
                                            delete copy[currentProject.id];
                                            delete copy[path];
                                            return copy;
                                        });
                                    }
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
                                <span className="subsystem-tag">
                                    {currentProject.season}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">
                                    Priority #{currentProject.orderIndex}
                                </span>
                            </div>

                            <div className="relative w-full h-36 bg-[#202022] border border-[#333333] flex items-center justify-center overflow-hidden">
                                <Image
                                    src={getProjectImage(currentProject)}
                                    alt={currentProject.title}
                                    fill
                                    sizes="250px"
                                    className="object-contain"
                                    unoptimized={
                                        getProjectImage(currentProject).startsWith("data:") ||
                                        getProjectImage(currentProject).startsWith("blob:")
                                    }
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
                                        <div key={`prev-highlight-${i}`} className="truncate">• {h}</div>
                                    ))}
                                </div>
                            )}

                            {currentProject.awards && currentProject.awards.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {currentProject.awards.map((a, i) => (
                                        <span
                                            key={`prev-award-${i}`}
                                            className="badge-award"
                                        >
                                            {a}
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


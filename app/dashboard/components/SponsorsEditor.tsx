"use client";

import { useState } from "react";
import Image from "next/image";
import type { Sponsor } from "@/app/data/sponsors";
import ImageUploader, { PendingUpload } from "./ImageUploader";

interface SponsorsEditorProps {
    sponsors: Sponsor[];
    onChange: (updated: Sponsor[], pendingUpload?: PendingUpload) => void;
}

export default function SponsorsEditor({ sponsors, onChange }: SponsorsEditorProps) {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

    const currentSponsor = sponsors[selectedIdx] || sponsors[0];

    const getSponsorImage = (s: Sponsor, idx: number) => {
        const key = `sponsor-${idx}`;
        const cleanImg = s.img.startsWith("/") || s.img.startsWith("http") ? s.img : `/sponsors/${s.img}`;
        return previewUrls[key] || previewUrls[cleanImg] || cleanImg;
    };

    const handleUpdate = <K extends keyof Sponsor>(field: K, val: Sponsor[K]) => {
        if (!currentSponsor) return;
        const next = sponsors.map((s, idx) => (idx === selectedIdx ? { ...s, [field]: val } : s));
        onChange(next);
    };

    const handleAdd = () => {
        const newSponsor: Sponsor = {
            alt: "New Sponsor Partner",
            img: "RR_Logo.png",
            link: "https://",
        };
        const next = [...sponsors, newSponsor];
        onChange(next);
        setSelectedIdx(next.length - 1);
    };

    const handleDelete = (index: number) => {
        if (confirm("Remove this sponsor?")) {
            const next = sponsors.filter((_, i) => i !== index);
            onChange(next);
            setSelectedIdx(Math.max(0, index - 1));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-4 dash-sidebar-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                        Sponsors & Partners ({sponsors.length})
                    </h2>
                    <button
                        onClick={handleAdd}
                        className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider cursor-pointer"
                    >
                        + Add Sponsor
                    </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1">
                    {sponsors.map((s, idx) => {
                        const isSelected = idx === selectedIdx;
                        return (
                            <div
                                key={`sponsor-${s.alt || idx}`}
                                onClick={() => setSelectedIdx(idx)}
                                className={`dash-list-item ${
                                    isSelected
                                        ? "dash-list-item-active"
                                        : "dash-list-item-inactive"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 bg-white/5 border border-[#333] p-1 flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={getSponsorImage(s, idx)}
                                            alt={s.alt}
                                            fill
                                            sizes="40px"
                                            style={{ objectFit: "contain", padding: "2px" }}
                                            unoptimized={
                                                getSponsorImage(s, idx).startsWith("data:") ||
                                                getSponsorImage(s, idx).startsWith("blob:")
                                            }
                                            onError={(e) => {
                                                // fallback
                                                (e.target as HTMLImageElement).src = "/branding/RR_Logo.png";
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate leading-tight">{s.alt}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{s.link}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form */}
            {currentSponsor && (
                <div className="lg:col-span-8 dash-editor-card flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-3">
                        <div>
                            <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest">
                                Editing Sponsor Partner
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentSponsor.alt}</h3>
                        </div>
                        <button
                            onClick={() => handleDelete(selectedIdx)}
                            className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Company / Partner Name
                            </label>
                            <input
                                type="text"
                                value={currentSponsor.alt}
                                onChange={(e) => handleUpdate("alt", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Partner Website URL
                            </label>
                            <input
                                type="url"
                                value={currentSponsor.link}
                                onChange={(e) => handleUpdate("link", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="dash-label">
                                Logo Filename or Path
                            </label>
                            <input
                                type="text"
                                value={currentSponsor.img}
                                onChange={(e) => handleUpdate("img", e.target.value)}
                                placeholder="e.g. Milwaukee_Tool.png"
                                className="dash-input font-mono"
                            />
                        </div>

                        <div className="col-span-2">
                            <ImageUploader
                                key={`sponsor-img-${selectedIdx}-${currentSponsor.alt}`}
                                currentPath={
                                    currentSponsor.img.startsWith("/")
                                        ? currentSponsor.img
                                        : `/sponsors/${currentSponsor.img}`
                                }
                                previewOverride={previewUrls[`sponsor-${selectedIdx}`]}
                                targetDirectory="sponsors"
                                itemIdentifier={currentSponsor.alt.toLowerCase().replace(/\s+/g, "-")}
                                onImageSelected={(path, upload) => {
                                    const key = `sponsor-${selectedIdx}`;
                                    const bare = path.replace(/^\/sponsors\//, "");
                                    if (upload?.previewUrl) {
                                        setPreviewUrls((prev) => ({
                                            ...prev,
                                            [key]: upload.previewUrl,
                                            [path]: upload.previewUrl,
                                            [`/sponsors/${bare}`]: upload.previewUrl,
                                        }));
                                    } else {
                                        setPreviewUrls((prev) => {
                                            const copy = { ...prev };
                                            delete copy[key];
                                            delete copy[path];
                                            return copy;
                                        });
                                    }
                                    const next = sponsors.map((s, idx) =>
                                        idx === selectedIdx ? { ...s, img: bare } : s
                                    );
                                    onChange(next, upload);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


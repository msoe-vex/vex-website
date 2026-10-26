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

    const currentSponsor = sponsors[selectedIdx] || sponsors[0];

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
            <div className="lg:col-span-4 bg-[#141416] border border-[#2b2b2b] p-4 flex flex-col gap-4">
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
                                key={idx}
                                onClick={() => setSelectedIdx(idx)}
                                className={`p-3 text-left transition-all border cursor-pointer flex items-center justify-between ${
                                    isSelected
                                        ? "bg-[#222226] border-[#c5050c] text-white"
                                        : "bg-[#18181b] border-transparent hover:border-[#333333] text-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 bg-white/5 border border-[#333] flex items-center justify-center p-1 flex-shrink-0">
                                        <Image
                                            src={
                                                s.img.startsWith("/") || s.img.startsWith("http")
                                                    ? s.img
                                                    : `/sponsors/${s.img}`
                                            }
                                            alt={s.alt}
                                            width={36}
                                            height={36}
                                            style={{ width: "auto", height: "auto", objectFit: "contain", maxHeight: "36px" }}
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
                <div className="lg:col-span-8 bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-4">
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
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Company / Partner Name
                            </label>
                            <input
                                type="text"
                                value={currentSponsor.alt}
                                onChange={(e) => handleUpdate("alt", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Partner Website URL
                            </label>
                            <input
                                type="url"
                                value={currentSponsor.link}
                                onChange={(e) => handleUpdate("link", e.target.value)}
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Logo Filename or Path
                            </label>
                            <input
                                type="text"
                                value={currentSponsor.img}
                                onChange={(e) => handleUpdate("img", e.target.value)}
                                placeholder="e.g. Milwaukee_Tool.png"
                                className="w-full bg-[#1e1e20] border border-[#333333] px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#c5050c]"
                            />
                        </div>

                        <div className="col-span-2">
                            <ImageUploader
                                currentPath={
                                    currentSponsor.img.startsWith("/")
                                        ? currentSponsor.img
                                        : `/sponsors/${currentSponsor.img}`
                                }
                                targetDirectory="sponsors"
                                itemIdentifier={currentSponsor.alt.toLowerCase().replace(/\s+/g, "-")}
                                onImageSelected={(path, upload) => {
                                    // Extract bare filename if path is /sponsors/...
                                    const bare = path.replace(/^\/sponsors\//, "");
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


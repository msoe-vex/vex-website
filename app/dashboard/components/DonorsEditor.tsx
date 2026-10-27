"use client";

import { useState } from "react";
import Image from "next/image";
import type { Donor } from "@/app/data/donors";
import ImageUploader, { PendingUpload } from "./ImageUploader";

interface DonorsEditorProps {
    donors: Donor[];
    onChange: (updated: Donor[], pendingUpload?: PendingUpload) => void;
}

export default function DonorsEditor({ donors, onChange }: DonorsEditorProps) {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

    const currentDonor = donors[selectedIdx] || donors[0];

    const getDonorImage = (d: Donor, idx: number) => {
        const key = `donor-${idx}`;
        const cleanImg = d.img.startsWith("/") || d.img.startsWith("http") ? d.img : `/donors/${d.img}`;
        return previewUrls[key] || previewUrls[cleanImg] || cleanImg;
    };

    const handleUpdate = <K extends keyof Donor>(field: K, val: Donor[K]) => {
        if (!currentDonor) return;
        const next = donors.map((d, idx) => (idx === selectedIdx ? { ...d, [field]: val } : d));
        onChange(next);
    };

    const handleAdd = () => {
        const newDonor: Donor = {
            alt: "New Donor",
            img: "RR_Logo.png",
            link: "https://",
        };
        const next = [...donors, newDonor];
        onChange(next);
        setSelectedIdx(next.length - 1);
    };

    const handleDelete = (index: number) => {
        if (confirm("Remove this donor?")) {
            const next = donors.filter((_, i) => i !== index);
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
                        Donors ({donors.length})
                    </h2>
                    <button
                        onClick={handleAdd}
                        className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider cursor-pointer"
                    >
                        + Add Donor
                    </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1">
                    {donors.map((d, idx) => {
                        const isSelected = idx === selectedIdx;
                        return (
                            <div
                                key={`donor-${d.alt || idx}`}
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
                                            src={getDonorImage(d, idx)}
                                            alt={d.alt}
                                            fill
                                            sizes="40px"
                                            style={{ objectFit: "contain", padding: "2px" }}
                                            unoptimized={
                                                getDonorImage(d, idx).startsWith("data:") ||
                                                getDonorImage(d, idx).startsWith("blob:")
                                            }
                                            onError={(e) => {
                                                // fallback
                                                (e.target as HTMLImageElement).src = "/branding/RR_Logo.png";
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate leading-tight">{d.alt}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{d.link}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form */}
            {currentDonor && (
                <div className="lg:col-span-8 dash-editor-card flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-3">
                        <div>
                            <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest">
                                Editing Donor
                            </span>
                            <h3 className="text-lg font-bold text-white">{currentDonor.alt}</h3>
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
                                Donor / Organization Name
                            </label>
                            <input
                                type="text"
                                value={currentDonor.alt}
                                onChange={(e) => handleUpdate("alt", e.target.value)}
                                className="dash-input"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="dash-label">
                                Donor Website URL
                            </label>
                            <input
                                type="url"
                                value={currentDonor.link}
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
                                value={currentDonor.img}
                                onChange={(e) => handleUpdate("img", e.target.value)}
                                placeholder="e.g. Milwaukee_Tool.png"
                                className="dash-input font-mono"
                            />
                        </div>

                        <div className="col-span-2">
                            <ImageUploader
                                key={`donor-img-${selectedIdx}-${currentDonor.alt}`}
                                currentPath={
                                    currentDonor.img.startsWith("/")
                                        ? currentDonor.img
                                        : `/donors/${currentDonor.img}`
                                }
                                previewOverride={previewUrls[`donor-${selectedIdx}`]}
                                targetDirectory="donors"
                                itemIdentifier={currentDonor.alt.toLowerCase().replace(/\s+/g, "-")}
                                onImageSelected={(path, upload) => {
                                    const key = `donor-${selectedIdx}`;
                                    const bare = path.replace(/^\/donors\//, "");
                                    if (upload?.previewUrl) {
                                        setPreviewUrls((prev) => ({
                                            ...prev,
                                            [key]: upload.previewUrl,
                                            [path]: upload.previewUrl,
                                            [`/donors/${bare}`]: upload.previewUrl,
                                        }));
                                    } else {
                                        setPreviewUrls((prev) => {
                                            const copy = { ...prev };
                                            delete copy[key];
                                            delete copy[path];
                                            return copy;
                                        });
                                    }
                                    const next = donors.map((d, idx) =>
                                        idx === selectedIdx ? { ...d, img: bare } : d
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

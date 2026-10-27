"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { PendingUpload } from "./ImageUploader";
import { compressClientImage } from "../util/compressClientImage";

interface FeaturesEditorProps {
    features: string[];
    pendingUploads: PendingUpload[];
    pendingDeletes: string[];
    onAddImage: (filename: string, upload: PendingUpload) => void;
    onRemoveImage: (filename: string) => void;
    onRestoreImage: (filename: string) => void;
}

export default function FeaturesEditor({
    features,
    pendingUploads,
    pendingDeletes,
    onAddImage,
    onRemoveImage,
    onRestoreImage,
}: FeaturesEditorProps) {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(features[0] || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Build map of preview urls for newly uploaded features
    const uploadPreviewMap = new Map<string, string>();
    for (const u of pendingUploads) {
        if (u.targetPath.startsWith("public/assets/features/")) {
            const fname = u.targetPath.replace("public/assets/features/", "");
            uploadPreviewMap.set(fname, u.previewUrl);
        }
    }

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file (PNG, JPG, WebP).");
            return;
        }

        try {
            // Compress hero background to max 1920px width/height and 82% quality
            const compressed = await compressClientImage(file, 1920, 0.82);

            // Clean filename and ensure extension
            const rawName = file.name.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_-]/g, "-");
            const filename = `${rawName}.${compressed.extension}`;
            const targetPath = `public/assets/features/${filename}`;

            onAddImage(filename, {
                targetPath,
                base64Content: compressed.base64Data,
                previewUrl: compressed.dataUrl,
            });

            setSelectedFeature(filename);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error("Hero image processing error", err);
            alert("Failed to process image file.");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const getPreviewUrl = (filename: string) => {
        if (uploadPreviewMap.has(filename)) {
            return uploadPreviewMap.get(filename)!;
        }
        return `/assets/features/${filename}`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Info Banner & Upload Zone */}
            <div className="dash-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest block mb-1">
                        Homepage Hero Carousel
                    </span>
                    <h2 className="text-xl font-black uppercase text-white">
                        Feature Background Images ({features.length})
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                        These photographs cycle deterministically with smooth crossfading behind the hero header on the main landing page.
                        You can upload new photos, preview existing ones, or remove obsolete images.
                    </p>
                </div>

                {/* Upload Action */}
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFile(e.target.files[0]);
                            }
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold px-4 py-2.5 uppercase tracking-wider cursor-pointer shadow-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Hero Photo
                    </button>
                </div>
            </div>

            {/* Drag & Drop Upload Strip */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                    isDragging
                        ? "border-[#c5050c] bg-[#c5050c]/10"
                        : "border-[#333] hover:border-gray-500 bg-[#141416]"
                }`}
            >
                <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                    Drag and drop a new hero photo here, or click to browse
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                    Accepts PNG, JPG, or WebP. Saved into <span className="font-mono text-gray-400">public/assets/features/</span>
                </p>
            </div>

            {/* Main Interactive Grid & Preview Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Images Grid */}
                <div className="lg:col-span-8 dash-editor-card flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                            Active Hero Features ({features.length})
                        </span>
                        {pendingDeletes.length > 0 && (
                            <span className="text-xs text-amber-500 font-bold">
                                {pendingDeletes.length} marked for removal
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[640px] overflow-y-auto pr-1">
                        {features.map((filename) => {
                            const isSelected = selectedFeature === filename;
                            const isPendingDelete = pendingDeletes.includes(filename);
                            const isNewUpload = uploadPreviewMap.has(filename);
                            const previewSrc = getPreviewUrl(filename);

                            return (
                                <div
                                    key={filename}
                                    onClick={() => setSelectedFeature(filename)}
                                    className={`relative group aspect-video rounded overflow-hidden border-2 cursor-pointer transition-all bg-[#0a0a0a] ${
                                        isSelected
                                            ? "border-[#c5050c] ring-2 ring-[#c5050c]/40"
                                            : isPendingDelete
                                            ? "border-red-900/60 opacity-40 grayscale"
                                            : "border-[#2a2a2e] hover:border-gray-500"
                                    }`}
                                >
                                    <Image
                                        src={previewSrc}
                                        alt={filename}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover"
                                        unoptimized={previewSrc.startsWith("data:")}
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-1 left-1 flex flex-col gap-1">
                                        {isNewUpload && (
                                            <span className="bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider shadow">
                                                New
                                            </span>
                                        )}
                                        {isPendingDelete && (
                                            <span className="bg-red-600/90 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider shadow">
                                                Deleted
                                            </span>
                                        )}
                                    </div>

                                    {/* Overlay on hover/select */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                        <p className="text-[10px] font-mono text-white truncate">{filename}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Image Detailed Preview & Actions */}
                <div className="lg:col-span-4 dash-sidebar-card flex flex-col gap-4">
                    <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest border-b border-[#2b2b2b] pb-2">
                        Feature Details & Controls
                    </span>

                    {selectedFeature ? (
                        <div className="flex flex-col gap-4">
                            <div className="relative aspect-video w-full rounded overflow-hidden border border-[#333] bg-black">
                                <Image
                                    src={getPreviewUrl(selectedFeature)}
                                    alt={selectedFeature}
                                    fill
                                    sizes="350px"
                                    className="object-contain"
                                    unoptimized={getPreviewUrl(selectedFeature).startsWith("data:")}
                                />
                            </div>

                            <div className="flex flex-col gap-1 bg-black/30 p-3 border border-[#2b2b2b]">
                                <span className="text-[10px] uppercase font-bold text-gray-500">File Name</span>
                                <span className="text-xs font-mono text-gray-200 break-all">{selectedFeature}</span>
                                <span className="text-[10px] uppercase font-bold text-gray-500 mt-2">Storage Path</span>
                                <span className="text-[11px] font-mono text-gray-400 break-all">
                                    public/assets/features/{selectedFeature}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                                {pendingDeletes.includes(selectedFeature) ? (
                                    <button
                                        onClick={() => onRestoreImage(selectedFeature)}
                                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                        Undo Removal
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (features.length <= 1) {
                                                alert("You must keep at least 1 hero feature image.");
                                                return;
                                            }
                                            if (confirm(`Remove "${selectedFeature}" from the hero feature rotation?`)) {
                                                onRemoveImage(selectedFeature);
                                            }
                                        }}
                                        className="w-full bg-red-900/60 hover:bg-red-700 text-red-200 hover:text-white border border-red-800 text-xs font-bold py-2 uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                        Remove From Carousel
                                    </button>
                                )}

                                <a
                                    href={getPreviewUrl(selectedFeature)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full text-center bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-[#333] text-xs font-bold py-2 uppercase tracking-wider transition-colors"
                                >
                                    View Full Size ↗
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 py-10 text-center">
                            Select an image from the grid to inspect or remove it.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}


"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export interface PendingUpload {
    targetPath: string; // e.g. "public/members/john-doe.png"
    base64Content: string; // Raw base64 data without data:image/... prefix
    previewUrl: string; // Data URL for immediate preview
}

interface ImageUploaderProps {
    currentPath?: string;
    previewOverride?: string; // Optional direct dataUrl preview
    targetDirectory: "members" | "projects" | "donors";
    itemIdentifier: string; // e.g. member id or project id
    onImageSelected: (imagePath: string, pendingUpload?: PendingUpload) => void;
}

export default function ImageUploader({
    currentPath,
    previewOverride,
    targetDirectory,
    itemIdentifier,
    onImageSelected,
}: ImageUploaderProps) {
    const effectivePreview = previewOverride || currentPath || null;
    const [preview, setPreview] = useState<string | null>(effectivePreview);
    const [prevCurrentPath, setPrevCurrentPath] = useState(currentPath);
    const [prevOverride, setPrevOverride] = useState(previewOverride);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keep preview in sync when currentPath or previewOverride props change externally
    if (currentPath !== prevCurrentPath || previewOverride !== prevOverride) {
        setPrevCurrentPath(currentPath);
        setPrevOverride(previewOverride);
        setPreview(previewOverride || currentPath || null);
    }

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file (PNG, JPG, WebP, SVG).");
            return;
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        const cleanId = (itemIdentifier || "upload").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
        const filename = `${cleanId}.${ext}`;
        const targetPath = `public/${targetDirectory}/${filename}`;
        const webPath = `/${targetDirectory}/${filename}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const base64Data = dataUrl.split(",")[1];
            setPreview(dataUrl);

            onImageSelected(webPath, {
                targetPath,
                base64Content: base64Data,
                previewUrl: dataUrl,
            });

            // Clear input value so selecting the same file again triggers change event
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Image Asset
            </label>

            <div className="flex items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="relative w-20 h-20 bg-[#202022] border border-[#333333] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            sizes="80px"
                            style={{ objectFit: "cover" }}
                            unoptimized={preview.startsWith("data:")}
                        />
                    ) : (
                        <span className="text-[10px] text-gray-500 uppercase font-bold text-center px-1">
                            No image
                        </span>
                    )}
                </div>

                {/* Dropzone & Browse button */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex-1 border-2 border-dashed p-3 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isDragging
                            ? "border-[#c5050c] bg-[#c5050c]/10"
                            : "border-[#333333] hover:border-gray-500 bg-[#19191c]"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFile(e.target.files[0]);
                            }
                        }}
                    />
                    <span className="text-xs font-semibold text-gray-200">
                        Drag photo here or <span className="text-[#c5050c] underline">Browse</span>
                    </span>
                    <span className="text-[10px] text-gray-500">
                        PNG, JPG, WebP, SVG (Saved to public/{targetDirectory}/)
                    </span>
                </div>
            </div>

            {/* Default Presets Quick Picker */}
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Presets:</span>
                <button
                    type="button"
                    onClick={() => {
                        setPreview("/branding/RR_Icon.png");
                        onImageSelected("/branding/RR_Icon.png");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-[10px] px-2 py-0.5 bg-[#252525] hover:bg-[#333333] text-gray-300 font-mono"
                >
                    RR_Icon.png
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setPreview("/branding/RR_Logo.png");
                        onImageSelected("/branding/RR_Logo.png");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-[10px] px-2 py-0.5 bg-[#252525] hover:bg-[#333333] text-gray-300 font-mono"
                >
                    RR_Logo.png
                </button>
            </div>
        </div>
    );
}


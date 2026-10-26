"use client";

import { useState } from "react";
import type { PendingUpload } from "./ImageUploader";
import {
    createBranch,
    commitFile,
    createPullRequest,
    PullRequestResult,
} from "../services/githubApi";

export interface PendingFileChange {
    filePath: string;
    description: string;
    generatedContent: string;
}

interface DiffReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    pendingChanges: PendingFileChange[];
    pendingUploads: PendingUpload[];
    onPrCreatedSuccess: () => void;
}

export default function DiffReviewModal({
    isOpen,
    onClose,
    token,
    pendingChanges,
    pendingUploads,
    onPrCreatedSuccess,
}: DiffReviewModalProps) {
    const [prTitle, setPrTitle] = useState(
        `Update website data via Dashboard (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })})`
    );
    const [prDescription, setPrDescription] = useState(
        "Automated content update submitted via Raider Robotics Web Dashboard."
    );
    const [previewingFile, setPreviewingFile] = useState<string | null>(
        pendingChanges[0]?.filePath || null
    );
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdPr, setCreatedPr] = useState<PullRequestResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleClose = () => {
        setCreatedPr(null);
        setErrorMessage(null);
        setStatusMessage(null);
        setPrTitle(
            `Update website data via Dashboard (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })})`
        );
        setPrDescription("Automated content update submitted via Raider Robotics Web Dashboard.");
        onClose();
    };

    const activePreviewPath =
        pendingChanges.some((c) => c.filePath === previewingFile)
            ? previewingFile
            : pendingChanges[0]?.filePath || null;

    const currentPreviewContent =
        pendingChanges.find((c) => c.filePath === activePreviewPath)?.generatedContent || "";

    const handleSubmitPr = async () => {
        setIsSubmitting(true);
        setErrorMessage(null);
        setStatusMessage("Initializing branch on msoe-vex/vex-website...");

        try {
            const timestamp = Date.now();
            const branchName = `dashboard/update-${timestamp}`;

            // 1. Create branch
            setStatusMessage(`Creating feature branch '${branchName}'...`);
            await createBranch(token, branchName, "main");

            // 2. Commit uploaded images if any
            for (const upload of pendingUploads) {
                setStatusMessage(`Uploading asset ${upload.targetPath}...`);
                await commitFile(
                    token,
                    branchName,
                    upload.targetPath,
                    upload.base64Content,
                    `Upload asset ${upload.targetPath} via Dashboard`,
                    true
                );
            }

            // 3. Commit updated TypeScript files
            for (const change of pendingChanges) {
                setStatusMessage(`Committing ${change.filePath}...`);
                await commitFile(
                    token,
                    branchName,
                    change.filePath,
                    change.generatedContent,
                    `Update ${change.filePath} via Dashboard`,
                    false
                );
            }

            // 4. Open Pull Request
            setStatusMessage("Opening Pull Request on GitHub...");
            const fullBody = `${prDescription}\n\n### Changed Files:\n${pendingChanges
                .map((c) => `- \`${c.filePath}\` - ${c.description}`)
                .join("\n")}${
                pendingUploads.length > 0
                    ? `\n\n### New Media Assets:\n${pendingUploads
                          .map((u) => `- \`${u.targetPath}\``)
                          .join("\n")}`
                    : ""
            }\n\n*Created with Raider Robotics Dashboard*`;

            const pr = await createPullRequest(token, branchName, prTitle, fullBody, "main");
            setCreatedPr(pr);
            setStatusMessage(null);
            onPrCreatedSuccess();
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to create Pull Request.");
            setStatusMessage(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="dash-card w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
                {/* Header */}
                <div className="p-5 border-b border-[#2b2b2b] flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-[#c5050c] font-bold uppercase tracking-widest block">
                            Pull Request Review
                        </span>
                        <h2 className="text-xl font-black uppercase text-white">
                            Review Changes & Submit PR
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                    {/* Success state */}
                    {createdPr ? (
                        <div className="bg-emerald-950/40 border border-emerald-600/50 p-6 flex flex-col items-center text-center gap-3">
                            <span className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <h3 className="text-xl font-bold text-white">
                                Pull Request Created Successfully!
                            </h3>
                            <p className="text-xs text-gray-300">
                                PR <strong className="text-white">#{createdPr.number}</strong> has been opened into <code className="text-emerald-400">main</code>.
                            </p>
                            <p className="text-xs text-gray-400 max-w-md">
                                The dashboard diff baseline has been automatically reset. You can now close this review and immediately make and submit subsequent changes.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                                <a
                                    href={createdPr.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#1e1e20] hover:bg-[#2b2b2b] border border-[#3b3b3e] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors inline-flex items-center gap-2"
                                >
                                    <span>View PR #{createdPr.number} on GitHub &rarr;</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors cursor-pointer"
                                >
                                    Start New Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {errorMessage && (
                                <div className="p-3 bg-red-950/60 border border-red-700/60 text-red-200 text-xs">
                                    <strong className="block font-bold uppercase">Submission Failed</strong>
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Changed Files summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#1a1a1d] border border-[#2b2b2b] p-3">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                                        Data Files to Update
                                    </span>
                                    <span className="text-xl font-black text-white">
                                        {pendingChanges.length}
                                    </span>
                                </div>
                                <div className="bg-[#1a1a1d] border border-[#2b2b2b] p-3">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                                        New Media Uploads
                                    </span>
                                    <span className="text-xl font-black text-white">
                                        {pendingUploads.length}
                                    </span>
                                </div>
                                <div className="bg-[#1a1a1d] border border-[#2b2b2b] p-3">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                                        Target Branch
                                    </span>
                                    <span className="text-sm font-mono font-bold text-[#c5050c]">
                                        main
                                    </span>
                                </div>
                            </div>

                            {/* PR Title & Description */}
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="dash-label">
                                        Pull Request Title
                                    </label>
                                    <input
                                        type="text"
                                        value={prTitle}
                                        onChange={(e) => setPrTitle(e.target.value)}
                                        className="dash-input"
                                    />
                                </div>
                                <div>
                                    <label className="dash-label">
                                        Pull Request Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={prDescription}
                                        onChange={(e) => setPrDescription(e.target.value)}
                                        className="dash-textarea"
                                    />
                                </div>
                            </div>

                            {/* Code Preview Section */}
                            {pendingChanges.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Generated TypeScript Preview
                                        </label>
                                        <div className="flex gap-1">
                                            {pendingChanges.map((c) => (
                                                <button
                                                    key={c.filePath}
                                                    type="button"
                                                    onClick={() => setPreviewingFile(c.filePath)}
                                                    className={`px-2 py-0.5 text-[10px] font-mono cursor-pointer ${
                                                        activePreviewPath === c.filePath
                                                            ? "bg-[#c5050c] text-white"
                                                            : "bg-[#252528] text-gray-400 hover:text-white"
                                                    }`}
                                                >
                                                    {c.filePath.split("/").pop()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-[#0e0e10] border border-[#2b2b2b] p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-gray-300 whitespace-pre">
                                        {currentPreviewContent || "No preview available."}
                                    </div>
                                </div>
                            )}

                            {statusMessage && (
                                <div className="p-3 bg-blue-950/40 border border-blue-700/50 text-blue-200 text-xs flex items-center gap-2">
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                    <span>{statusMessage}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-[#2b2b2b] flex items-center justify-end gap-3 bg-[#111113]">
                    {createdPr ? (
                        <button
                            onClick={handleClose}
                            className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 cursor-pointer transition-colors"
                        >
                            Start New Changes / Close
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitPr}
                                disabled={isSubmitting || pendingChanges.length === 0}
                                className="bg-[#c5050c] hover:bg-[#a0040a] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 transition-colors cursor-pointer flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                                        <span>Submitting to GitHub...</span>
                                    </>
                                ) : (
                                    <span>Create Pull Request</span>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


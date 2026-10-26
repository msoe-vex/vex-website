"use client";

import { useState } from "react";
import Image from "next/image";
import type { GitHubUser } from "../auth/githubAuth";
import { TARGET_ORG } from "../auth/githubAuth";

interface DashboardHeaderProps {
    user: GitHubUser;
    onSignOut: () => void;
    modifiedCount: number;
    onOpenReview: () => void;
    onDiscard: () => void;
}

export default function DashboardHeader({
    user,
    onSignOut,
    modifiedCount,
    onOpenReview,
    onDiscard,
}: DashboardHeaderProps) {
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    return (
        <header className="bg-[#141416] border-b border-[#2b2b2b] px-4 py-3 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Brand & Org Status */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/branding/RR_Icon.png"
                        alt="Raider Robotics"
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-black uppercase tracking-tight text-white text-base">
                                Raider Robotics Dashboard
                            </span>
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                {TARGET_ORG} Verified
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                            Logged in as <strong className="text-white">@{user.login}</strong>
                        </p>
                    </div>
                </div>

                {/* Actions & User Profile */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setShowConfirmClear(true)}
                        disabled={modifiedCount === 0}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors border ${
                            modifiedCount > 0
                                ? "border-[#3a3a3e] hover:border-red-600/70 hover:bg-red-950/30 text-gray-300 hover:text-red-300 cursor-pointer"
                                : "border-[#26262a] text-gray-600 cursor-not-allowed"
                        }`}
                        title="Discard all pending changes"
                    >
                        Clear
                    </button>

                    <button
                        onClick={onOpenReview}
                        disabled={modifiedCount === 0}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                            modifiedCount > 0
                                ? "bg-[#c5050c] hover:bg-[#a0040a] text-white shadow-lg cursor-pointer"
                                : "bg-[#252525] text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <span>Review & Create PR</span>
                        {modifiedCount > 0 && (
                            <span className="bg-white text-black font-black text-[10px] px-1.5 py-0.2 rounded-full">
                                {modifiedCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-2 pl-2 border-l border-[#2b2b2b]">
                        <Image
                            src={user.avatar_url}
                            alt={user.login}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                        />
                        <button
                            onClick={onSignOut}
                            className="text-xs text-gray-400 hover:text-red-400 font-bold uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer"
                            title="Sign out of GitHub"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Clear Changes Confirmation Menu Modal */}
            {showConfirmClear && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="dash-card w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                                Confirmation
                            </span>
                            <h3 className="text-lg font-black uppercase text-white">
                                Discard All Changes?
                            </h3>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Are you sure you want to discard all <strong className="text-white">{modifiedCount}</strong> pending changes and reset to the last published state? Any uncommitted edits and new image uploads will be cleared.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#26262a]">
                            <button
                                type="button"
                                onClick={() => setShowConfirmClear(false)}
                                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-[#202022] hover:bg-[#28282b] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onDiscard();
                                    setShowConfirmClear(false);
                                }}
                                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 cursor-pointer"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}


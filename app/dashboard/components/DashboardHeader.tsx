"use client";

import Image from "next/image";
import type { GitHubUser } from "../auth/githubAuth";
import { TARGET_ORG } from "../auth/githubAuth";

interface DashboardHeaderProps {
    user: GitHubUser;
    onSignOut: () => void;
    modifiedCount: number;
    onOpenReview: () => void;
}

export default function DashboardHeader({
    user,
    onSignOut,
    modifiedCount,
    onOpenReview,
}: DashboardHeaderProps) {
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
                        style={{ width: "auto", height: "36px" }}
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
                <div className="flex items-center gap-3">
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
                            className="rounded-full border border-gray-700"
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
        </header>
    );
}


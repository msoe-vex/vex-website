"use client";

import { useState } from "react";
import Image from "next/image";
import {
    TARGET_ORG,
    TARGET_REPO,
    DEFAULT_GITHUB_CLIENT_ID,
} from "../auth/githubAuth";

interface AuthGateProps {
    onLogin: (token: string) => Promise<void>;
    loading: boolean;
    error?: string;
}

export default function AuthGate({ onLogin, loading, error }: AuthGateProps) {
    const [tokenInput, setTokenInput] = useState("");
    const [showToken, setShowToken] = useState(false);
    const [showManualToken, setShowManualToken] = useState(false);

    const handleOAuthClick = () => {
        const activeClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || DEFAULT_GITHUB_CLIENT_ID;

        // On production, omit redirect_uri so GitHub automatically uses the configured OAuth App callback URL.
        // On localhost, specify the localhost callback URI.
        const isLocalhost =
            typeof window !== "undefined" &&
            (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

        const redirectUri = isLocalhost ? `${window.location.origin}/dashboard` : "";
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${activeClientId}&scope=repo,read:org${
            redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : ""
        }`;

        window.location.href = githubAuthUrl;
    };

    const handlePatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tokenInput.trim()) {
            onLogin(tokenInput.trim());
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-lg dash-card p-6 sm:p-8 shadow-2xl relative">
                {/* Accent top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#c5050c]" />

                <div className="flex flex-col items-center text-center gap-4 mb-6">
                    <Image
                        src="/branding/RR_Logo.png"
                        alt="Raider Robotics"
                        width={200}
                        height={100}
                        priority
                        style={{ width: "auto", height: "auto", maxHeight: "48px" }}
                    />
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                            Web Dashboard
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Pull request generator for <span className="text-[#c5050c] font-semibold">{TARGET_REPO}</span>
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-950/60 border border-red-700/60 text-red-200 text-xs flex flex-col gap-1">
                        <span className="font-bold uppercase tracking-wider text-red-400">Authentication Error</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Primary Action: Direct 1-Click Sign in with GitHub */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleOAuthClick}
                        disabled={loading}
                        className="w-full bg-[#24292f] hover:bg-[#1f2328] border border-[#444c56] text-white font-bold py-3 text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg"
                    >
                        {/* GitHub Octocat Icon */}
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        <span>Sign In with GitHub</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#2b2b2b]" />
                    </div>
                    <span className="relative bg-[#161616] px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Or authenticate with token
                    </span>
                </div>

                {/* Fallback PAT Form */}
                <div>
                    {!showManualToken ? (
                        <button
                            type="button"
                            onClick={() => setShowManualToken(true)}
                            className="w-full text-center text-xs font-semibold text-gray-400 hover:text-white py-2 border border-[#2b2b2b] hover:border-gray-600 transition-colors cursor-pointer"
                        >
                            Sign In with Personal Access Token (PAT) &darr;
                        </button>
                    ) : (
                        <form onSubmit={handlePatSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="dash-label">
                                    GitHub Personal Access Token (PAT)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showToken ? "text" : "password"}
                                        value={tokenInput}
                                        onChange={(e) => setTokenInput(e.target.value)}
                                        placeholder="github_pat_... or ghp_..."
                                        required
                                        className="dash-input font-mono pr-16"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 hover:text-white px-2 py-1"
                                    >
                                        {showToken ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !tokenInput.trim()}
                                className="w-full btn-primary py-2.5 tracking-widest flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                        <span>Verifying Token...</span>
                                    </>
                                ) : (
                                    <span>Verify & Unlock</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Organization Access note */}
                <div className="mt-6 pt-4 border-t border-[#222226] text-center">
                    <p className="text-[11px] text-gray-400">
                        Access requires membership in the <strong className="text-white">{TARGET_ORG}</strong> GitHub organization.
                    </p>
                </div>
            </div>
        </div>
    );
}

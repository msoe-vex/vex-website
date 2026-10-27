"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DURATION_SECONDS = 5;
const DURATION_MS = DURATION_SECONDS * 1000;

export default function RickRollRedirectPage() {
    const router = useRouter();
    const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, (DURATION_MS - elapsed) / 1000);
            setSecondsLeft(remaining);

            if (elapsed >= DURATION_MS) {
                clearInterval(interval);
                router.push("/home");
            }
        }, 100);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background glowing red ambiance */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,5,12,0.18)_0%,transparent_70%)] pointer-events-none" />

            <div className="chamfer-card-outer max-w-lg w-full z-10 shadow-2xl">
                <div className="chamfer-card-inner bg-[#161619] p-5 sm:p-6 flex flex-col items-center gap-5">
                    {/* Rick Astley GIF with complete border along all edges including slanted corner matching member tiles */}
                    <div
                        className="relative w-full aspect-video shadow-xl p-[1px] bg-[#383842]"
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
                        }}
                    >
                        <div
                            className="w-full h-full overflow-hidden bg-black flex items-center justify-center"
                            style={{
                                clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(14px - 0.4px) 100%, 0 calc(100% - (14px - 0.4px)))"
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
                                alt="Rick Astley"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Redirecting Progress Bar */}
                    <div className="w-full bg-[#111113] p-4 border border-[#2b2b2b] clip-chamfer-btn flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-gray-400">Redirecting in:</span>
                            <span className="text-[#c5050c] text-sm font-black tracking-wider">
                                {secondsLeft.toFixed(1)}s
                            </span>
                        </div>
                        {/* Animated progress bar */}
                        <div className="w-full h-2 bg-[#222226] overflow-hidden rounded-full">
                            <div
                                className="h-full bg-[#c5050c] transition-all duration-100 ease-linear shadow-[0_0_10px_#c5050c]"
                                style={{ width: `${(secondsLeft / DURATION_SECONDS) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
                        <button
                            onClick={() => router.push("/home")}
                            className="btn-primary px-5 py-2.5 clip-chamfer-btn shadow-lg"
                        >
                            Home →
                        </button>
                        <a
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-5 py-2.5 clip-chamfer-btn shadow-lg flex items-center gap-1.5"
                        >
                            <span>Watch the Music Video</span>
                            <span>↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import donors, { Donor } from "@/app/data/donors";
import locales from "@/app/data/locales";
import "./donors.css";

export default function DonorScroller() {
    // 3 repetitions guarantee seamless wrap-around looping across large screens
    const loopedDonors: Donor[] = [...donors, ...donors, ...donors];

    const viewportRef = useRef<HTMLDivElement>(null);
    const isInteractingRef = useRef(false);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollStartRef = useRef(0);
    const movedDistanceRef = useRef(0);
    const prevTimestampRef = useRef<number | null>(null);

    // Cache the total scroll loop width to avoid querying scrollWidth inside requestAnimationFrame
    const loopWidthRef = useRef(0);

    const [isGrabbing, setIsGrabbing] = useState(false);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        // Measure once after layout renders to avoid forced layout / reflow
        const singleWidth = viewport.scrollWidth / 3;
        loopWidthRef.current = singleWidth;

        // Start halfway through the duplicated sets so scrolling left or right loops smoothly
        if (viewport.scrollLeft === 0) {
            viewport.scrollLeft = singleWidth;
        }

        // Keep loopWidth updated when screen resizes without running in the animation loop
        const resizeObserver = new ResizeObserver(() => {
            if (viewport) {
                loopWidthRef.current = viewport.scrollWidth / 3;
            }
        });
        resizeObserver.observe(viewport);

        let animationFrameId: number;
        const scrollSpeedPxPerSec = 45; // Smooth automatic scroll rate

        const step = (timestamp: number) => {
            if (prevTimestampRef.current === null) {
                prevTimestampRef.current = timestamp;
            }
            const delta = (timestamp - prevTimestampRef.current) / 1000;
            prevTimestampRef.current = timestamp;

            if (viewport && !isInteractingRef.current) {
                viewport.scrollLeft += scrollSpeedPxPerSec * delta;

                // Seamless infinite wrap around boundary using cached width
                const singleLoopWidth = loopWidthRef.current;
                if (singleLoopWidth > 0) {
                    if (viewport.scrollLeft >= singleLoopWidth * 2) {
                        viewport.scrollLeft -= singleLoopWidth;
                    } else if (viewport.scrollLeft <= 0) {
                        viewport.scrollLeft += singleLoopWidth;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        isDraggingRef.current = true;
        isInteractingRef.current = true;
        startXRef.current = e.pageX;
        scrollStartRef.current = viewport.scrollLeft;
        movedDistanceRef.current = 0;
        setIsGrabbing(true);

        // Capture pointer events even when dragging outside the element boundary
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        const viewport = viewportRef.current;
        if (!viewport) return;

        const distance = e.pageX - startXRef.current;
        movedDistanceRef.current = Math.abs(distance);
        viewport.scrollLeft = scrollStartRef.current - distance;

        // Wrap around dynamically while dragging using cached width
        const singleLoopWidth = loopWidthRef.current;
        if (singleLoopWidth > 0) {
            if (viewport.scrollLeft >= singleLoopWidth * 2) {
                viewport.scrollLeft -= singleLoopWidth;
                scrollStartRef.current -= singleLoopWidth;
            } else if (viewport.scrollLeft <= 0) {
                viewport.scrollLeft += singleLoopWidth;
                scrollStartRef.current += singleLoopWidth;
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDraggingRef.current = false;
        isInteractingRef.current = false;
        setIsGrabbing(false);
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            // Safe fallback if pointer was not captured
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent opening the link if the user was actively dragging/swiping
        if (movedDistanceRef.current > 5) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <section id="donors" className="py-8 px-4 bg-[#0d0d0f] text-white overflow-hidden border-t border-b border-[#1f1f23] select-none">
            <div className="section-container">
                {/* Section Header */}
                <div className="section-header-row">
                    <div>
                        <div className="section-eyebrow-row">
                            <span className="section-diamond" />
                            <span className="section-eyebrow">
                                {locales.donors.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="section-title">
                            {locales.donors.sectionTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="hidden lg:block text-gray-400 text-xs max-w-sm">
                            {locales.donors.description}
                        </p>
                        <a
                            href={`mailto:${locales.contact.emailAddress}?subject=${encodeURIComponent(locales.donors.donorSubject)}`}
                            className="inline-flex items-center px-4 py-1.5 bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-wider transition-colors clip-chamfer-btn select-text"
                        >
                            {locales.donors.ctaButton}
                        </a>
                    </div>
                </div>

                {/* Horizontal Marquee / Interactive Drag Scroller Viewport */}
                <div className="w-full">
                    <div
                        ref={viewportRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onMouseEnter={() => {
                            isInteractingRef.current = true;
                        }}
                        onMouseLeave={() => {
                            if (!isDraggingRef.current) {
                                isInteractingRef.current = false;
                            }
                        }}
                        className={`donor-marquee-viewport relative w-full overflow-x-auto border-2 border-[#2b2b2b] bg-[#161619] shadow-2xl py-4 px-2 ${
                            isGrabbing ? "cursor-grabbing" : "cursor-grab"
                        }`}
                        title="Click and drag or swipe to explore donors"
                    >
                        {/* Left & Right gradient fades */}
                        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#161619] to-transparent z-10" />
                        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#161619] to-transparent z-10" />

                        {/* Horizontal scrolling track */}
                        <div className="donor-track-horizontal flex items-center gap-4">
                            {loopedDonors.map((donor, index) => (
                                <a
                                    key={`${donor.alt}-${index}`}
                                    href={donor.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={handleCardClick}
                                    draggable={false}
                                    className="donor-card group flex items-center justify-between gap-4 p-3 bg-[#1e1e22] hover:bg-[#28282e] border-l-4 border-transparent hover:border-[#c5050c] transition-all duration-200 flex-shrink-0 min-w-[220px] clip-chamfer-btn pointer-events-auto"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-16 h-10 flex-shrink-0 bg-white/95 p-1 rounded-sm flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={`/assets/donors/${donor.img}`}
                                                alt={donor.alt}
                                                fill
                                                sizes="64px"
                                                draggable={false}
                                                className="object-contain p-0.5"
                                            />
                                        </div>
                                        <span className="font-semibold text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors whitespace-nowrap">
                                            {donor.alt}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#f87171] group-hover:translate-x-0.5 transition-transform font-bold">
                                        ↗
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

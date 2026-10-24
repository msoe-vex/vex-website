"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import features from "@/app/data/features";
import Image from "next/image";

const DISPLAY_TIME = 4000;
const FADE_TIME = 1500;
const CYCLE_PERIOD = DISPLAY_TIME + FADE_TIME; // 5500ms

/**
 * Computes the exact deterministic image index for a given epoch millisecond timestamp:
 * Math.floor(timestamp / CYCLE_PERIOD) % features.length
 */
function getImageIndexForTime(timeMs: number): number {
    if (!features || features.length === 0) return 0;
    const step = Math.floor(timeMs / CYCLE_PERIOD);
    return Math.abs(step) % features.length;
}

function subscribe() {
    return () => {};
}

function getClientSnapshot(): number {
    return getImageIndexForTime(Date.now());
}

function getServerSnapshot(): number {
    return 0;
}

/**
 * RandomFeature cycles competition background photographs with seamless double-buffered
 * crossfading behind the canvas and content overlays.
 *
 * The current image is strictly synchronized to epoch time.
 */
export default function RandomFeature({ id = "", className = "" }: { id?: string; className?: string }) {
    const timeIndex = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

    const [layerA, setLayerA] = useState<string>(() => (features && features.length > 0 ? features[timeIndex] : ""));
    const [layerB, setLayerB] = useState<string>(() => (features && features.length > 0 ? features[(timeIndex + 1) % features.length] : ""));
    const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
    const activeRef = useRef<"A" | "B">("A");

    useEffect(() => {
        if (!features || features.length <= 1) return;

        // Align the first transition to the next wall-clock cycle boundary
        const now = Date.now();
        const timeIntoCurrentCycle = now % CYCLE_PERIOD;
        const timeUntilNextCycle = Math.max(CYCLE_PERIOD - timeIntoCurrentCycle, 200);

        let intervalId: ReturnType<typeof setInterval> | null = null;
        let fadeTimeoutId: ReturnType<typeof setTimeout> | null = null;

        const initialTimeout = setTimeout(() => {
            const cycleNext = () => {
                const currentActive = activeRef.current;
                // Target index for the layer currently fading out to prepare for the subsequent cycle
                const futureTime = Date.now() + CYCLE_PERIOD;
                const nextTargetIdx = (getImageIndexForTime(futureTime) + 1) % features.length;

                if (currentActive === "A") {
                    setActiveLayer("B");
                    activeRef.current = "B";
                    fadeTimeoutId = setTimeout(() => {
                        setLayerA(features[nextTargetIdx]);
                    }, FADE_TIME);
                } else {
                    setActiveLayer("A");
                    activeRef.current = "A";
                    fadeTimeoutId = setTimeout(() => {
                        setLayerB(features[nextTargetIdx]);
                    }, FADE_TIME);
                }
            };

            cycleNext();
            intervalId = setInterval(cycleNext, CYCLE_PERIOD);
        }, timeUntilNextCycle);

        return () => {
            clearTimeout(initialTimeout);
            if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    return (
        <div id={id} className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden" }}>
            {layerA && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: activeLayer === "A" ? 0.75 : 0,
                        transition: `opacity ${FADE_TIME}ms ease-in-out`,
                        filter: "blur(2px) brightness(0.65)",
                        pointerEvents: "none"
                    }}
                >
                    <Image
                        src={`/assets/features/${layerA}`}
                        alt="Raider Robotics Feature"
                        fill
                        priority
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>
            )}
            {layerB && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: activeLayer === "B" ? 0.75 : 0,
                        transition: `opacity ${FADE_TIME}ms ease-in-out`,
                        filter: "blur(2px) brightness(0.65)",
                        pointerEvents: "none"
                    }}
                >
                    <Image
                        src={`/assets/features/${layerB}`}
                        alt="Raider Robotics Feature"
                        fill
                        priority
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>
            )}
        </div>
    );
}

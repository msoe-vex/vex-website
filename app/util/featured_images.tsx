"use client";

import { useEffect, useState, useRef } from "react";
import features from "@/app/data/features";
import Image from "next/image";

const DISPLAY_TIME = 4000;
const FADE_TIME = 1500;

function getNextFeature(current: string, featuresList: string[]) {
    if (!featuresList || featuresList.length === 0) return "";
    if (featuresList.length === 1) return featuresList[0];
    let next = current;
    while (next === current) {
        next = featuresList[Math.floor(Math.random() * featuresList.length)];
    }
    return next;
}

/**
 * RandomFeature cycles competition background photographs with seamless double-buffered
 * crossfading behind the canvas and content overlays.
 */
export default function RandomFeature({ id = "", className = "" }: { id?: string; className?: string }) {
    // Lazily initialize initial images
    const [layerA, setLayerA] = useState<string>(() => (features && features.length > 0 ? features[0] : ""));
    const [layerB, setLayerB] = useState<string>(() => (features && features.length > 1 ? features[1] : ""));
    const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
    const activeRef = useRef<"A" | "B">("A");

    useEffect(() => {
        if (!features || features.length <= 1) return;

        const interval = setInterval(() => {
            const currentActive = activeRef.current;
            if (currentActive === "A") {
                setActiveLayer("B");
                activeRef.current = "B";
                setTimeout(() => {
                    setLayerA((prev) => getNextFeature(prev, features));
                }, FADE_TIME);
            } else {
                setActiveLayer("A");
                activeRef.current = "A";
                setTimeout(() => {
                    setLayerB((prev) => getNextFeature(prev, features));
                }, FADE_TIME);
            }
        }, DISPLAY_TIME + FADE_TIME);

        return () => clearInterval(interval);
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
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>
            )}
            {/* Dark vignette overlay for enhanced text readability */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at center, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.85) 100%)",
                    pointerEvents: "none"
                }}
            />
        </div>
    );
}

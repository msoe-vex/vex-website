"use client";

import { useEffect, useRef, useState } from "react";

export interface ArchiveNavigationOptions {
    onSelect?: (targetId: string) => void;
    scrollDelayMs?: number;
}

export function useHashSelection(onSelectOrOptions?: ((targetId: string) => void) | ArchiveNavigationOptions): string | null {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const callbackRef = useRef(onSelectOrOptions);
    callbackRef.current = onSelectOrOptions;

    useEffect(() => {
        let frame = 0;
        let timer = 0;

        const options = typeof callbackRef.current === "function"
            ? { onSelect: callbackRef.current }
            : callbackRef.current ?? {};

        const handleHash = () => {
            const hash = window.location.hash;
            if (!hash.startsWith("#select#")) {
                setHighlightedId(null);
                return;
            }

            const targetId = decodeURIComponent(hash.slice("#select#".length));
            if (!targetId) return;

            setHighlightedId(targetId);
            options.onSelect?.(targetId);

            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                frame = window.requestAnimationFrame(() => {
                    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
                });
            }, options.scrollDelayMs ?? 100);
        };

        handleHash();
        window.addEventListener("hashchange", handleHash);
        return () => {
            window.removeEventListener("hashchange", handleHash);
            window.clearTimeout(timer);
            window.cancelAnimationFrame(frame);
        };
    }, []);

    return highlightedId;
}

export default useHashSelection;


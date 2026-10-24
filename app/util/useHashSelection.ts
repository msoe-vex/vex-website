"use client";

import { useEffect, useState } from "react";

/**
 * Reusable client hook for deep-linking via `#select#<id>`.
 * Automatically listens to window hash changes, tracks the highlighted ID,
 * invokes an optional callback to reset filters (e.g. subsystem or season),
 * and smoothly scrolls the targeted element into view.
 */
export function useHashSelection(onSelect?: (targetId: string) => void): string | null {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash.startsWith("#select#")) {
                const targetId = hash.replace("#select#", "");
                setHighlightedId(targetId);
                if (onSelect) {
                    onSelect(targetId);
                }
                setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }, 100);
            }
        };

        handleHash();
        window.addEventListener("hashchange", handleHash);
        return () => window.removeEventListener("hashchange", handleHash);
    }, [onSelect]);

    return highlightedId;
}

export default useHashSelection;


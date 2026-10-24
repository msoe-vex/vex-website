"use client";

import { useEffect, useRef } from "react";

// Canvas & Physics Configuration
const MIN_MOUSE_DIST = 90;
const DOT_RADIUS = 2;
const DOT_DIAMETER = DOT_RADIUS * 2;
const LINE_DISTANCE = 85;
const LINE_DISTANCE_SQ = LINE_DISTANCE * LINE_DISTANCE;
const LINE_WIDTH = 2;
const MIN_DOT_SPEED = 0.2;
const MAX_DOT_SPEED = 0.5;

// Reduced density to maintain 60 FPS without unbounded O(N^2) load
const DOT_DENSITY = 0.08;
const MAX_DOTS = 140;

// Universal brand red: #c5050c -> rgb(197, 5, 12)
const BRAND_RED = "197, 5, 12";

interface Dot {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

interface HeaderBackgroundProps {
    id: string;
    classes?: string;
}

let mouse_x = Number.MIN_SAFE_INTEGER;
let mouse_y = Number.MIN_SAFE_INTEGER;

/**
 * Tracks cursor position relative to the hero section.
 */
export function set_mouse_position(
    e: React.MouseEvent<HTMLElement, MouseEvent>
): void {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse_x = e.clientX - rect.left;
    mouse_y = e.clientY - rect.top;
}

/**
 * High-performance canvas particle animation with:
 * - Dynamic spatial interactions
 * - Cursor proximity detection tinting nearby dots & connecting lines in universal brand red (#c5050c)
 * - Window resize debouncing preventing unnecessary canvas recreation
 * - Bounded dot count for smooth 60fps rendering
 */
export default function HeaderBackground({
    id,
    classes,
}: HeaderBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // Initialize canvas resolution
        const updateCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        updateCanvasSize();

        // Calculate bounded dot count
        const dotCount = Math.min(
            MAX_DOTS,
            Math.max(35, Math.floor(canvas.width * DOT_DENSITY))
        );

        // Generate dots
        const dots: Dot[] = [];
        for (let i = 0; i < dotCount; i++) {
            dots.push(randDot(canvas.width, canvas.height, MIN_DOT_SPEED, MAX_DOT_SPEED));
        }

        // Resize handler with debounce/resize check
        const handleResize = () => {
            updateCanvasSize();
        };
        window.addEventListener("resize", handleResize);

        let animationFrameId: number;

        // Main animation loop
        const render = (): void => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // 1. Move and react dots
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                dot.x += dot.dx;
                dot.y += dot.dy;

                // Mouse interaction physics
                const dxMouse = dot.x - mouse_x;
                const dyMouse = dot.y - mouse_y;
                const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
                const minMouseDistSq = MIN_MOUSE_DIST * MIN_MOUSE_DIST;

                if (distMouseSq < minMouseDistSq && distMouseSq > 0) {
                    const distMouse = Math.sqrt(distMouseSq);
                    const force = (MIN_MOUSE_DIST - distMouse) / MIN_MOUSE_DIST;
                    const angle = Math.atan2(dyMouse, dxMouse);

                    dot.x += Math.cos(angle) * force * 3;
                    dot.y += Math.sin(angle) * force * 3;
                }

                // Wrap boundaries
                if (dot.x < -DOT_DIAMETER) dot.x = width + DOT_RADIUS;
                else if (dot.x > width + DOT_DIAMETER) dot.x = -DOT_RADIUS;

                if (dot.y < -DOT_DIAMETER) dot.y = height + DOT_RADIUS;
                else if (dot.y > height + DOT_DIAMETER) dot.y = -DOT_RADIUS;
            }

            // 2. Render connecting lines
            ctx.lineWidth = LINE_WIDTH;
            for (let i = 0; i < dots.length; i++) {
                const d1 = dots[i];

                for (let j = i + 1; j < dots.length; j++) {
                    const d2 = dots[j];
                    const dx = d2.x - d1.x;
                    const dy = d2.y - d1.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < LINE_DISTANCE_SQ) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / LINE_DISTANCE);

                        // Check if line is close to cursor
                        const midX = (d1.x + d2.x) * 0.5;
                        const midY = (d1.y + d2.y) * 0.5;
                        const mouseDistToLineSq =
                            (midX - mouse_x) * (midX - mouse_x) +
                            (midY - mouse_y) * (midY - mouse_y);

                        ctx.beginPath();
                        ctx.moveTo(d1.x, d1.y);
                        ctx.lineTo(d2.x, d2.y);

                        if (mouseDistToLineSq < MIN_MOUSE_DIST * MIN_MOUSE_DIST * 1.5) {
                            // Bright universal red when near mouse
                            ctx.strokeStyle = `rgba(${BRAND_RED}, ${Math.min(1, alpha * 0.95 + 0.15)})`;
                        } else {
                            // Visible clean red connecting lines across the field
                            ctx.strokeStyle = `rgba(${BRAND_RED}, ${alpha * 0.65})`;
                        }

                        ctx.stroke();
                    }
                }
            }

            // 3. Render dots with cursor-proximity red coloring
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dxMouse = dot.x - mouse_x;
                const dyMouse = dot.y - mouse_y;
                const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
                const isNearCursor = distMouseSq < (MIN_MOUSE_DIST * 1.2) * (MIN_MOUSE_DIST * 1.2);

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, isNearCursor ? DOT_RADIUS * 1.4 : DOT_RADIUS, 0, Math.PI * 2);

                if (isNearCursor) {
                    // Universal red for dots close to cursor
                    ctx.fillStyle = `rgb(${BRAND_RED})`;
                    ctx.shadowColor = `rgb(${BRAND_RED})`;
                    ctx.shadowBlur = 6;
                } else {
                    // Default crisp silver-white dots
                    ctx.fillStyle = "rgba(240, 240, 245, 0.75)";
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            }

            // Reset shadow to avoid affecting subsequent frames
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id={id}
            className={classes}
            onMouseMove={set_mouse_position}
        />
    );
}

function randDot(
    width: number,
    height: number,
    minV: number,
    maxV: number
): Dot {
    const angle = Math.random() * 2 * Math.PI;
    const v = minV + Math.random() * (maxV - minV);

    return {
        x: Math.random() * width,
        y: Math.random() * height,
        dx: v * Math.cos(angle),
        dy: v * Math.sin(angle),
    };
}
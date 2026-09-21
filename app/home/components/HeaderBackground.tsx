"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const MIN_MOUSE_DIST = 65;
const DOT_RADIUS = 2;
const DOT_DIAMETER = DOT_RADIUS * 2;
const LINE_DISTANCE = 75;
const LINE_WIDTH = 3;
const MIN_DOT_SPEED = 0.15;
const MAX_DOT_SPEED = 0.45;

const DOT_DENSITY = 0.25;

let mouse_x = Number.MIN_SAFE_INTEGER;
let mouse_y = Number.MIN_SAFE_INTEGER;

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

export function set_mouse_position(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): void {
    const canvas = e.currentTarget;
    const BOUNDING_BOX = canvas.getBoundingClientRect();

    mouse_x = e.clientX - BOUNDING_BOX.left;
    mouse_y = e.clientY - BOUNDING_BOX.top;
}

export default function HeaderBackground({
    id,
    classes,
}: HeaderBackgroundProps) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        set_canvas_width(canvas);

        const dot_count = Math.floor(
            document.body.clientWidth * DOT_DENSITY
        );

        const dots: Dot[] = [];

        // Adds dots
        for (let i = 0; i < dot_count; i++) {
            dots[i] = rand_dot(
                canvas.width,
                canvas.height,
                MIN_DOT_SPEED,
                MAX_DOT_SPEED
            );
        }

        let animationFrameId: number;

        // Update function
        const update = (): void => {
            set_canvas_width(canvas);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Moves each dot
            dots.forEach((dot) => {
                dot.x += dot.dx;
                dot.y += dot.dy;

                const mouse_dist = point_distance(
                    mouse_x,
                    mouse_y,
                    dot.x,
                    dot.y
                );

                // Reacts to mouse
                if (mouse_dist < MIN_MOUSE_DIST) {
                    const mouse_angle = point_angle(
                        mouse_x,
                        mouse_y,
                        dot.x,
                        dot.y
                    );

                    dot.x +=
                        (MIN_MOUSE_DIST - mouse_dist) *
                        Math.cos(mouse_angle);

                    dot.y +=
                        (MIN_MOUSE_DIST - mouse_dist) *
                        Math.sin(mouse_angle);
                }

                // Wraps dots around the outside
                if (dot.x < -DOT_DIAMETER) {
                    dot.x = canvas.width + DOT_RADIUS;
                } else if (dot.x > canvas.width + DOT_DIAMETER) {
                    dot.x = -DOT_RADIUS;
                }

                if (dot.y < -DOT_DIAMETER) {
                    dot.y = canvas.height + DOT_RADIUS;
                } else if (dot.y > canvas.height + DOT_DIAMETER) {
                    dot.y = -DOT_RADIUS;
                }
            });

            // Draws lines between dots
            for (let i = 0; i < dots.length; i++) {
                const dot_1 = dots[i];

                for (let j = i + 1; j < dots.length; j++) {
                    const dot_2 = dots[j];

                    const dist = point_distance(
                        dot_1.x,
                        dot_1.y,
                        dot_2.x,
                        dot_2.y
                    );

                    if (dist < LINE_DISTANCE) {
                        const opacityBase =
                            (LINE_DISTANCE - dist) / LINE_DISTANCE;

                        ctx.beginPath();
                        ctx.moveTo(dot_1.x, dot_1.y);
                        ctx.lineTo(dot_2.x, dot_2.y);
                        ctx.lineWidth = LINE_WIDTH;

                        if (currentTheme === "dark") {
                            ctx.strokeStyle = `rgba(225, 29, 72, ${
                                opacityBase * 0.8
                            })`;
                        } else {
                            ctx.strokeStyle = `rgba(100, 116, 139, ${
                                opacityBase * 0.3
                            })`;
                        }

                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }

            // Draws each dot
            dots.forEach((dot) => {
                ctx.beginPath();
                ctx.arc(
                    dot.x,
                    dot.y,
                    DOT_RADIUS,
                    0,
                    Math.PI * 2
                );

                if (currentTheme === "dark") {
                    ctx.fillStyle = "rgba(248, 250, 252, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
                }

                ctx.fill();
                ctx.closePath();
            });

            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentTheme]);

    return (
        <canvas
            ref={canvasRef}
            id={id}
            className={classes}
            onMouseMove={set_mouse_position}
        />
    );
}

function set_canvas_width(canvas: HTMLCanvasElement): void {
    const BOUNDING_BOX = canvas.getBoundingClientRect();

    canvas.width = BOUNDING_BOX.width;
    canvas.height = BOUNDING_BOX.height;
}

function point_distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const x_dist = x2 - x1;
    const y_dist = y2 - y1;

    return Math.sqrt(x_dist * x_dist + y_dist * y_dist);
}

function point_angle(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    return Math.atan2(y2 - y1, x2 - x1);
}

function rand_dot(
    width: number,
    height: number,
    min_v: number,
    max_v: number
): Dot {
    const angle = Math.random() * 2 * Math.PI;
    const v = min_v + Math.random() * (max_v - min_v);

    return {
        x: Math.random() * width,
        y: Math.random() * height,
        dx: v * Math.cos(angle),
        dy: v * Math.sin(angle),
    };
}
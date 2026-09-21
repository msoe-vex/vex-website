"use client";

import { useEffect, useState } from "react";
import features from "@/app/data/features";
import Image from "next/image";

const DISPLAY_TIME = 2.5 * 1000;
const FADE_TIME = 2 * 1000;

function getRandomFeature(current : string) {
    let next = current;

    do {
        next = features[
            Math.floor(Math.random() * features.length)
        ];
    } while (features.length > 1 && next === current);

    return next;
}

function RandomFeature({ id = "", className = "" }: {id?: string, className?: string }) {
    const [current, setCurrent] = useState(() => getRandomFeature(""));
    const [next, setNext] = useState(() => getRandomFeature(current));
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const changeFeature = () => {
            setIsFading(true);

            timer = setTimeout(() => {
                setCurrent(next);
                setIsFading(false);

                timer = setTimeout(changeFeature, DISPLAY_TIME);
            }, FADE_TIME);
            
            setNext(getRandomFeature(current));
        };

        timer = setTimeout(changeFeature, DISPLAY_TIME);
        return () => clearTimeout(timer);
    }, [current, next]);

    return (
        <div id={id} className={className} style={{ position: "relative", width: "100%", height: "700px", overflow: "hidden" }}>
            <Image
                src={`/assets/features/${current}`}
                alt=""
                fill
                style={{ objectFit: "cover", objectPosition: "center", filter: "blur(2px)",
                    opacity: isFading ? 0 : .7,
                    transition: `opacity ${FADE_TIME}ms ease-in-out`
                 }}
            />
            <Image
                src={`/assets/features/${next}`}
                alt=""
                fill
                style={{ objectFit: "cover", objectPosition: "center", filter: "blur(2px)",
                    opacity: isFading ? .7 : 0,
                    transition: `opacity ${FADE_TIME}ms ease-in-out`
                 }}
            />
        </div>
    );
}

export default RandomFeature;
import features from "@/app/data/features";
import Image from "next/image";

function randomFeature() {
    const feature = features[
        Math.floor(Math.random() * features.length)
    ];

    return (
        <div style={{ position: "relative", width: "800px", height: "600px", overflow: "hidden" }}>
            <Image
                src={`/assets/features/${feature}`}
                alt="Random feature"
                fill
                style={{ objectFit: "cover", objectPosition: "center", filter: "blur(8px)" }}
            />
        </div>
    );
}

export default randomFeature;
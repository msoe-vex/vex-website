/**
 * Client-side browser image compression utility.
 * Resizes large raw images (from phone cameras, high-res DSLR) using an HTML Canvas
 * before transmitting to GitHub via API.
 */

export type SupportedImageMime =
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/svg+xml";

export interface CompressedImageResult {
    dataUrl: string;
    base64Data: string;
    mimeType: SupportedImageMime;
    extension: "jpg" | "png" | "webp" | "svg";
}

const MIME_TO_EXT: Record<SupportedImageMime, "jpg" | "png" | "webp" | "svg"> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/svg+xml": "svg",
};

// If a PNG payload in base64 exceeds ~500KB, attempt WebP conversion to save bandwidth
const MAX_PNG_BASE64_LENGTH_BEFORE_WEBP = 700_000;

export async function compressClientImage(
    file: File,
    maxDimension: number = 1200,
    quality: number = 0.85
): Promise<CompressedImageResult> {
    // If it's an SVG, don't rasterize it
    if (file.type === "image/svg+xml") {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                resolve({
                    dataUrl,
                    base64Data: dataUrl.split(",")[1],
                    mimeType: "image/svg+xml",
                    extension: "svg",
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const width = img.naturalWidth || img.width;
                const height = img.naturalHeight || img.height;

                let targetWidth = width;
                let targetHeight = height;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        targetWidth = maxDimension;
                        targetHeight = Math.round((height * maxDimension) / width);
                    } else {
                        targetHeight = maxDimension;
                        targetWidth = Math.round((width * maxDimension) / height);
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    // Fallback to original
                    const rawDataUrl = event.target?.result as string;
                    const mime = (file.type as SupportedImageMime) || "image/jpeg";
                    resolve({
                        dataUrl: rawDataUrl,
                        base64Data: rawDataUrl.split(",")[1],
                        mimeType: mime,
                        extension: MIME_TO_EXT[mime] || "jpg",
                    });
                    return;
                }

                // Smooth resampling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                // Preserve PNG transparency if PNG, otherwise use WebP or JPEG
                let outputMime: SupportedImageMime = file.type === "image/png" ? "image/png" : "image/jpeg";
                let dataUrl = canvas.toDataURL(outputMime, quality);

                // If PNG is still very large, test WebP compression (which also preserves transparency)
                if (outputMime === "image/png" && dataUrl.length > MAX_PNG_BASE64_LENGTH_BEFORE_WEBP) {
                    const webpUrl = canvas.toDataURL("image/webp", quality);
                    if (webpUrl.startsWith("data:image/webp")) {
                        dataUrl = webpUrl;
                        outputMime = "image/webp";
                    }
                }

                const base64Data = dataUrl.split(",")[1];
                resolve({
                    dataUrl,
                    base64Data,
                    mimeType: outputMime,
                    extension: MIME_TO_EXT[outputMime] || "jpg",
                });
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

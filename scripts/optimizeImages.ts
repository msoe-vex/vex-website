import fs from "fs";
import path from "path";
import sharp from "sharp";
import { ASSET_POLICIES, ASSET_DIRECTORIES } from "../app/util/assetPolicy";

interface CompressionRule {
    folder: string;
    maxWidth: number;
    maxHeight: number;
    quality: number;
}

const RULES: CompressionRule[] = ASSET_DIRECTORIES.map((directory) => {
    const policy = ASSET_POLICIES[directory];
    return {
        folder: `public/${directory}`,
        maxWidth: policy.maxDimension,
        maxHeight: policy.maxDimension,
        quality: Math.round(policy.quality * 100),
    };
});

RULES.push(
    {
        // Minimal compression for branding: higher quality, no downscaling unless excessively oversized
        folder: "public/branding",
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 92,
    }
);

async function optimizeImageFile(filePath: string, rule: CompressionRule): Promise<boolean> {
    try {
        const ext = path.extname(filePath).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            return false;
        }

        const originalStats = fs.statSync(filePath);
        const originalBuffer = fs.readFileSync(filePath);
        const image = sharp(originalBuffer).rotate(); // Auto-rotate based on EXIF orientation tag
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            return false;
        }

        const needsResize = metadata.width > rule.maxWidth || metadata.height > rule.maxHeight;
        const hasExifRotation = metadata.orientation && metadata.orientation !== 1;

        // Don't re-compress files that are already tiny, adequately sized, and don't need rotation
        if (!needsResize && !hasExifRotation && originalStats.size < 200 * 1024) {
            return false;
        }

        let pipeline = sharp(originalBuffer)
            .rotate() // Explicitly auto-rotates based on EXIF orientation tag so pixels match displayed orientation
            .resize({
                width: rule.maxWidth,
                height: rule.maxHeight,
                fit: "inside",
                withoutEnlargement: true,
            });

        if (ext === ".jpg" || ext === ".jpeg") {
            pipeline = pipeline.jpeg({
                quality: rule.quality,
                mozjpeg: true,
            });
        } else if (ext === ".png") {
            pipeline = pipeline.png({
                compressionLevel: 9,
                effort: 8,
            });
        } else if (ext === ".webp") {
            pipeline = pipeline.webp({
                quality: rule.quality,
                effort: 6,
            });
        }

        const optimizedBuffer = await pipeline.toBuffer();

        // Only overwrite if it saved meaningful space (> 5%) or shrank oversized resolution
        const savedBytes = originalStats.size - optimizedBuffer.length;
        if (savedBytes > originalStats.size * 0.05 || (needsResize && savedBytes > 0)) {
            fs.writeFileSync(filePath, optimizedBuffer);
            const savedPct = ((savedBytes / originalStats.size) * 100).toFixed(1);
            console.log(
                `  ✓ Compressed ${path.basename(filePath)}: ${(originalStats.size / 1024).toFixed(0)}KB -> ${(optimizedBuffer.length / 1024).toFixed(0)}KB (${savedPct}% saved)`
            );
            return true;
        }

        return false;
    } catch (err) {
        console.warn(`  ⚠ Could not optimize ${filePath}:`, err instanceof Error ? err.message : err);
        return false;
    }
}

export default async function optimizeImages(): Promise<void> {
    console.log("Checking image compression & dimensions...");
    let totalOptimized = 0;

    for (const rule of RULES) {
        const dirPath = path.join(process.cwd(), rule.folder);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            if (file.startsWith(".")) continue;
            const fullPath = path.join(dirPath, file);
            if (!fs.statSync(fullPath).isFile()) continue;

            const didOptimize = await optimizeImageFile(fullPath, rule);
            if (didOptimize) {
                totalOptimized++;
            }
        }
    }

    if (totalOptimized > 0) {
        console.log(`Optimized ${totalOptimized} image(s) for faster page loads.`);
    } else {
        console.log("All images are already optimally compressed!");
    }
}

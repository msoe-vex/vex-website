import fs from "fs";
import path from "path";
import QRCode from "qrcode";

interface GenerateQrOptions {
    url?: string;
    outPath?: string;
    logoPath?: string;
    size?: number;
    margin?: number;
    qrColor?: string;
    accentColor?: string;
    bgColor?: string;
}

/**
 * Checks if a given row/col module belongs to one of the 3 corner Finder Patterns (7x7 eyes).
 */
function isFinderPattern(r: number, c: number, count: number): boolean {
    const isTopLeft = r <= 6 && c <= 6;
    const isTopRight = r <= 6 && c >= count - 7;
    const isBottomLeft = r >= count - 7 && c <= 6;
    return isTopLeft || isTopRight || isBottomLeft;
}

/**
 * Generates an SVG QR code with:
 * - Brand red (#c5050c) corner finder eyes
 * - Raider Robotics corner chamfer brackets
 * - Borderless clean center shield with embedded RR logo
 * - Error correction Level 'H' (~30% redundancy) for high scannability
 */
export async function generateQrCodeWithLogo({
    url = "https://www.msoevex.com/redirect",
    outPath = "public/branding/qr-rickroll.svg",
    logoPath = "public/branding/RR_Icon.png",
    size = 1024,
    margin = 4,
    qrColor = "#0d0d0d",
    accentColor = "#c5050c",
    bgColor = "#ffffff"
}: GenerateQrOptions = {}): Promise<string> {
    const cwd = process.cwd();
    const resolvedOutPath = path.isAbsolute(outPath) ? outPath : path.join(cwd, outPath);
    const resolvedLogoPath = path.isAbsolute(logoPath) ? logoPath : path.join(cwd, logoPath);

    // 1. Generate QR matrix with high error correction (Level 'H')
    const qrCode = QRCode.create(url, {
        errorCorrectionLevel: "H"
    });

    const moduleCount = qrCode.modules.size;
    const totalCells = moduleCount + margin * 2;
    const cellSize = size / totalCells;

    // 2. Determine center logo dimensions (~28% of total QR size for prominent branding)
    const logoRatio = 0.28;
    const logoBoxSize = size * logoRatio;
    const logoBoxX = (size - logoBoxSize) / 2;
    const logoBoxY = (size - logoBoxSize) / 2;

    // 3. Collect module rectangles, separating regular modules and red finder pattern modules
    const regularModules: string[] = [];
    const redFinderModules: string[] = [];
    const bufferZone = cellSize * 0.4;

    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (qrCode.modules.get(r, c)) {
                const x = (c + margin) * cellSize;
                const y = (r + margin) * cellSize;

                // Skip modules covered by the center logo shield
                const isInLogoBox =
                    x + cellSize > logoBoxX - bufferZone &&
                    x < logoBoxX + logoBoxSize + bufferZone &&
                    y + cellSize > logoBoxY - bufferZone &&
                    y < logoBoxY + logoBoxSize + bufferZone;

                if (!isInLogoBox) {
                    const rect = `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" />`;
                    if (isFinderPattern(r, c, moduleCount)) {
                        redFinderModules.push(rect);
                    } else {
                        regularModules.push(rect);
                    }
                }
            }
        }
    }

    // 4. Read and Base64-encode the logo
    let logoDataUri = "";
    if (fs.existsSync(resolvedLogoPath)) {
        const logoBuffer = fs.readFileSync(resolvedLogoPath);
        const ext = path.extname(resolvedLogoPath).toLowerCase().replace(".", "");
        const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
        logoDataUri = `data:${mime};base64,${logoBuffer.toString("base64")}`;
    } else {
        console.warn(`[generateQr] Warning: Logo file not found at ${resolvedLogoPath}. Generating QR without centered image.`);
    }

    // 5. Build corner decorative brackets
    const bracketInset = Math.round(size * 0.02);
    const bracketLen = Math.round(size * 0.06);
    const bracketStroke = Math.max(3, Math.round(size * 0.005));
    const chamferCut = Math.round(size * 0.025);

    const cornerBrackets = `
    <!-- Raider Robotics Brand Red Corner Accents -->
    <g id="corner-brackets" stroke="${accentColor}" stroke-width="${bracketStroke}" fill="none" stroke-linecap="square">
        <!-- Top-Left -->
        <path d="M ${bracketInset + bracketLen} ${bracketInset} L ${bracketInset} ${bracketInset} L ${bracketInset} ${bracketInset + bracketLen}" />
        <!-- Top-Right -->
        <path d="M ${size - bracketInset - bracketLen} ${bracketInset} L ${size - bracketInset} ${bracketInset} L ${size - bracketInset} ${bracketInset + bracketLen}" />
        <!-- Bottom-Left with Angular Brand Chamfer (y = -x) -->
        <path d="M ${bracketInset} ${size - bracketInset - bracketLen} L ${bracketInset} ${size - bracketInset - chamferCut} L ${bracketInset + chamferCut} ${size - bracketInset} L ${bracketInset + bracketLen} ${size - bracketInset}" />
        <!-- Bottom-Right -->
        <path d="M ${size - bracketInset} ${size - bracketInset - bracketLen} L ${size - bracketInset} ${size - bracketInset} L ${size - bracketInset - bracketLen} ${size - bracketInset}" />
    </g>`;

    // Center logo layout (borderless shield)
    const borderRadius = Math.round(logoBoxSize * 0.12);
    const logoPadding = Math.round(logoBoxSize * 0.05);
    const innerLogoSize = logoBoxSize - logoPadding * 2;
    const innerLogoX = logoBoxX + logoPadding;
    const innerLogoY = logoBoxY + logoPadding;

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <!-- Background -->
    <rect width="${size}" height="${size}" fill="${bgColor}" />

    ${cornerBrackets}

    <!-- Regular QR Data Modules -->
    <g id="qr-modules-black" fill="${qrColor}">
        ${regularModules.join("\n        ")}
    </g>

    <!-- Brand Red Finder Patterns (3 Corner Eyes) -->
    <g id="qr-finder-eyes-red" fill="${accentColor}">
        ${redFinderModules.join("\n        ")}
    </g>

    <!-- Center Logo Shield (Clean, borderless background) -->
    <g id="center-logo">
        <rect
            x="${logoBoxX.toFixed(2)}"
            y="${logoBoxY.toFixed(2)}"
            width="${logoBoxSize.toFixed(2)}"
            height="${logoBoxSize.toFixed(2)}"
            rx="${borderRadius}"
            ry="${borderRadius}"
            fill="${bgColor}"
            stroke="none"
        />

        ${
            logoDataUri
                ? `<!-- Embedded Raider Robotics Logo -->
        <image
            x="${innerLogoX.toFixed(2)}"
            y="${innerLogoY.toFixed(2)}"
            width="${innerLogoSize.toFixed(2)}"
            height="${innerLogoSize.toFixed(2)}"
            href="${logoDataUri}"
            preserveAspectRatio="xMidYMid meet"
        />`
                : ""
        }
    </g>
</svg>
`;

    // Ensure output directory exists
    const outDir = path.dirname(resolvedOutPath);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(resolvedOutPath, svgContent, "utf8");
    console.log(`[generateQr] Successfully generated QR code: ${resolvedOutPath}`);
    console.log(`  Target URL: ${url}`);
    console.log(`  Dimensions: ${size}x${size}px`);
    console.log(`  Corner Eyes & Accents: ${accentColor}`);
    console.log(`  Border: none (borderless shield)`);
    console.log(`  Center Logo: ${logoPath}`);

    return resolvedOutPath;
}

// CLI Execution Handler
async function main() {
    const args = process.argv.slice(2);
    const getArg = (flag: string, fallback?: string): string | undefined => {
        const idx = args.indexOf(flag);
        if (idx !== -1 && idx + 1 < args.length) {
            return args[idx + 1];
        }
        return fallback;
    };

    const url = getArg("--url", "https://www.msoevex.com/redirect");
    const out = getArg("--out", "public/branding/qr-rickroll.svg");
    const logo = getArg("--logo", "public/branding/RR_Icon.png");
    const sizeStr = getArg("--size", "1024");
    const size = sizeStr ? parseInt(sizeStr, 10) : 1024;

    try {
        await generateQrCodeWithLogo({
            url,
            outPath: out,
            logoPath: logo,
            size
        });
    } catch (err) {
        console.error("[generateQr] Error generating QR code:", err);
        process.exit(1);
    }
}

// Run CLI when invoked directly
if (process.argv[1]?.includes("generateQr")) {
    main();
}

export default generateQrCodeWithLogo;

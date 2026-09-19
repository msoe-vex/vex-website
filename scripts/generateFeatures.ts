import fs from "fs";
import path from "path";

async function generateFeatures() {
    const featuresDir = path.join(process.cwd(), "public/assets/features");
    const files = fs.readdirSync(featuresDir)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort();

    const output = `const features: string[] = ${JSON.stringify(files)};

export default features;
`;

    fs.writeFileSync(
        path.join(process.cwd(), "app/data/features.ts"),
        output
    );

    console.log(`Generated ${files.length} features in app/data/features.ts`);
}

export default generateFeatures;
export const ASSET_DIRECTORIES = ["assets/members", "assets/projects", "assets/donors", "assets/features"] as const;
export type AssetDirectory = (typeof ASSET_DIRECTORIES)[number];

export const ASSET_POLICIES: Record<AssetDirectory, { maxDimension: number; quality: number }> = {
    "assets/members": { maxDimension: 800, quality: 0.82 },
    "assets/projects": { maxDimension: 1200, quality: 0.82 },
    "assets/donors": { maxDimension: 800, quality: 0.85 },
    "assets/features": { maxDimension: 1920, quality: 0.82 },
};

export function getAssetPolicy(directory: AssetDirectory) {
    return ASSET_POLICIES[directory];
}

export function getAssetWebPath(directory: AssetDirectory, filename: string): string {
    return `/${directory}/${filename}`;
}

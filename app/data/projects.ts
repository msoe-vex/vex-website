export interface Project {
    id: string;
    title: string;
    season: string;
    orderIndex: number; // Higher numbers represent later in the season (displayed first)
    description: string;
    image?: string;
    githubUrl?: string;
    awards?: string[];
    highlights?: string[];
}

export const projects: Project[] = [
{
        id: "high-stakes-15",
        title: "High Stakes 15\" Robot",
        season: "2024-2025",
        orderIndex: 2,
        description: "Our 15-inch compact robot designed to climb the 4' tall ladder at the center of the field, then later pull up our 24\" robot for a high-scoring buddy climb.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Design Award Finalist"],
        highlights: [
            "Hot-swappable wing mechanism capable of scoring on the high stake",
            "Custom 10-motor block used to power the climb and pull"
        ]
    },
{
        id: "high-stakes-24",
        title: "High Stakes 24\" Robot",
        season: "2024-2025",
        orderIndex: 1,
        description: "The primary 24-inch robot built for mobile goal manipulation, consistent ring scoring, and drivetrain supremacy.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Tournament Finalist"],
        highlights: [
            "Automatic ring color sorting",
            "Heavy-duty PTO between the drivetrain and lift arms",
            "Transmission capable of switching drivetrain between 600 and 120 rpm"
        ]
    },
{
        id: "over-under-robot",
        title: "Over Under Robot",
        season: "2023-2024",
        orderIndex: 3,
        description: "Competed at VEX U World Championship with rapid triball sorting, dynamic barrier clearing, and high-tier elevation.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["VEX U Worlds Division Semifinalist", "Innovate Award"],
        highlights: [
            "High-speed 600 RPM pneumatic triball puncher",
            "Dynamic PTO (Power Take-Off) drivetrain to elevation arms",
            "Full PID autonomous positioning"
        ]
    },
{
        id: "spin-up-robot",
        title: "Spin Up Robot",
        season: "2022-2023",
        orderIndex: 1,
        description: "Built for high-velocity disc shooting into the elevated high goal and rapid expansion across endgame tiles.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Robot Skills Finalist"],
        highlights: [
            "Dual-flywheel 3600 RPM speed shooter",
            "Pneumatic cylinder string launcher for endgame expansion",
            "Optical sensor disc indexing"
        ]
    },
{
        id: "tipping-point-robot",
        title: "Tipping Point Robot",
        season: "2021-2022",
        orderIndex: 1,
        description: "Engineered for rapid mobile goal possession, platform balancing, and high-branch ring placement.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Judges Award"],
        highlights: [
            "Four-bar pneumatic goal lift mechanism",
            "Direct-drive high traction omni-wheel base",
            "Anti-tip outrigger stabilizers"
        ]
    }
];

/**
 * Comparator sorting primarily by season descending and secondarily by orderIndex descending.
 */
export function compareProjects(a: Project, b: Project): number {
    if (a.season !== b.season) {
        return b.season.localeCompare(a.season);
    }
    return b.orderIndex - a.orderIndex;
}

/**
 * Returns a sorted clone of the projects list.
 */
export function getSortedProjects(list: Project[] = projects): Project[] {
    return [...list].sort(compareProjects);
}

/**
 * Dynamically derives unique sorted seasons from the projects archive with "All" prepended.
 */
export function getAvailableSeasons(list: Project[] = projects): string[] {
    const seasonSet = new Set(list.map((p) => p.season));
    const sorted = Array.from(seasonSet).sort().reverse();
    return ["All", ...sorted];
}

export default projects;

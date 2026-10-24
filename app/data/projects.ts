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
        description: "Our 15-inch compact robot designed for rapid ring scoring, high-stake ladder climbs, and precision mobile goal control.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Design Award Finalist"],
        highlights: [
            "Pneumatic ring intake clamp",
            "Custom 6-motor 450 RPM direct drive base",
            "Sub-system odometry tracking with dual optical encoders"
        ]
    },
    {
        id: "high-stakes-24",
        title: "High Stakes 24\" Robot",
        season: "2024-2025",
        orderIndex: 1,
        description: "The primary 24-inch robot built for expansive field coverage, mobile goal manipulation, and multi-tier ladder traversal.",
        image: "/branding/RR_Logo.png",
        githubUrl: "https://github.com/msoe-vex",
        awards: ["Tournament Finalist"],
        highlights: [
            "Heavy-duty planetary gear lift mechanism",
            "Multi-sensor autonomous ring filtering",
            "Reinforced aluminum chassis with low center-of-gravity"
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

import type { Member } from "@/app/data/members";
import type { Project } from "@/app/data/projects";
import type { RecurringEvent, CustomEvent } from "@/app/data/events";
import type { Donor } from "@/app/data/donors";
import { locales } from "@/app/data/locales";

function formatJsObject(obj: unknown, indent = 4): string {
    const pad = " ".repeat(indent);
    const innerPad = " ".repeat(indent + 4);

    if (obj === null || obj === undefined) {
        return "undefined";
    }

    if (typeof obj === "string") {
        return JSON.stringify(obj);
    }

    if (typeof obj === "number" || typeof obj === "boolean") {
        return String(obj);
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        // If array of primitives and short, inline them
        if (obj.every((x) => typeof x === "string" || typeof x === "number")) {
            const inlined = `[${obj.map((x) => JSON.stringify(x)).join(", ")}]`;
            if (inlined.length < 70) {
                return inlined;
            }
        }
        const items = obj.map((item) => `${innerPad}${formatJsObject(item, indent + 4)}`).join(",\n");
        return `[\n${items}\n${pad}]`;
    }

    if (typeof obj === "object") {
        const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
        if (entries.length === 0) return "{}";
        const lines = entries.map(([key, val]) => {
            const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
            return `${innerPad}${formattedKey}: ${formatJsObject(val, indent + 4)}`;
        });
        return `{\n${lines.join(",\n")}\n${pad}}`;
    }

    return String(obj);
}

export function generateMembersTs(members: Member[]): string {
    const membersContent = members
        .map((m) => {
            const filtered: Record<string, unknown> = {
                id: m.id,
                name: m.name,
                role: m.role,
                subsystems: m.subsystems,
                status: m.status,
            };
            if (m.gradYear) filtered.gradYear = m.gradYear;
            if (m.major) filtered.major = m.major;
            if (m.image) filtered.image = m.image;
            if (m.github) filtered.github = m.github;
            if (m.linkedin) filtered.linkedin = m.linkedin;
            if (m.contributions) filtered.contributions = m.contributions;
            return formatJsObject(filtered, 4);
        })
        .join(",\n");

    return `export type SubsystemRole = "Controls" | "Design" | "Eboard";
export type MemberStatus = "active" | "alumni";

export const SUBSYSTEM_ROLES: (SubsystemRole | "All")[] = ["All", "Controls", "Design", "Eboard"];

export interface Member {
    id: string;
    name: string;
    role: string;
    subsystems: SubsystemRole[];
    subsystem?: SubsystemRole;
    status: MemberStatus;
    gradYear?: number;
    major?: string;
    image?: string;
    github?: string;
    linkedin?: string;
    contributions?: string;
}

export const members: Member[] = [
${membersContent}
];

export default members;
`;
}

export function generateProjectsTs(projects: Project[]): string {
    const projectsContent = projects
        .map((p) => {
            const filtered: Record<string, unknown> = {
                id: p.id,
                title: p.title,
                season: p.season,
                orderIndex: p.orderIndex,
                description: p.description,
            };
            if (p.image) filtered.image = p.image;
            if (p.githubUrl) filtered.githubUrl = p.githubUrl;
            if (p.awards && p.awards.length > 0) filtered.awards = p.awards;
            if (p.highlights && p.highlights.length > 0) filtered.highlights = p.highlights;
            return formatJsObject(filtered, 4);
        })
        .join(",\n");

    return `export interface Project {
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
${projectsContent}
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
`;
}

export function generateEventsTs(
    recurring: RecurringEvent[],
    custom: CustomEvent[]
): string {
    const recurringContent = recurring.map((e) => formatJsObject(e, 4)).join(",\n");
    const customContent = custom.map((e) => formatJsObject(e, 4)).join(",\n");

    return `export interface BaseEvent {
    id: string;
    title: string;
    description?: string;
    time: string; // e.g. "6:00 PM - 8:00 PM"
    location: string;
    locationUrl?: string;
}

export interface RecurringEvent extends BaseEvent {
    dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    frequency?: string; // e.g. "Weekly"
}

export interface CustomEvent extends BaseEvent {
    date: string; // Month Day, Year e.g. "November 14, 2026"
    category: "Competition" | "Outreach" | "Workshop" | "Social";
}

export const STEM_CENTER_URL = "https://www.msoe.edu/about-msoe/k-12-stem-at-msoe/we-energies-stem-center/";
export const DEFAULT_LOCATION = "We Energies STEM Center at MSOE";

export const recurringEvents: RecurringEvent[] = [
${recurringContent}
];

export const customEvents: CustomEvent[] = [
${customContent}
];

const eventsData = {
    recurringEvents,
    customEvents
};

export default eventsData;
`;
}

export function generateDonorsTs(donors: Donor[]): string {
    const donorsContent = donors.map((d) => formatJsObject(d, 4)).join(",\n");

    return `export interface Donor {
    alt: string;
    img: string;
    link: string;
};

export const donors: Donor[] = [
${donorsContent}
];

export default donors;
`;
}

export function generateAnnouncementsTs(showBanner: boolean): string {
    return `import { recurringEvents, DEFAULT_LOCATION } from "./events";

export interface Announcement {
    show: boolean;
    text: string;
    date?: string;
    location?: string;
    link?: string;
    eventId?: string;
}

/**
 * Computes the upcoming meeting text dynamically based on the current day of the week:
 * - Mondays: General Team Meeting & Collaboration at 6:00 PM (id: rec-meeting-mon)
 * - Wednesdays: General Team Meeting & Collaboration at 6:00 PM (id: rec-meeting-wed)
 * - Fridays: General Team Meeting & Collaboration at 6:00 PM (id: rec-meeting-fri)
 */
export function getNextMeetingDetails(): {
    text: string;
    dateStr: string;
    location: string;
    eventId: string;
    link: string;
} {
    const now = new Date();
    const day = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat

    let meetingDayName = "Monday";
    let eventId = "rec-meeting-mon";

    if (day === 1) {
        meetingDayName = "Today (Monday)";
        eventId = "rec-meeting-mon";
    } else if (day === 2) {
        meetingDayName = "Wednesday";
        eventId = "rec-meeting-wed";
    } else if (day === 3) {
        meetingDayName = "Today (Wednesday)";
        eventId = "rec-meeting-wed";
    } else if (day === 4) {
        meetingDayName = "Friday";
        eventId = "rec-meeting-fri";
    } else if (day === 5) {
        meetingDayName = "Today (Friday)";
        eventId = "rec-meeting-fri";
    } else {
        meetingDayName = "Monday";
        eventId = "rec-meeting-mon";
    }

    const targetEvent = recurringEvents.find((e) => e.id === eventId);
    const meetingTime = targetEvent ? targetEvent.time.split(" - ")[0] : "6:00 PM";
    const meetingType = targetEvent ? targetEvent.title : "General Team Meeting and Collaboration";

    const text = \`Next Meeting: \${meetingDayName} at \${meetingTime} (\${meetingType}) at the \${DEFAULT_LOCATION}\`;
    const link = \`/events#select#\${eventId}\`;

    return {
        text,
        dateStr: \`\${meetingDayName} @ \${meetingTime}\`,
        location: DEFAULT_LOCATION,
        eventId,
        link
    };
}

export const meetingAnnouncement: Announcement = {
    show: ${showBanner ? "true" : "false"},
    ...(() => {
        const details = getNextMeetingDetails();
        return {
            text: details.text,
            date: details.dateStr,
            location: details.location,
            eventId: details.eventId,
            link: details.link
        };
    })()
};

export default meetingAnnouncement;
`;
}

export function generateLocalesTs(localesData: typeof locales): string {
    const formatted = formatJsObject(localesData, 0);
    return `/**
 * Static UI text and copy for all pages across the Raider Robotics website.
 * Centralized here for easy updating without modifying UI components.
 */
export const locales = ${formatted};

export default locales;
`;
}


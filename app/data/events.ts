export interface BaseEvent {
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
    {
        id: "rec-meeting-mon",
        title: "General Team Meeting and Collaboration",
        dayOfWeek: "Monday",
        frequency: "Weekly",
        time: "6:00 PM - 9:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Work on robot and related systems."
    },
    {
        id: "rec-meeting-wed",
        title: "General Team Meeting and Collaboration",
        dayOfWeek: "Wednesday",
        frequency: "Weekly",
        time: "6:00 PM - 9:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Work on robot and related systems."
    },
    {
        id: "rec-meeting-fri",
        title: "General Team Meeting and Collaboration",
        dayOfWeek: "Friday",
        frequency: "Weekly",
        time: "6:00 PM - 9:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Work on robot and related systems."
    }
];

export const customEvents: CustomEvent[] = [
    // {
    //     id: "evt-kickoff",
    //     title: "VEX U Season Strategy Workshop",
    //     date: "September 12, 2026",
    //     category: "Workshop",
    //     time: "10:00 AM - 4:00 PM",
    //     location: DEFAULT_LOCATION,
    //     locationUrl: STEM_CENTER_URL,
    //     description: "In-depth game analysis, rules breakdown, CAD brainstorm, and subsystem assignment."
    // },
];

const eventsData = {
    recurringEvents,
    customEvents
};

export default eventsData;

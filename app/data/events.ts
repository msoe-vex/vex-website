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
        id: "rec-general-meeting",
        title: "Weekly General Team Meeting",
        dayOfWeek: "Thursday",
        frequency: "Weekly",
        time: "6:00 PM - 8:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Full team sync covering weekly sprint updates, subsystem milestones, match strategies, and open workshop hours."
    },
    {
        id: "rec-build-session",
        title: "Subsystem Build & CAD Open Lab",
        dayOfWeek: "Tuesday",
        frequency: "Weekly",
        time: "5:30 PM - 8:30 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Dedicated prototyping, CNC milling, 3D printing, and mechanical robot assembly."
    },
    {
        id: "rec-controls-session",
        title: "Controls & Autonomous Programming",
        dayOfWeek: "Wednesday",
        frequency: "Weekly",
        time: "6:00 PM - 8:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Autonomous pathing tuning, odometry calibration, PID testing, and driver practice on the official game field."
    }
];

export const customEvents: CustomEvent[] = [
    {
        id: "evt-kickoff",
        title: "VEX U Season Strategy Workshop",
        date: "September 12, 2026",
        category: "Workshop",
        time: "10:00 AM - 4:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "In-depth game analysis, rules breakdown, CAD brainstorm, and subsystem assignment."
    },
    {
        id: "evt-midwest-qualifier",
        title: "Midwest VEX U Invitational",
        date: "December 05, 2026",
        category: "Competition",
        time: "8:00 AM - 6:00 PM",
        location: "Purdue University Armory",
        locationUrl: "https://www.purdue.edu/",
        description: "Collegiate regional qualifier competing against Midwest universities for World Championship qualification slots."
    },
    {
        id: "evt-stem-outreach",
        title: "MSOE STEM Center Youth Robotics Day",
        date: "February 20, 2027",
        category: "Outreach",
        time: "9:00 AM - 2:00 PM",
        location: DEFAULT_LOCATION,
        locationUrl: STEM_CENTER_URL,
        description: "Mentoring high school and middle school VEX V5 teams, running live demo matches, and judging practice skills."
    },
    {
        id: "evt-vex-worlds",
        title: "VEX U World Championship 2027",
        date: "April 24 - April 27, 2027",
        category: "Competition",
        time: "All Day",
        location: "Kay Bailey Hutchison Convention Center, Dallas, TX",
        locationUrl: "https://www.vexrobotics.com/vexu",
        description: "The pinnacle collegiate championship featuring top international university robotics programs."
    }
];

const eventsData = {
    recurringEvents,
    customEvents,
    DEFAULT_LOCATION,
    STEM_CENTER_URL
};

export default eventsData;

import { DEFAULT_LOCATION } from "./events";

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
 * - Tuesdays: Build & CAD lab at 5:30 PM (id: rec-build-session)
 * - Wednesdays: Controls & Autonomous at 6:00 PM (id: rec-controls-session)
 * - Thursdays: General team meeting at 6:00 PM (id: rec-general-meeting)
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

    let meetingDayName = "Tuesday";
    let meetingTime = "5:30 PM";
    let meetingType = "Build & CAD Lab";
    let eventId = "rec-build-session";

    if (day === 4) {
        meetingDayName = "Today (Thursday)";
        meetingTime = "6:00 PM";
        meetingType = "General Team Meeting";
        eventId = "rec-general-meeting";
    } else if (day === 3) {
        meetingDayName = "Today (Wednesday)";
        meetingTime = "6:00 PM";
        meetingType = "Controls Programming";
        eventId = "rec-controls-session";
    } else if (day === 2) {
        meetingDayName = "Today (Tuesday)";
        meetingTime = "5:30 PM";
        meetingType = "Build & CAD Lab";
        eventId = "rec-build-session";
    } else if (day > 4) {
        // Friday or Saturday -> Next is Tuesday build session
        meetingDayName = "Tuesday";
        meetingTime = "5:30 PM";
        meetingType = "Build & CAD Lab";
        eventId = "rec-build-session";
    }

    const text = `Next Meeting: ${meetingDayName} at ${meetingTime} (${meetingType}) at the ${DEFAULT_LOCATION}`;
    const link = `/events#select#${eventId}`;

    return {
        text,
        dateStr: `${meetingDayName} @ ${meetingTime}`,
        location: DEFAULT_LOCATION,
        eventId,
        link
    };
}

export const meetingAnnouncement: Announcement = {
    show: true,
    text: "Next Meeting: Tuesday at 5:30 PM (Build & CAD Lab) at the We Energies STEM Center at MSOE",
    date: "Tuesday @ 5:30 PM",
    location: DEFAULT_LOCATION,
    eventId: "rec-build-session",
    link: "/events#select#rec-build-session"
};

export default meetingAnnouncement;

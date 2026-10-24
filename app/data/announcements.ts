import { DEFAULT_LOCATION } from "./events";

export interface Announcement {
    show: boolean;
    text: string;
    date?: string;
    location?: string;
    link?: string;
}

/**
 * Computes the upcoming meeting text dynamically based on the current day of the week:
 * - Tuesdays: Build & CAD lab at 5:30 PM
 * - Thursdays: General team meeting at 6:00 PM
 */
export function getNextMeetingText(): { text: string; dateStr: string; location: string } {
    const now = new Date();
    const day = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat

    let meetingDayName = "Tuesday";
    let meetingTime = "5:30 PM";
    let meetingType = "Build & CAD Lab";

    if (day === 3 || day === 4) {
        meetingDayName = "Thursday";
        meetingTime = "6:00 PM";
        meetingType = "General Team Meeting";
    } else if (day === 2) {
        meetingDayName = "Today (Tuesday)";
        meetingTime = "5:30 PM";
        meetingType = "Build & CAD Lab";
    }

    const text = `Next Meeting: ${meetingDayName} at ${meetingTime} (${meetingType}) at the ${DEFAULT_LOCATION}`;
    return { text, dateStr: `${meetingDayName} @ ${meetingTime}`, location: DEFAULT_LOCATION };
}

export const meetingAnnouncement: Announcement = {
    show: true,
    text: "Next Meeting: Tuesday at 5:30 PM (Build & CAD Lab) at the We Energies STEM Center at MSOE",
    date: "Tuesday @ 5:30 PM",
    location: DEFAULT_LOCATION,
    link: "/events"
};

export default meetingAnnouncement;

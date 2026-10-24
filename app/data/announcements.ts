import { recurringEvents, DEFAULT_LOCATION } from "./events";

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
        // Saturday (6) or Sunday (0) -> Next is Monday
        meetingDayName = "Monday";
        eventId = "rec-meeting-mon";
    }

    const targetEvent = recurringEvents.find((e) => e.id === eventId);
    const meetingTime = targetEvent ? targetEvent.time.split(" - ")[0] : "6:00 PM";
    const meetingType = targetEvent ? targetEvent.title : "General Team Meeting and Collaboration";

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

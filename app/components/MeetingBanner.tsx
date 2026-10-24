"use client";

import { useState } from "react";
import meetingAnnouncement, { getNextMeetingText } from "@/app/data/announcements";
import Link from "next/link";

/**
 * Top announcement strip highlighting the next upcoming team meeting.
 * Scrolls naturally with the page content above the navigation bar.
 */
export default function MeetingBanner() {
    // Initialize announcement text directly from dynamic calculation without synchronous set-state in effect
    const [announcementText] = useState(() => getNextMeetingText().text);

    if (!meetingAnnouncement.show) return null;

    return (
        <aside className="w-full bg-[#111113] border-b-2 border-[#c5050c] text-white text-xs sm:text-sm font-sans tracking-wide">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#c5050c] rotate-45 animate-pulse" />
                    <span className="font-semibold text-gray-200">
                        {announcementText}
                    </span>
                </div>
                {meetingAnnouncement.link && (
                    <Link
                        href={meetingAnnouncement.link}
                        className="text-[#f87171] hover:text-white underline underline-offset-2 transition-colors uppercase font-bold text-xs"
                    >
                        Directions / Calendar →
                    </Link>
                )}
            </div>
        </aside>
    );
}

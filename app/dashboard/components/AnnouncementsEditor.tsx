"use client";

import { getNextMeetingDetails } from "@/app/data/announcements";

interface AnnouncementsEditorProps {
    showBanner: boolean;
    onChange: (show: boolean) => void;
}

export default function AnnouncementsEditor({
    showBanner,
    onChange,
}: AnnouncementsEditorProps) {
    const details = getNextMeetingDetails();

    return (
        <div className="bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-4">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-white">
                        Meeting Announcement Banner
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Controls the top announcement bar visible across the entire website.
                    </p>
                </div>
            </div>

            <div className="bg-[#1a1a1d] border border-[#2c2c30] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-white block">
                            Banner Visibility
                        </span>
                        <span className="text-[11px] text-gray-400">
                            When enabled, shows the upcoming meeting time and STEM Center location at the top of every page.
                        </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showBanner}
                            onChange={(e) => onChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2a2a2e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c5050c]" />
                    </label>
                </div>

                <div className="mt-2 pt-4 border-t border-[#26262a]">
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-2">
                        Computed Banner Live Preview
                    </span>

                    {showBanner ? (
                        <div className="bg-[#202024] border-l-4 border-[#c5050c] p-3 text-xs text-white flex items-center justify-between">
                            <span className="font-medium">{details.text}</span>
                            <span className="bg-[#c5050c] text-white text-[10px] uppercase font-bold px-2 py-0.5 ml-2 flex-shrink-0">
                                Details &rarr;
                            </span>
                        </div>
                    ) : (
                        <div className="bg-[#171719] border border-dashed border-[#333] p-3 text-xs text-gray-500 italic">
                            Announcement banner is currently hidden.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


"use client";

import { useState } from "react";
import type { RecurringEvent, CustomEvent } from "@/app/data/events";
import { DEFAULT_LOCATION, STEM_CENTER_URL } from "@/app/data/events";

interface EventsEditorProps {
    recurringEvents: RecurringEvent[];
    customEvents: CustomEvent[];
    onChange: (recurring: RecurringEvent[], custom: CustomEvent[]) => void;
}

export default function EventsEditor({
    recurringEvents,
    customEvents,
    onChange,
}: EventsEditorProps) {
    const [activeTab, setActiveTab] = useState<"recurring" | "custom">("recurring");

    // Recurring Events handlers
    const handleUpdateRecurring = (index: number, updated: RecurringEvent) => {
        const next = [...recurringEvents];
        next[index] = updated;
        onChange(next, customEvents);
    };

    const handleAddRecurring = () => {
        const newEvt: RecurringEvent = {
            id: `rec-meeting-${Date.now().toString().slice(-4)}`,
            title: "General Team Meeting and Collaboration",
            dayOfWeek: "Thursday",
            frequency: "Weekly",
            time: "6:00 PM - 9:00 PM",
            location: DEFAULT_LOCATION,
            locationUrl: STEM_CENTER_URL,
            description: "Work on robot and related systems.",
        };
        onChange([...recurringEvents, newEvt], customEvents);
    };

    const handleDeleteRecurring = (index: number) => {
        if (confirm("Delete this recurring meeting?")) {
            const next = recurringEvents.filter((_, i) => i !== index);
            onChange(next, customEvents);
        }
    };

    // Custom Events handlers
    const handleUpdateCustom = (index: number, updated: CustomEvent) => {
        const next = [...customEvents];
        next[index] = updated;
        onChange(recurringEvents, next);
    };

    const handleAddCustom = () => {
        const newEvt: CustomEvent = {
            id: `evt-${Date.now().toString().slice(-4)}`,
            title: "VEX U Tournament / Workshop",
            date: "November 15, 2026",
            category: "Competition",
            time: "9:00 AM - 5:00 PM",
            location: DEFAULT_LOCATION,
            locationUrl: STEM_CENTER_URL,
            description: "Collegiate competition day.",
        };
        onChange(recurringEvents, [...customEvents, newEvt]);
    };

    const handleDeleteCustom = (index: number) => {
        if (confirm("Delete this event?")) {
            const next = customEvents.filter((_, i) => i !== index);
            onChange(recurringEvents, next);
        }
    };

    return (
        <div className="bg-[#141416] border border-[#2b2b2b] p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab("recurring")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                            activeTab === "recurring"
                                ? "bg-[#c5050c] text-white"
                                : "bg-[#202022] text-gray-400 hover:text-white"
                        }`}
                    >
                        Recurring Weekly Meetings ({recurringEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("custom")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                            activeTab === "custom"
                                ? "bg-[#c5050c] text-white"
                                : "bg-[#202022] text-gray-400 hover:text-white"
                        }`}
                    >
                        Upcoming Competitions & Dates ({customEvents.length})
                    </button>
                </div>

                <button
                    onClick={activeTab === "recurring" ? handleAddRecurring : handleAddCustom}
                    className="bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold px-3 py-2 uppercase tracking-wider cursor-pointer"
                >
                    + Add {activeTab === "recurring" ? "Meeting" : "Event"}
                </button>
            </div>

            {activeTab === "recurring" && (
                <div className="flex flex-col gap-4">
                    {recurringEvents.map((evt, idx) => (
                        <div
                            key={evt.id || idx}
                            className="bg-[#1a1a1d] border border-[#2c2c30] p-4 grid grid-cols-1 md:grid-cols-12 gap-3"
                        >
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Day of Week
                                </label>
                                <select
                                    value={evt.dayOfWeek}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, {
                                            ...evt,
                                            dayOfWeek: e.target.value as RecurringEvent["dayOfWeek"],
                                        })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                >
                                    {[
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                        "Sunday",
                                    ].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Time Range
                                </label>
                                <input
                                    type="text"
                                    value={evt.time}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, time: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-5">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Meeting Title
                                </label>
                                <input
                                    type="text"
                                    value={evt.title}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, title: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-end justify-end">
                                <button
                                    onClick={() => handleDeleteRecurring(idx)}
                                    className="text-red-500 hover:text-red-400 text-xs font-bold uppercase p-1.5"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="md:col-span-6">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={evt.location}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, location: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-6">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Description / Agenda
                                </label>
                                <input
                                    type="text"
                                    value={evt.description || ""}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, description: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "custom" && (
                <div className="flex flex-col gap-4">
                    {customEvents.length === 0 && (
                        <p className="text-gray-400 text-xs italic py-4">
                            No special upcoming events currently configured. Click &quot;+ Add Event&quot; above to add a competition, workshop, or outreach date.
                        </p>
                    )}
                    {customEvents.map((evt, idx) => (
                        <div
                            key={evt.id || idx}
                            className="bg-[#1a1a1d] border border-[#2c2c30] p-4 grid grid-cols-1 md:grid-cols-12 gap-3"
                        >
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Date
                                </label>
                                <input
                                    type="text"
                                    value={evt.date}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, date: e.target.value })
                                    }
                                    placeholder="e.g. November 14, 2026"
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Category
                                </label>
                                <select
                                    value={evt.category}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, {
                                            ...evt,
                                            category: e.target.value as CustomEvent["category"],
                                        })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                >
                                    {["Competition", "Workshop", "Outreach", "Social"].map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-5">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={evt.title}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, title: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-end justify-end">
                                <button
                                    onClick={() => handleDeleteCustom(idx)}
                                    className="text-red-500 hover:text-red-400 text-xs font-bold uppercase p-1.5"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Time
                                </label>
                                <input
                                    type="text"
                                    value={evt.time}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, time: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>

                            <div className="md:col-span-8">
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={evt.location}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, location: e.target.value })
                                    }
                                    className="w-full bg-[#222226] border border-[#333333] px-2 py-1.5 text-xs text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


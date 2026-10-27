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
        <div className="dash-editor-card flex flex-col gap-6">
            <div className="dash-editor-header">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab("recurring")}
                        className={`dash-tab px-4 py-2 ${activeTab === "recurring" ? "dash-tab-active" : "dash-tab-inactive"}`}
                    >
                        Recurring Weekly Meetings ({recurringEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("custom")}
                        className={`dash-tab px-4 py-2 ${activeTab === "custom" ? "dash-tab-active" : "dash-tab-inactive"}`}
                    >
                        Upcoming Competitions & Dates ({customEvents.length})
                    </button>
                </div>

                <button
                    onClick={activeTab === "recurring" ? handleAddRecurring : handleAddCustom}
                    className="btn-add px-3 py-2"
                >
                    + Add {activeTab === "recurring" ? "Meeting" : "Event"}
                </button>
            </div>

            {activeTab === "recurring" && (
                <div className="flex flex-col gap-4">
                    {recurringEvents.map((evt, idx) => (
                        <div
                            key={evt.id || `rec-evt-${idx}`}
                            className="bg-[#1a1a1d] border border-[#2c2c30] p-4 grid grid-cols-1 md:grid-cols-12 gap-3"
                        >
                            <div className="md:col-span-3">
                                <label className="dash-label">
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
                                    className="dash-input"
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
                                <label className="dash-label">
                                    Time Range
                                </label>
                                <input
                                    type="text"
                                    value={evt.time}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, time: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-5">
                                <label className="dash-label">
                                    Meeting Title
                                </label>
                                <input
                                    type="text"
                                    value={evt.title}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, title: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-end justify-end">
                                <button
                                    onClick={() => handleDeleteRecurring(idx)}
                                    className="dash-delete-btn p-1.5"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="md:col-span-6">
                                <label className="dash-label">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={evt.location}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, location: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-6">
                                <label className="dash-label">
                                    Description / Agenda
                                </label>
                                <input
                                    type="text"
                                    value={evt.description || ""}
                                    onChange={(e) =>
                                        handleUpdateRecurring(idx, { ...evt, description: e.target.value })
                                    }
                                    className="dash-input"
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
                            key={evt.id || `cust-evt-${idx}`}
                            className="bg-[#1a1a1d] border border-[#2c2c30] p-4 grid grid-cols-1 md:grid-cols-12 gap-3"
                        >
                            <div className="md:col-span-3">
                                <label className="dash-label">
                                    Date
                                </label>
                                <input
                                    type="text"
                                    value={evt.date}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, date: e.target.value })
                                    }
                                    placeholder="e.g. November 14, 2026"
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="dash-label">
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
                                    className="dash-input"
                                >
                                    {["Competition", "Workshop", "Outreach", "Social"].map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-5">
                                <label className="dash-label">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    value={evt.title}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, title: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-end justify-end">
                                <button
                                    onClick={() => handleDeleteCustom(idx)}
                                    className="dash-delete-btn p-1.5"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="md:col-span-4">
                                <label className="dash-label">
                                    Time
                                </label>
                                <input
                                    type="text"
                                    value={evt.time}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, time: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>

                            <div className="md:col-span-8">
                                <label className="dash-label">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={evt.location}
                                    onChange={(e) =>
                                        handleUpdateCustom(idx, { ...evt, location: e.target.value })
                                    }
                                    className="dash-input"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


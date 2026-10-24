"use client";

import { recurringEvents, customEvents, DEFAULT_LOCATION, STEM_CENTER_URL } from "@/app/data/events";

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white py-12 px-4">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                {/* Header */}
                <div className="border-b-2 border-[#2b2b2b] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2.5 h-2.5 bg-[#c5050c] rotate-45" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                Schedule & Location
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                            Events & Calendar
                        </h1>
                    </div>

                    {/* Primary Location Card */}
                    <div className="bg-[#161619] border-l-4 border-[#c5050c] p-4 text-xs max-w-md shadow-lg"
                         style={{
                             /* Chamfer with negative slope y = -x on bottom-left */
                             clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
                         }}>
                        <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                            Home Lab Location:
                        </span>
                        <p className="text-white font-semibold text-sm">
                            {DEFAULT_LOCATION}
                        </p>
                        <a
                            href={STEM_CENTER_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-2 text-[#f87171] hover:text-white underline font-bold uppercase tracking-wider"
                        >
                            Campus Center Directions & Info ↗
                        </a>
                    </div>
                </div>

                {/* 1. RECURRING WEEKLY EVENTS TABLE */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-[#c5050c] rotate-45" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider">
                            Weekly Recurring Meetings
                        </h2>
                    </div>

                    <div className="overflow-x-auto bg-[#141416] border border-[#26262b] shadow-xl"
                         style={{
                             /* Chamfer with negative slope y = -x on bottom-left */
                             clipPath: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))"
                         }}>
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead className="bg-[#1c1c20] text-gray-300 uppercase tracking-wider text-[11px] border-b border-[#2b2b2b]">
                                <tr>
                                    <th className="py-3 px-4">Day</th>
                                    <th className="py-3 px-4">Time</th>
                                    <th className="py-3 px-4">Event</th>
                                    <th className="py-3 px-4">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222228]">
                                {recurringEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-[#1a1a1f] transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                            <span className="px-2 py-0.5 bg-[#c5050c] text-white text-[11px] uppercase tracking-wider inline-block">
                                                {event.dayOfWeek}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                                            {event.time}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-white">{event.title}</div>
                                            {event.description && (
                                                <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                                                    {event.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-300">
                                            {event.locationUrl ? (
                                                <a
                                                    href={event.locationUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-gray-300 hover:text-white underline"
                                                >
                                                    {event.location}
                                                </a>
                                            ) : (
                                                event.location
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 2. CUSTOM / COMPETITION EVENTS TABLE */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-[#c5050c] rotate-45" />
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider">
                            Upcoming Competitions & Milestones
                        </h2>
                    </div>

                    <div className="overflow-x-auto bg-[#141416] border border-[#26262b] shadow-xl"
                         style={{
                             /* Chamfer with negative slope y = -x on bottom-left */
                             clipPath: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))"
                         }}>
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead className="bg-[#1c1c20] text-gray-300 uppercase tracking-wider text-[11px] border-b border-[#2b2b2b]">
                                <tr>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Event</th>
                                    <th className="py-3 px-4">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222228]">
                                {customEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-[#1a1a1f] transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                                            {event.date}
                                        </td>
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    event.category === "Competition"
                                                        ? "bg-red-950 text-red-300 border border-red-800"
                                                        : event.category === "Workshop"
                                                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                                                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                                }`}
                                            >
                                                {event.category}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-white">{event.title}</div>
                                            <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                                                {event.time} • {event.description}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-300">
                                            {event.locationUrl ? (
                                                <a
                                                    href={event.locationUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-gray-300 hover:text-white underline"
                                                >
                                                    {event.location}
                                                </a>
                                            ) : (
                                                event.location
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}

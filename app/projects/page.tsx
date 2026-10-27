"use client";

import { useState, useCallback } from "react";
import projects, { Project, getAvailableSeasons, getSortedProjects } from "@/app/data/projects";
import locales from "@/app/data/locales";
import { useHashSelection } from "@/app/util/useHashSelection";
import Image from "next/image";

const seasons = getAvailableSeasons();

export default function ProjectsPage() {
    const [selectedSeason, setSelectedSeason] = useState<string>("All");

    const onHashSelect = useCallback((targetId: string) => {
        const targetProj = projects.find((p) => p.id === targetId);
        if (targetProj) {
            setSelectedSeason("All");
        }
    }, []);

    const highlightedId = useHashSelection(onHashSelect);

    const filteredProjects = getSortedProjects(
        projects.filter((p) => selectedSeason === "All" || p.season === selectedSeason)
    );

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white py-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="border-b-2 border-[#2b2b2b] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="section-diamond" />
                            <span className="section-eyebrow">
                                {locales.projects.pageSubtitle}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                            {locales.projects.archiveTitle}
                        </h1>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm max-w-md">
                        {locales.projects.pageDescription}
                    </p>
                </div>

                {/* Season Filter Bar */}
                <div className="flex items-center gap-2 bg-[#141416] p-3 border border-[#26262b]">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                        {locales.projects.filterLabel}
                    </span>
                    {seasons.map((season) => (
                        <button
                            key={season}
                            onClick={() => setSelectedSeason(season)}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all clip-chamfer-btn ${
                                selectedSeason === season
                                    ? "bg-[#c5050c] text-white shadow-md"
                                    : "bg-[#222222] text-gray-400 hover:text-white hover:bg-[#2c2c32]"
                            }`}
                        >
                            {season}
                        </button>
                    ))}
                </div>

                {/* All Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project: Project, index: number) => {
                        const isSelected = highlightedId === project.id;

                        return (
                            <div
                                key={project.id}
                                className={`chamfer-card-outer group shadow-xl h-full ${isSelected ? "selected" : ""}`}
                            >
                                <article
                                    id={project.id}
                                    className="chamfer-card-inner bg-[#161619] flex flex-col justify-between overflow-hidden h-full"
                                >
                                {/* Top Content Section */}
                                <div className="flex flex-col flex-1">
                                    {/* Header / Graphic */}
                                    <div className="relative h-44 w-full bg-[#0d0d0d] flex items-center justify-center p-4 border-b border-[#26262b] overflow-hidden flex-shrink-0">
                                        <div className="absolute top-2 left-2 bg-[#c5050c] text-white text-xs font-bold px-2 py-0.5 tracking-wider uppercase z-10">
                                            {project.season}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 badge-selected z-10">
                                                Selected
                                            </div>
                                        )}
                                        {project.image && (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                width={150}
                                                height={95}
                                                priority={index < 3}
                                                loading={index < 3 ? "eager" : "lazy"}
                                                className="opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        )}
                                    </div>

                                    {/* Body (Text section) */}
                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <h2 className="text-xl font-bold text-white group-hover:text-[#f87171] transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Highlights */}
                                        {project.highlights && project.highlights.length > 0 && (
                                            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#26262b]">
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {locales.projects.technicalHighlights}
                                                </span>
                                                <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                                                    {project.highlights.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Awards: Pinned to bottom of text section */}
                                        {project.awards && project.awards.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
                                                {project.awards.map((award, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="badge-award"
                                                    >
                                                        {award}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Link / Action Footer */}
                                {project.githubUrl && (
                                    <div className="p-4 bg-[#111114] border-t border-[#26262b] flex items-center justify-between">
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="section-link"
                                        >
                                            {locales.projects.sourceLink} ↗
                                        </a>
                                    </div>
                                )}
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

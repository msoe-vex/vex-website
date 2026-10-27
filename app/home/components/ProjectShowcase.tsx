import { Project, getSortedProjects } from "@/app/data/projects";
import locales from "@/app/data/locales";
import Image from "next/image";
import Link from "next/link";

export default function ProjectShowcase() {
    const recentProjects = getSortedProjects().slice(0, 3);

    return (
        <section id="projects" className="py-8 px-4 bg-[#111111] text-white">
            <div className="section-container">
                {/* Section Header */}
                <div className="section-header-row">
                    <div>
                        <div className="section-eyebrow-row">
                            <span className="section-diamond" />
                            <span className="section-eyebrow">
                                {locales.projects.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="section-title">
                            {locales.projects.recentTitle}
                        </h2>
                    </div>
                    <Link
                        href="/projects"
                        className="section-link"
                    >
                        {locales.projects.recentCta}
                    </Link>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentProjects.map((project: Project) => (
                        <div
                            key={project.id}
                            className="chamfer-card-outer group hover:z-20 h-full"
                        >
                            <Link
                                href={`/projects#select#${project.id}`}
                                className="chamfer-card-inner bg-[#181818] flex flex-col justify-between overflow-hidden cursor-pointer h-full"
                            >
                                <div className="flex flex-col flex-1">
                                    {/* Card Image / Season Banner */}
                                    <div className="relative h-40 w-full bg-[#0d0d0d] flex items-center justify-center p-4 border-b border-[#2b2b2b] overflow-hidden flex-shrink-0">
                                        <div className="badge-season absolute top-2 left-2 z-10 px-2 py-0.5">
                                            {project.season}
                                        </div>
                                        {project.image && (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                width={140}
                                                height={90}
                                                className="opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        )}
                                    </div>

                                    {/* Content Details */}
                                    <div className="p-4 flex flex-col gap-3 flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#c5050c] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Highlights */}
                                        {project.highlights && project.highlights.length > 0 && (
                                            <div className="flex flex-col gap-1 pt-1.5 border-t border-[#26262b]">
                                                <span className="pub-subsection-label">
                                                    Technical Highlights
                                                </span>
                                                <ul className="text-xs text-gray-300 list-disc list-inside space-y-0.5">
                                                    {project.highlights.slice(0, 2).map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Awards: Pinned to bottom of text section */}
                                        {project.awards && project.awards.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-2 mt-auto">
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

                                {/* Bottom Card Prompt */}
                                <div className="card-prompt-bar">
                                    <span>{locales.projects.cardCta}</span>
                                    <span>→</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

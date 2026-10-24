import projects, { Project } from "@/app/data/projects";
import locales from "@/app/data/locales";
import Image from "next/image";
import Link from "next/link";

export default function ProjectShowcase() {
    const sortedProjects = [...projects].sort((a, b) => {
        if (a.season !== b.season) {
            return b.season.localeCompare(a.season);
        }
        return b.orderIndex - a.orderIndex;
    });

    const recentProjects = sortedProjects.slice(0, 3);

    return (
        <section id="projects" className="py-8 px-4 bg-[#111111] text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#2b2b2b] pb-3 gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 bg-[#c5050c] rotate-45" />
                            <span className="text-[#c5050c] uppercase font-bold text-xs tracking-widest">
                                {locales.projects.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                            {locales.projects.recentTitle}
                        </h2>
                    </div>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c5050c] hover:text-white uppercase tracking-wider transition-colors"
                    >
                        {locales.projects.recentCta}
                    </Link>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentProjects.map((project: Project) => (
                        <div
                            key={project.id}
                            className="relative group transition-all duration-300 hover:z-20 h-full"
                        >
                            <Link
                                href={`/projects#select#${project.id}`}
                                className="relative bg-[#181818] border border-[#2b2b2b] group-hover:border-[#c5050c] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer h-full"
                                style={{
                                    /* Chamfer with negative slope y = -x on bottom-left, inset border safe */
                                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))"
                                }}
                            >
                                <div className="flex flex-col flex-1">
                                    {/* Card Image / Season Banner */}
                                    <div className="relative h-40 w-full bg-[#0d0d0d] flex items-center justify-center p-4 border-b border-[#2b2b2b] overflow-hidden flex-shrink-0">
                                        <div className="absolute top-2 left-2 bg-[#c5050c] text-white text-xs font-bold px-2 py-0.5 tracking-wider uppercase z-10">
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
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
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
                                                        className="inline-block bg-[#242428] text-yellow-400 border border-yellow-500/30 text-[10px] font-semibold px-1.5 py-0.5"
                                                    >
                                                        🏆 {award}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Card Prompt */}
                                <div className="p-3 bg-[#141416] border-t border-[#2b2b2b] flex items-center justify-between text-xs font-bold text-[#c5050c] group-hover:text-white uppercase tracking-wider">
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

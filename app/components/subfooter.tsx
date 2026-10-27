import locales from "@/app/data/locales";

export default function SubFooter() {
    return (
        <section id="contact" className="py-8 px-4 bg-[#141416] border-t-2 border-[#2b2b2b] text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Section Header: Aligned identically with Donors, Projects, and Members */}
                <div className="section-header-row">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="section-diamond" />
                            <span className="section-eyebrow">
                                {locales.contact.sectionSubtitle}
                            </span>
                        </div>
                        <h2 className="section-title">
                            {locales.contact.heading}
                        </h2>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm max-w-md">
                        {locales.contact.description}
                    </p>
                </div>

                {/* Contact Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                        href={locales.contact.discordUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2 clip-chamfer-btn"
                    >
                        <span>{locales.contact.discordButton}</span>
                        <span>↗</span>
                    </a>
                    <a
                        href={`mailto:${locales.contact.emailAddress}`}
                        className="px-5 py-2.5 bg-[#c5050c] hover:bg-[#a0040a] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2 clip-chamfer-btn"
                    >
                        <span>{locales.contact.emailButton}</span>
                        <span>↗</span>
                    </a>
                    <a
                        href={locales.contact.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#222226] hover:bg-[#2e2e34] text-gray-200 hover:text-white border border-[#3a3a3a] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 clip-chamfer-btn"
                    >
                        <span>{locales.contact.githubButton}</span>
                        <span>↗</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

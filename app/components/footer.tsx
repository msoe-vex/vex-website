import Image from "next/image";
import Link from "next/link";
import locales from "@/app/data/locales";

export default function Footer() {
    return (
        <footer className="bg-[#0b0b0d] border-t-2 border-[#1f1f23] text-gray-300 text-xs py-4 px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
                
                {/* Single Combined Inline Row: Logos + Compact Inline Copyrights */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
                    {/* Logos Trio */}
                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 flex-shrink-0">
                        {/* MSOE Logo */}
                        <a
                            href="https://msoe.edu"
                            target="_blank"
                            rel="noreferrer"
                            className="relative w-24 sm:w-28 h-8 inline-block opacity-85 hover:opacity-100 transition-opacity"
                        >
                            <Image
                                src="/assets/donors/MSOE.png"
                                alt="Milwaukee School of Engineering"
                                fill
                                sizes="(max-width: 640px) 96px, 112px"
                                className="object-contain"
                            />
                        </a>

                        <div className="hidden sm:block w-[1px] h-6 bg-[#2a2a2e]" />

                        {/* Raider Robotics Logo in RED */}
                        <Link href="/home" className="relative w-28 sm:w-36 h-9 inline-block hover:scale-105 transition-transform">
                            <Image
                                src="/branding/RR_Logo.png"
                                alt="Raider Robotics Red Logo"
                                fill
                                sizes="(max-width: 640px) 112px, 144px"
                                className="object-contain"
                            />
                        </Link>

                        <div className="hidden sm:block w-[1px] h-6 bg-[#2a2a2e]" />

                        {/* Official VEX Robotics Logo */}
                        <a
                            href="https://www.vexrobotics.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="relative w-24 sm:w-28 h-7 inline-block opacity-85 hover:opacity-100 hover:scale-105 transition-all"
                        >
                            <Image
                                src="/branding/vex_logo.png"
                                alt="VEX Robotics"
                                fill
                                sizes="(max-width: 640px) 96px, 112px"
                                className="object-contain"
                            />
                        </a>
                    </div>

                    {/* Compact Copyrights with Accessible WCAG Contrast */}
                    <div className="flex flex-col text-[11px] text-gray-300 leading-normal">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-0.5">
                            <span>{locales.footer.raiderCopyright}</span>
                            <span className="text-gray-400">•</span>
                            <span>{locales.footer.msoeCopyright}</span>
                        </div>
                        <p className="text-[10px] text-gray-300 m-0 p-0 leading-normal">
                            {locales.footer.vexDisclaimer}
                        </p>
                    </div>
                </div>

                {/* Developer Credit */}
                <div className="border-t border-[#1a1a1e] pt-2 w-full text-center text-[11px] text-gray-300 m-0">
                    Built by {locales.footer.creatorName} (<a href={locales.footer.creatorUrl} target="_blank" rel="noreferrer" className="text-gray-200 hover:text-white underline">{locales.footer.creatorHandle}</a>)
                </div>
            </div>
        </footer>
    );
}

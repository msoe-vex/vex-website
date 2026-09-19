'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Header() {
    const router = useRouter();
    const pathName = usePathname();

    //if opening a new page with a section selected, scroll to it
    useEffect(() => {
        const section = window.location.hash.slice(1);

        if (section) {
            setTimeout(() => {
                document.getElementById(section)?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 0);
        }
    }, [pathName]);

    const handleNavigation = (page: string, section: string | null = null ) => () => {
        // Empty page assumes scroll to top
        if (page === "") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        
        // Check if the current page pathname matches the redirect, if so scroll, if not redirect
        if (pathName === `/${page}` || (page === "home" && pathName === "/")) {
            document.getElementById(section!)?.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(`/${page}${section ? `#${section}` : ""}`);
        }
    };
    
    return (
        <header id="header" className="relative">
            <nav>
                <div>
                    <button onClick={handleNavigation("home")}>
                        <Image src="/branding/RR_Logo.png" alt="Raider Robotics" width="50" height="25"/>
                    </button>
                
                    <button onClick={handleNavigation("")}>
                        Top
                    </button>

                    <button onClick={handleNavigation("home", "Sponsors")}>
                        Sponsors
                    </button>

                    <button onClick={handleNavigation("home", "Mission")}>
                        Mission
                    </button>

                    <button onClick={handleNavigation("home", "Projects")}>
                        Projects
                    </button>

                    <button onClick={handleNavigation("members")}>
                        Members
                    </button>
                </div>
            </nav>
        </header>
    );
}
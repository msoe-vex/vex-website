'use client';

import NavLink from "../navlink";
import Image from "next/image";
import "./local.css";

// Topbar links: Projects (/projects), Events (/events), Members (/members), Dashboard (/dashboard)
const items = [
    { label: "Projects", href: "/projects" },
    { label: "Events", href: "/events" },
    { label: "Members", href: "/members" },
    { label: "Dashboard", href: "/dashboard" },
];

export default function Header() {
    return (
        <header id="site-header">
            <nav id="navheader">
                <NavLink className="navbutton-logo" href="/home">
                    <Image
                        className="header-logo-white"
                        src="/branding/RR_Logo_White.png" 
                        alt="Raider Robotics" 
                        width={500}
                        height={250}
                        priority
                        fetchPriority="high"
                        loading="eager"
                        style={{ width: "auto", height: "auto", maxHeight: "40px" }}
                    />
                    <Image
                        className="header-logo-red"
                        src="/branding/RR_Logo.png" 
                        alt="Raider Robotics" 
                        width={500}
                        height={250}
                        loading="eager"
                        style={{ width: "auto", height: "auto", maxHeight: "40px" }}
                    />
                </NavLink>
                
                <div className="navbutton-row">
                    {items.map((item) => (
                        <NavLink
                            key={item.label}
                            href={item.href}
                            className="navbutton-row-link"
                        >
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
}

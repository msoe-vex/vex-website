'use client';

import NavLink from "../navlink";
import Image from "next/image";
import "./local.css"

const items = [
    { label: "Top", href: "/#top" },
    { label: "Sponsors", href: "/#Sponsors" },
    { label: "Mission", href: "/#Mission" },
    { label: "Projects", href: "/#Projects" },
    { label: "Members", href: "/members" },
]

export default function Header() {
    return (
        <header id="top">
            <nav id="navheader">
                <NavLink className="navbutton-logo" href="/home">
                    <Image 
                        src="/branding/RR_Logo_White.png" 
                        alt="Raider Robotics" 
                        width="500" height="250"
                    />
                </NavLink>
                
                <div className="navbutton-row">
                    {items.map((item) => (
                        <NavLink key={item.label} href={item.href} className="navbutton-row-link">
                            <span> {item.label} </span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
}
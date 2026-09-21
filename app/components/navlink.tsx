import Link from "next/link";
import { ReactNode } from "react";

interface NavLink {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function NavLink({ href, children, className = "", }: NavLink) { 
    return (<Link href={href} className={className}> 
    {children} 
    </Link>); 
}
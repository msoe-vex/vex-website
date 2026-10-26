import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
    return (
        <Link href={href} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}

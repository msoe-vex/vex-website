'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleSponsorsScroll = () => {
        router.push("/#sponsors");
    };

    
    return (
        <header style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "1rem 2rem",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <nav style={{
                display: "flex",
                gap: "2rem",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <Link href="/" style={{ textDecoration: "none", color: "#000", fontWeight: "500" }}>
                    Home
                </Link>
                <button
                    onClick={handleSponsorsScroll}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#000",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    Sponsors
                </button>
                <Link href="/members" style={{ textDecoration: "none", color: "#000", fontWeight: "500" }}>
                    Members
                </Link>
            </nav>
        </header>
    );
}
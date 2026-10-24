/**
 * Centralized SEO configurations, structured JSON-LD schemas, and crawl metadata.
 */
export const siteConfig = {
    name: "Raider Robotics",
    shortName: "Raider Robotics VEX U",
    description: "Milwaukee School of Engineering's Collegiate VEX U Robotics Team. Designing, building, and programming autonomous and driver-controlled robots for the global stage.",
    url: "https://msoe-vex.github.io", // Default GitHub Pages / custom production domain
    ogImage: "/branding/RR_Logo.png",
    keywords: [
        "Raider Robotics",
        "MSOE Robotics",
        "MSOE VEX U",
        "Milwaukee School of Engineering",
        "VEX U",
        "VEX Robotics",
        "STEM Center MSOE",
        "Collegiate Robotics",
        "Engineering Team",
        "Autonomous Robotics"
    ],
    creator: "Raider Robotics",
    institution: {
        name: "Milwaukee School of Engineering",
        url: "https://www.msoe.edu",
        address: {
            streetAddress: "1025 N Broadway",
            addressLocality: "Milwaukee",
            addressRegion: "WI",
            postalCode: "53202",
            addressCountry: "US"
        }
    }
};

/**
 * Generates JSON-LD schema for EducationalOrganization & Robotics Team
 */
export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: `${siteConfig.url}${siteConfig.ogImage}`,
        description: siteConfig.description,
        sameAs: [
            "https://github.com/msoe-vex",
            "https://discord.gg/q4GyTzwTKW"
        ],
        parentOrganization: {
            "@type": "CollegeOrUniversity",
            name: siteConfig.institution.name,
            url: siteConfig.institution.url,
            address: {
                "@type": "PostalAddress",
                ...siteConfig.institution.address
            }
        }
    };
}

/**
 * Generates JSON-LD schema for weekly recurring team meetings and events
 */
export function getEventsSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
            {
                "@type": "Event",
                position: 1,
                name: "Subsystem Build & CAD Open Lab",
                description: "Prototyping, CNC milling, 3D printing, and robot mechanical assembly.",
                eventSchedule: {
                    "@type": "Schedule",
                    repeatFrequency: "P1W",
                    byDay: "https://schema.org/Tuesday",
                    startTime: "17:30",
                    endTime: "20:30"
                },
                location: {
                    "@type": "Place",
                    name: "We Energies STEM Center at MSOE",
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: "1440 N Market St",
                        addressLocality: "Milwaukee",
                        addressRegion: "WI",
                        postalCode: "53202",
                        addressCountry: "US"
                    }
                }
            },
            {
                "@type": "Event",
                position: 2,
                name: "Weekly General Team Meeting",
                description: "Full team sync covering sprint updates, match strategies, and open workshop hours.",
                eventSchedule: {
                    "@type": "Schedule",
                    repeatFrequency: "P1W",
                    byDay: "https://schema.org/Thursday",
                    startTime: "18:00",
                    endTime: "20:00"
                },
                location: {
                    "@type": "Place",
                    name: "We Energies STEM Center at MSOE",
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: "1440 N Market St",
                        addressLocality: "Milwaukee",
                        addressRegion: "WI",
                        postalCode: "53202",
                        addressCountry: "US"
                    }
                }
            }
        ]
    };
}

export default siteConfig;


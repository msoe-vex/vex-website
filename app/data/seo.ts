import { recurringEvents, DEFAULT_LOCATION } from "./events";

/**
 * Centralized SEO configurations, structured JSON-LD schemas, and crawl metadata.
 */
export const siteConfig = {
    name: "Raider Robotics",
    shortName: "Raider Robotics VEX U",
    description: "Milwaukee School of Engineering's Collegiate VEX U Robotics Team. Designing, building, and programming autonomous and driver-controlled robots for the global stage.",
    url: "https://www.msoevex.com", // Official team domain
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
        itemListElement: recurringEvents.map((event, index) => ({
            "@type": "Event",
            position: index + 1,
            name: event.title,
            description: event.description,
            eventSchedule: {
                "@type": "Schedule",
                repeatFrequency: "P1W",
                byDay: `https://schema.org/${event.dayOfWeek}`,
                startTime: "18:00",
                endTime: "21:00"
            },
            location: {
                "@type": "Place",
                name: DEFAULT_LOCATION,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: "1440 N Market St",
                    addressLocality: "Milwaukee",
                    addressRegion: "WI",
                    postalCode: "53202",
                    addressCountry: "US"
                }
            }
        }))
    };
}

export default siteConfig;


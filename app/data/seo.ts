import { recurringEvents, DEFAULT_LOCATION } from "./events";
import locales from "./locales";

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
    },
    sections: [
        {
            name: "Projects & Robot Builds",
            description: locales.projects.pageDescription,
            url: "https://www.msoevex.com/projects"
        },
        {
            name: "Events & Calendar",
            description: "Weekly recurring team meetings, build sessions, and upcoming collegiate VEX U tournament milestones.",
            url: "https://www.msoevex.com/events"
        },
        {
            name: "Team Roster & Members",
            description: locales.members.pageDescription,
            url: "https://www.msoevex.com/members"
        }
    ]
};

/**
 * Generates JSON-LD schema combining WebSite, Organization, and SiteNavigationElement
 * for Google Search SERP sitelinks (Title -> Description -> Projects, Events, Members).
 */
export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${siteConfig.url}/#website`,
                url: siteConfig.url,
                name: siteConfig.name,
                alternateName: [siteConfig.shortName, "MSOE VEX U Robotics"],
                description: siteConfig.description,
                publisher: {
                    "@id": `${siteConfig.url}/#organization`
                },
                inLanguage: "en-US",
                hasPart: siteConfig.sections.map((section) => ({
                    "@type": "WebPage",
                    name: section.name,
                    description: section.description,
                    url: section.url
                }))
            },
            {
                "@type": "EducationalOrganization",
                "@id": `${siteConfig.url}/#organization`,
                name: siteConfig.name,
                alternateName: siteConfig.shortName,
                url: siteConfig.url,
                logo: {
                    "@type": "ImageObject",
                    url: `${siteConfig.url}${siteConfig.ogImage}`,
                    caption: `${siteConfig.name} - MSOE VEX U`
                },
                image: `${siteConfig.url}${siteConfig.ogImage}`,
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
            },
            {
                "@type": "ItemList",
                "@id": `${siteConfig.url}/#sitelinks`,
                name: "Raider Robotics Primary Sections",
                description: "Main site sections for Raider Robotics at Milwaukee School of Engineering",
                numberOfItems: siteConfig.sections.length,
                itemListElement: siteConfig.sections.map((section, idx) => ({
                    "@type": "SiteNavigationElement",
                    position: idx + 1,
                    name: section.name,
                    description: section.description,
                    url: section.url
                }))
            }
        ]
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


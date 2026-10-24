/**
 * Static UI text and copy for all pages across the Raider Robotics website.
 * Centralized here for easy updating without modifying UI components.
 */
export const locales = {
    branding: {
        teamName: "Raider Robotics",
        shortName: "Raider Robotics Vex U",
        institution: "Milwaukee School of Engineering",
        institutionAbbr: "MSOE",
        tagline: "Milwaukee School of Engineering • Vex U Robotics",
        missionSubtitle: "MSOE Vex U",
    },
    mission: {
        title: "Our Mission",
        statement:
            "Raider Robotics empowers Milwaukee School of Engineering students to push the frontiers of competitive collegiate robotics. Through hands-on multidisciplinary engineering, rigorous iterative design, and open peer collaboration, we design, build, and program world-class autonomous and driver-controlled machines for the global VEX U competition stage.",
        pillars: [
            {
                number: "01",
                label: "INNOVATE",
                description: "Custom CAD, CNC/3D printed manufacturing, and pneumatic systems."
            },
            {
                number: "02",
                label: "CODE",
                description: "Advanced odometry, motion profiling, and autonomous strategy."
            },
            {
                number: "03",
                label: "COMPETE",
                description: "Representing MSOE at national qualifiers and the VEX U World Championship."
            }
        ]
    },
    sponsors: {
        sectionSubtitle: "Partners & Backers",
        sectionTitle: "Our Sponsors",
        description:
            "Industry leaders and educational foundations powering materials, travel, and student engineering.",
        longDescription:
            "Raider Robotics is powered by pioneering industry leaders, educational supporters, and local community foundations. Their commitment fuels our materials, manufacturing, competition travel, and student mentorship.",
        ctaButton: "Become a Sponsor →",
        sponsorSubject: "Sponsorship Inquiry"
    },
    projects: {
        sectionSubtitle: "Engineering & Legacy",
        recentTitle: "Recent Projects & Robots",
        archiveTitle: "Projects & Robot Builds",
        pageSubtitle: "Robot Architecture & History",
        recentCta: "View All Projects & Archive →",
        pageDescription:
            "Complete archive of Raider Robotics competitive robot platforms, custom sub-assemblies, mechanical specifications, awards, and open-source codebases.",
        homeDescription:
            "Explore our competitive robot builds, custom mechanical sub-assemblies, open-source code repositories, and season tournament achievements.",
        cardCta: "Learn more in Projects",
        sourceLink: "Source Code & CAD",
        filterLabel: "Filter Season:",
        technicalHighlights: "Technical Highlights"
    },
    members: {
        sectionSubtitle: "Team Leadership",
        pageSubtitle: "Roster & Leadership",
        previewTitle: "Meet The Board",
        pageTitle: "Meet The Team",
        previewCta: "View Full Team Roster & Alumni →",
        pageDescription:
            "The multidisciplinary engineers, developers, and builders shaping Raider Robotics across Controls, Design, and Executive Board.",
        cardCta: "View Profile",
        filterSubsystemLabel: "Subsystem:",
        filterStatusLabel: "Status:",
        emptyFilterText: "No team members found matching the selected filter criteria."
    },
    events: {
        sectionSubtitle: "Schedule & Location",
        pageTitle: "Events & Calendar",
        homeLabLabel: "Home Lab Location:",
        directionsLink: "Campus Center Directions & Info ↗",
        recurringTitle: "Weekly Recurring Meetings",
        customTitle: "Upcoming Competitions & Milestones"
    },
    contact: {
        sectionSubtitle: "Connect With Raider Robotics",
        heading: "Interested in Joining or Sponsoring?",
        description:
            "Whether you are an incoming MSOE student looking to design robots or an industry partner wanting to support future engineers, we want to hear from you.",
        discordButton: "Join Discord",
        emailButton: "Email: msoerobotics@gmail.com",
        githubButton: "GitHub @msoe-vex",
        emailAddress: "msoerobotics@gmail.com",
        discordUrl: "https://discord.gg/q4GyTzwTKW",
        githubUrl: "https://github.com/msoe-vex"
    },
    footer: {
        raiderCopyright: `© ${new Date().getFullYear()} Raider Robotics. All rights reserved.`,
        msoeCopyright: `© ${new Date().getFullYear()} Milwaukee School of Engineering. All rights reserved.`,
        vexDisclaimer: "VEX, VEX U, and VEX Robotics are registered trademarks of Innovation First International, Inc.",
        creatorName: "Avery Benjamin",
        creatorHandle: "@Akiisqt",
        creatorUrl: "https://github.com/Akiisqt"
    }
};

export default locales;

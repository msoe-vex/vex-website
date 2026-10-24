export type SubsystemRole = "Controls" | "Design" | "Eboard";
export type MemberStatus = "active" | "alumni";

export interface Member {
    id: string;
    name: string;
    role: string;
    subsystem: SubsystemRole;
    status: MemberStatus;
    gradYear?: number;
    major?: string;
    image?: string;
    github?: string;
    linkedin?: string;
    contributions?: string;
}

export const members: Member[] = [
    {
        id: "andrew-needham",
        name: "Andrew Needham",
        role: "Controls Lead",
        subsystem: "Eboard",
        status: "active",
        gradYear: 2025,
        major: "Mechanical Engineering",
        image: "/branding/RR_Icon.png",
        github: "https://github.com/msoe-vex",
        contributions: "Club leadership, competition logistics, CAD chassis architecture."
    },
    {
        id: "avery-benjamin",
        name: "Avery Benjamin",
        role: "Controls Member",
        subsystem: "Controls",
        status: "active",
        gradYear: 2026,
        major: "Computer Engineering",
        image: "/branding/RR_Icon.png",
        github: "https://github.com/Akiisqt",
        linkedin: "https://www.linkedin.com/in/Akiisqt",
        contributions: "Odometry state estimator, autonomous motion profiling, and web development."
    },
    {
        id: "vice-president",
        name: "Vice President",
        role: "Vice President & Operations",
        subsystem: "Eboard",
        status: "active",
        gradYear: 2026,
        major: "Electrical Engineering",
        image: "/branding/RR_Icon.png",
        github: "https://github.com/msoe-vex",
        contributions: "Budgeting, component ordering, event planning, and outreach coordination."
    },
    {
        id: "treasurer",
        name: "Treasurer",
        role: "Treasurer & Finance Lead",
        subsystem: "Eboard",
        status: "active",
        gradYear: 2027,
        major: "Software Engineering",
        image: "/branding/RR_Icon.png",
        contributions: "Sponsorship allocation, purchase orders, and financial compliance."
    },
    {
        id: "design-lead-placeholder",
        name: "Design Lead",
        role: "Design & CAD Specialist",
        subsystem: "Design",
        status: "active",
        gradYear: 2026,
        major: "Mechanical Engineering",
        image: "/branding/RR_Icon.png",
        contributions: "Intake linkage design, pneumatic actuation systems, and weight distribution analysis."
    },
    {
        id: "controls-programmer",
        name: "Controls Specialist",
        role: "Autonomous Developer",
        subsystem: "Controls",
        status: "active",
        gradYear: 2027,
        major: "Computer Science",
        image: "/branding/RR_Icon.png",
        contributions: "PID motion algorithms, sensor integration, and driver practice tuning."
    },
    {
        id: "alumni-member",
        name: "Alumni Contributor",
        role: "Former Controls Specialist",
        subsystem: "Controls",
        status: "alumni",
        gradYear: 2024,
        major: "Software Engineering",
        image: "/branding/RR_Icon.png",
        github: "https://github.com/msoe-vex",
        contributions: "VEX U World Championship autonomous pathing and driver control layouts."
    }
];

export default members;

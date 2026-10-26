export type SubsystemRole = "Controls" | "Design" | "Eboard";
export type MemberStatus = "active" | "alumni";

export const SUBSYSTEM_ROLES: (SubsystemRole | "All")[] = ["All", "Controls", "Design", "Eboard"];

export interface Member {
    id: string;
    name: string;
    role: string;
    subsystems: SubsystemRole[];
    subsystem?: SubsystemRole;
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
        id: "paul-majka",
        name: "Paul Majka",
        role: "President",
        subsystems: ["Eboard"],
        status: "active",
        gradYear: 2027,
        major: "Mechanical Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/paulmajka/",
        contributions: ""
    },
    {
        id: "matthew-griesbach",
        name: "Matthew Griesbach",
        role: "Vice President",
        subsystems: ["Eboard"],
        status: "active",
        gradYear: 2027,
        major: "Mechanical Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/m-griesbach/",
        contributions: ""
    },
    {
        id: "andrew-needham",
        name: "Andrew Needham",
        role: "Controls Lead",
        subsystems: ["Controls", "Eboard"],
        status: "active",
        gradYear: 2027,
        major: "Computer Science",
        image: "/branding/RR_Icon.png",
        github: "https://github.com/aneedham0577",
        linkedin: "https://www.linkedin.com/in/aneedham0577/",
        contributions: "",
    },
    {
        id: "oliver-rohwer",
        name: "Oliver Rohwer",
        role: "Design Lead",
        subsystems: ["Design", "Eboard"],
        status: "active",
        gradYear: 2027,
        major: "Mechanical Engineering",
        image: "/assets/members/oliver-rohwer.jpg",
        linkedin: "https://www.linkedin.com/in/oliver-rohwer/"
    },
    {
        id: "jacob-mcgovern",
        name: "Jacob McGovern",
        role: "Treasurer",
        subsystems: ["Eboard"],
        status: "active",
        gradYear: 2028,
        major: "Mechanical Engineering",
        image: "/assets/members/jacob-mcgovern.jpg",
    },
    {
        id: "davi-facchini",
        name: "Davi Facchini",
        role: "Design Member",
        subsystems: ["Design"],
        status: "alumni",
        gradYear: 2029,
        major: "Electrical Engineering",
        image: "/branding/RR_Icon.png"
    },
    {
        id: "corbin-schaffer",
        name: "Corbin",
        role: "Control Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2029,
        major: "Computer Science",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/corbin-schaffer-1b0a4b1b9/"
    },
    {
        id: "avery-benjamin",
        name: "Avery Benjamin",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2030,
        major: "Computer Science",
        image: "/assets/members/avery-benjamin.jpg", // Don't worry about filling, just send an image of yourself.
        github: "https://github.com/Akiisqt",
        linkedin: "https://www.linkedin.com/in/Akiisqt",
        contributions: "Website Development, and AI Object Detection."
    },
    {
        id: "landon-van-mersbergen",
        name: "Landon Van Mersbergen",
        role: "Controls Member",
        subsystems: ["Controls", "Design"],
        status: "active",
        gradYear: 2028,
        major: "Computer Science",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/landon-van-mersbergen/",
        contributions: ""
    },
    {
        id: "tyler-dretske",
        name: "Tyler Dretske",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2030,
        major: "Computer Science",
        linkedin: "https://www.linkedin.com/in/tyler-dretske/",
        image: "/branding/RR_Icon.png",
        contributions: ""
    },
    {
        id: "charles-malohn",
        name: "Charles Malohn",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2029,
        major: "Computer Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/6charles-malohn6/",
        contributions: ""
    },
    {
        id: "ben-reiser",
        name: "Ben Reiser",
        role: "Strategist",
        subsystems: ["Eboard"],
        status: "active",
        gradYear: 2030,
        major: "Industrial Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/benjreiser/",
        contributions: ""
    },
    {
        id: "david-mews",
        name: "David Mews",
        role: "Design Member",
        subsystems: ["Design"],
        status: "active",
        image: "/branding/RR_Icon.png",
        contributions: ""
    },
    {
        id: "harlan-danes",
        name: "Harlan Danes",
        role: "Design Member",
        subsystems: ["Design"],
        status: "active",
        gradYear: 2030,
        image: "/branding/RR_Icon.png",
        contributions: ""
    },
    {
        id: "hunter-van-mersbergen",
        name: "Hunter Van Mersbergen",
        role: "Design Member",
        subsystems: ["Design"],
        status: "active",
        gradYear: 2028,
        major: "Computer Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/hunter-van-mersbergen/",
    },
    {
        id: "adam-erdmann",
        name: "Adam Erdmann",
        role: "Notebook Manager",
        subsystems: ["Eboard"],
        status: "active",
        gradYear: 2029,
        major: "Software Engineering",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/adamerdmann/",
    }
];

export default members;

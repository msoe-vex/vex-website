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
        linkedin: "https://www.linkedin.com/in/paulmajka/"
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
        linkedin: "https://www.linkedin.com/in/m-griesbach/"
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
        linkedin: "https://www.linkedin.com/in/aneedham0577/"
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
        subsystems: ["Eboard", "Design"],
        status: "active",
        gradYear: 2028,
        major: "Mechanical Engineering",
        image: "/assets/members/jacob-mcgovern.jpg"
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
        name: "Corbin Schaffer",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2028,
        major: "Computer Science",
        image: "/members/corbin-schaffer.jpg",
        github: "https://github.com/IVemesisRunner",
        linkedin: "https://www.linkedin.com/in/corbin-schaffer-1b0a4b1b9/",
        contributions: "2nd year member, that works on the AI game layout and strategy.\n"
    },
{
        id: "avery-benjamin",
        name: "Avery Benjamin",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2030,
        major: "Computer Science",
        image: "/assets/members/avery-benjamin.jpg",
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
        image: "/members/landon-van-mersbergen.png",
        linkedin: "https://www.linkedin.com/in/landon-van-mersbergen/"
    },
{
        id: "tyler-dretske",
        name: "Tyler Dretske",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2030,
        major: "Computer Science",
        image: "/branding/RR_Icon.png",
        linkedin: "https://www.linkedin.com/in/tyler-dretske/"
    },
{
        id: "charles-malohn",
        name: "Charles Malohn",
        role: "Controls Member",
        subsystems: ["Controls"],
        status: "active",
        gradYear: 2029,
        major: "Computer Engineering",
        image: "/members/charles-malohn.jpg",
        github: "https://github.com/CMalohn16",
        linkedin: "https://www.linkedin.com/in/6charles-malohn6/"
    },
{
        id: "ben-reiser",
        name: "Ben Reiser",
        role: "Strategist",
        subsystems: ["Eboard", "Design"],
        status: "active",
        gradYear: 2030,
        major: "Industrial Engineering",
        image: "/members/ben-reiser.jpg",
        linkedin: "https://www.linkedin.com/in/benjreiser/"
    },
{
        id: "david-mews",
        name: "David Mews",
        role: "Design Member",
        subsystems: ["Design"],
        status: "active",
        image: "/branding/RR_Icon.png"
    },
{
        id: "harlan-danes",
        name: "Harlan Danes",
        role: "Design Member",
        subsystems: ["Design"],
        status: "active",
        gradYear: 2030,
        image: "/branding/RR_Icon.png"
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
        linkedin: "https://www.linkedin.com/in/hunter-van-mersbergen/"
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
        linkedin: "https://www.linkedin.com/in/adamerdmann/"
    }
];

export default members;

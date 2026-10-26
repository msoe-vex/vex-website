"use client";

import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useSyncExternalStore,
} from "react";
import initialMembers, { Member } from "@/app/data/members";
import initialProjects, { Project } from "@/app/data/projects";
import { recurringEvents as initRecurring, customEvents as initCustom, RecurringEvent, CustomEvent } from "@/app/data/events";
import { meetingAnnouncement as initAnnouncement } from "@/app/data/announcements";
import initialSponsors, { Sponsor } from "@/app/data/sponsors";
import initialLocales, { locales as rawLocales } from "@/app/data/locales";

import {
    getStoredToken,
    saveStoredToken,
    clearStoredToken,
    verifyGitHubAuth,
    exchangeOAuthCode,
    AuthStatus,
    TARGET_ORG,
} from "./auth/githubAuth";

import DashboardHeader from "./components/DashboardHeader";
import AuthGate from "./components/AuthGate";
import MembersEditor from "./components/MembersEditor";
import ProjectsEditor from "./components/ProjectsEditor";
import EventsEditor from "./components/EventsEditor";
import AnnouncementsEditor from "./components/AnnouncementsEditor";
import SponsorsEditor from "./components/SponsorsEditor";
import LocalesEditor from "./components/LocalesEditor";
import DiffReviewModal, { PendingFileChange } from "./components/DiffReviewModal";
import type { PendingUpload } from "./components/ImageUploader";

import {
    generateMembersTs,
    generateProjectsTs,
    generateEventsTs,
    generateAnnouncementsTs,
    generateSponsorsTs,
    generateLocalesTs,
} from "./generators/codeGenerators";

const emptySubscribe = () => () => {};

function useIsClient() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

type DashboardTab = "members" | "projects" | "events" | "announcements" | "sponsors" | "locales";

export default function DashboardPage() {
    const isClient = useIsClient();

    // Auth State
    const [auth, setAuth] = useState<AuthStatus>({
        isAuthenticated: false,
        isAuthorized: false,
        user: null,
        orgName: TARGET_ORG,
        loading: true,
    });
    const [token, setToken] = useState<string>("");

    // Active Tab
    const [activeTab, setActiveTab] = useState<DashboardTab>("members");

    // Content State
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>(initRecurring);
    const [customEvents, setCustomEvents] = useState<CustomEvent[]>(initCustom);
    const [showBanner, setShowBanner] = useState<boolean>(initAnnouncement.show);
    const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
    const [locales, setLocales] = useState<typeof rawLocales>(initialLocales);

    // Dynamic Baseline State (updated after PR creation to allow successive PRs)
    const [baselineMembers, setBaselineMembers] = useState<Member[]>(initialMembers);
    const [baselineProjects, setBaselineProjects] = useState<Project[]>(initialProjects);
    const [baselineRecurring, setBaselineRecurring] = useState<RecurringEvent[]>(initRecurring);
    const [baselineCustom, setBaselineCustom] = useState<CustomEvent[]>(initCustom);
    const [baselineBanner, setBaselineBanner] = useState<boolean>(initAnnouncement.show);
    const [baselineSponsors, setBaselineSponsors] = useState<Sponsor[]>(initialSponsors);
    const [baselineLocales, setBaselineLocales] = useState<typeof rawLocales>(initialLocales);

    // Media Uploads
    const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

    // Review Modal Session
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [prSessionId, setPrSessionId] = useState(0);
    const [discardCounter, setDiscardCounter] = useState(0);

    // Initial Auth Check & OAuth Code Callback
    useEffect(() => {
        const checkAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            if (code) {
                // Clear code parameter from URL
                window.history.replaceState({}, document.title, window.location.pathname);
                try {
                    const receivedToken = await exchangeOAuthCode(code);
                    saveStoredToken(receivedToken);
                    setToken(receivedToken);
                    const res = await verifyGitHubAuth(receivedToken);
                    setAuth({ ...res, loading: false });
                } catch (err: unknown) {
                    setAuth({
                        isAuthenticated: false,
                        isAuthorized: false,
                        user: null,
                        orgName: TARGET_ORG,
                        error: err instanceof Error ? err.message : "GitHub OAuth failed",
                        loading: false,
                    });
                }
                return;
            }

            const stored = getStoredToken();
            if (stored) {
                setToken(stored);
                const res = await verifyGitHubAuth(stored);
                setAuth({ ...res, loading: false });
            } else {
                setAuth((prev) => ({ ...prev, loading: false }));
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (newToken: string) => {
        setAuth((prev) => ({ ...prev, loading: true, error: undefined }));
        const res = await verifyGitHubAuth(newToken);
        if (res.isAuthenticated && res.isAuthorized) {
            saveStoredToken(newToken);
            setToken(newToken);
        }
        setAuth({ ...res, loading: false });
    };

    const handleSignOut = () => {
        clearStoredToken();
        setToken("");
        setAuth({
            isAuthenticated: false,
            isAuthorized: false,
            user: null,
            orgName: TARGET_ORG,
            loading: false,
        });
    };

    // Track Image Uploads
    const recordUpload = useCallback((upload?: PendingUpload) => {
        if (!upload) return;
        setPendingUploads((prev) => {
            const filtered = prev.filter((u) => u.targetPath !== upload.targetPath);
            return [...filtered, upload];
        });
    }, []);

    // Change Detection & File Changes
    const pendingChanges = useMemo<PendingFileChange[]>(() => {
        const changes: PendingFileChange[] = [];

        // 1. Members
        if (JSON.stringify(members) !== JSON.stringify(baselineMembers)) {
            changes.push({
                filePath: "app/data/members.ts",
                description: `Updated team roster (${members.length} members)`,
                generatedContent: generateMembersTs(members),
            });
        }

        // 2. Projects
        if (JSON.stringify(projects) !== JSON.stringify(baselineProjects)) {
            changes.push({
                filePath: "app/data/projects.ts",
                description: `Updated robot catalog (${projects.length} projects)`,
                generatedContent: generateProjectsTs(projects),
            });
        }

        // 3. Events
        if (
            JSON.stringify(recurringEvents) !== JSON.stringify(baselineRecurring) ||
            JSON.stringify(customEvents) !== JSON.stringify(baselineCustom)
        ) {
            changes.push({
                filePath: "app/data/events.ts",
                description: `Updated events & meetings (${recurringEvents.length} recurring, ${customEvents.length} custom)`,
                generatedContent: generateEventsTs(recurringEvents, customEvents),
            });
        }

        // 4. Announcements
        if (showBanner !== baselineBanner) {
            changes.push({
                filePath: "app/data/announcements.ts",
                description: `Updated meeting banner visibility (show: ${showBanner})`,
                generatedContent: generateAnnouncementsTs(showBanner),
            });
        }

        // 5. Sponsors
        if (JSON.stringify(sponsors) !== JSON.stringify(baselineSponsors)) {
            changes.push({
                filePath: "app/data/sponsors.ts",
                description: `Updated sponsor partners (${sponsors.length} sponsors)`,
                generatedContent: generateSponsorsTs(sponsors),
            });
        }

        // 6. Locales
        if (JSON.stringify(locales) !== JSON.stringify(baselineLocales)) {
            changes.push({
                filePath: "app/data/locales.ts",
                description: `Updated site copy and mission texts`,
                generatedContent: generateLocalesTs(locales),
            });
        }

        return changes;
    }, [
        members,
        baselineMembers,
        projects,
        baselineProjects,
        recurringEvents,
        baselineRecurring,
        customEvents,
        baselineCustom,
        showBanner,
        baselineBanner,
        sponsors,
        baselineSponsors,
        locales,
        baselineLocales,
    ]);

    // Only commit uploads that are actively referenced in current state
    const activeUploads = useMemo(() => {
        return pendingUploads.filter((u) => {
            const webPath = u.targetPath.replace(/^public/, "");
            const inMembers = members.some((m) => m.image === webPath);
            const inProjects = projects.some((p) => p.image === webPath);
            const inSponsors = sponsors.some(
                (s) => s.img === webPath || `/sponsors/${s.img}` === webPath || s.img === webPath.replace(/^\/sponsors\//, "")
            );
            return inMembers || inProjects || inSponsors;
        });
    }, [pendingUploads, members, projects, sponsors]);

    const totalModifiedCount = pendingChanges.length + activeUploads.length;

    const handlePrSuccess = () => {
        // Reset diff baselines to current edited values so user can make another PR immediately
        setBaselineMembers(JSON.parse(JSON.stringify(members)));
        setBaselineProjects(JSON.parse(JSON.stringify(projects)));
        setBaselineRecurring(JSON.parse(JSON.stringify(recurringEvents)));
        setBaselineCustom(JSON.parse(JSON.stringify(customEvents)));
        setBaselineBanner(showBanner);
        setBaselineSponsors(JSON.parse(JSON.stringify(sponsors)));
        setBaselineLocales(JSON.parse(JSON.stringify(locales)));
        // Clear pending uploads
        setPendingUploads([]);
        // Force the next review modal mount to be completely clean
        setPrSessionId((prev) => prev + 1);
    };

    const handleDiscard = () => {
        // Revert all edited states back to the last submitted baseline
        setMembers(JSON.parse(JSON.stringify(baselineMembers)));
        setProjects(JSON.parse(JSON.stringify(baselineProjects)));
        setRecurringEvents(JSON.parse(JSON.stringify(baselineRecurring)));
        setCustomEvents(JSON.parse(JSON.stringify(baselineCustom)));
        setShowBanner(baselineBanner);
        setSponsors(JSON.parse(JSON.stringify(baselineSponsors)));
        setLocales(JSON.parse(JSON.stringify(baselineLocales)));
        // Clear any staged media uploads
        setPendingUploads([]);
        // Remount active editor to clear internal preview caches
        setDiscardCounter((prev) => prev + 1);
    };

    // If not hydrated on client yet or loading initial auth
    if (!isClient || auth.loading) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <span className="animate-spin inline-block w-8 h-8 border-4 border-[#c5050c] border-t-transparent rounded-full" />
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">
                        Checking Organization Access...
                    </span>
                </div>
            </div>
        );
    }

    // If not authenticated or not authorized in msoe-vex
    if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
        return (
            <AuthGate
                onLogin={handleLogin}
                loading={Boolean(auth.loading)}
                error={auth.error}
            />
        );
    }

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
            {/* Top Bar Header */}
            <DashboardHeader
                user={auth.user}
                onSignOut={handleSignOut}
                modifiedCount={totalModifiedCount}
                onOpenReview={() => setIsReviewOpen(true)}
                onDiscard={handleDiscard}
            />

            {/* Main Tabs Navigation */}
            <div className="bg-[#111113] border-b border-[#2b2b2b] px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
                    {[
                        { id: "members", label: "Team Members", count: members.length },
                        { id: "projects", label: "Robots & Projects", count: projects.length },
                        { id: "events", label: "Calendar & Meetings", count: recurringEvents.length + customEvents.length },
                        { id: "announcements", label: "Meeting Banner", count: showBanner ? 1 : 0 },
                        { id: "sponsors", label: "Sponsors & Partners", count: sponsors.length },
                        { id: "locales", label: "Site Copy (Locales)" },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as DashboardTab)}
                                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border-b-2 ${
                                    isActive
                                        ? "border-[#c5050c] text-white bg-[#1a1a1d]"
                                        : "border-transparent text-gray-400 hover:text-white hover:bg-[#161618]"
                                }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span className="text-[10px] bg-[#26262a] text-gray-400 px-1.5 py-0.2 rounded-full font-mono">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dashboard Content Container */}
            <div key={discardCounter} className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
                {activeTab === "members" && (
                    <MembersEditor
                        members={members}
                        onChange={(updated, upload) => {
                            setMembers(updated);
                            recordUpload(upload);
                        }}
                    />
                )}

                {activeTab === "projects" && (
                    <ProjectsEditor
                        projects={projects}
                        onChange={(updated, upload) => {
                            setProjects(updated);
                            recordUpload(upload);
                        }}
                    />
                )}

                {activeTab === "events" && (
                    <EventsEditor
                        recurringEvents={recurringEvents}
                        customEvents={customEvents}
                        onChange={(recurring, custom) => {
                            setRecurringEvents(recurring);
                            setCustomEvents(custom);
                        }}
                    />
                )}

                {activeTab === "announcements" && (
                    <AnnouncementsEditor
                        showBanner={showBanner}
                        onChange={(show) => setShowBanner(show)}
                    />
                )}

                {activeTab === "sponsors" && (
                    <SponsorsEditor
                        sponsors={sponsors}
                        onChange={(updated, upload) => {
                            setSponsors(updated);
                            recordUpload(upload);
                        }}
                    />
                )}

                {activeTab === "locales" && (
                    <LocalesEditor
                        locales={locales}
                        onChange={(updated) => setLocales(updated)}
                    />
                )}
            </div>

            {/* Review & PR Submission Modal */}
            {isReviewOpen && (
                <DiffReviewModal
                    key={prSessionId}
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    token={token}
                    pendingChanges={pendingChanges}
                    pendingUploads={activeUploads}
                    onPrCreatedSuccess={handlePrSuccess}
                />
            )}
        </main>
    );
}

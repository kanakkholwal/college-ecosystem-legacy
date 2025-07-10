import { NumberTicker } from "@/components/animation/number-ticker";
import { StatsCard } from "@/components/application/stats-card";
import { ForbiddenPage } from "@/components/common/not-authorized";
import { notFound } from "next/navigation";
import { getClubBySubDomain, getClubStats } from "~/actions/clubs";
import { ROLES } from "~/constants";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";



export default async function ClubDashboardPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>
}) {
    const { slug } = await params;
    const club = await getClubBySubDomain(slug);
    if (!club) {
        return notFound();
    }
    const session = (await getSession()) as Session;
    if (
        !club.members.includes(session.user.id) && !club.president.email.includes(session.user.email)
        && session.user.role !== ROLES.ADMIN
    ) {
        return <ForbiddenPage />;
    }
    const clubStats = await getClubStats(club._id.toString());

    return (
        <div className="space-y-6 my-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-1.5 @4xl:pr-0">

                <StatsCard
                    title="Total Members"
                    Icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <title>Users</title>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                >
                    <NumberTicker
                        value={clubStats.members}
                        className="text-3xl font-bold text-primary"
                    />

                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Members</span> in this club
                    </p>
                </StatsCard>
                <StatsCard
                    title="Total Events"
                    Icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <title>Events</title>
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                            <path d="M12 6v6l4.5 2.25" />
                        </svg>
                    }
                >
                    <NumberTicker
                        value={clubStats.events}
                        className="text-3xl font-bold text-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Events</span> organized by this club
                    </p>
                </StatsCard>
                <StatsCard
                    title="Total Projects"
                    Icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <title>Projects</title>
                            <path d="M12 2l9 5v10a7 7 0 1 1-14 0V7l5-3z" />
                            <path d="M9 21v-6a3 3 0 1 1 6 0v6" />
                        </svg>
                    }
                >
                    <NumberTicker
                        value={clubStats.projects}
                        className="text-3xl font-bold text-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Projects</span> initiated by this club
                    </p>
                </StatsCard>
            </div>
        </div>
    );
}

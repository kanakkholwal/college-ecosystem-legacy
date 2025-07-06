import ClubLandingPageClient, { ClubLandingClientProps } from "@/components/clubs/landing";
import { notFound } from "next/navigation";
import { getClubBySubDomain } from "~/actions/clubs";

interface ClubLandingPageProps {
    params: Promise<{ slug: string }>;
}
export default async function ClubLandingPage({ params }: ClubLandingPageProps) {
    const club = await getClubBySubDomain((await params).slug);
    if (!club) {
        return notFound();
    }
    const clubData: ClubLandingClientProps["clubData"] = {
        ...club,
        _id: club._id.toString(),
        stats: {
            members: club.members.length,
            events: 0,
            projects: 0,
        },
        upcomingEvents: [],
    };
    return (
        <ClubLandingPageClient clubData={clubData} />
    );
}
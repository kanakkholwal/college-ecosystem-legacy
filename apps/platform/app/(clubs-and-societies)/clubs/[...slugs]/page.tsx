import ClubLandingPageClient, { ClubLandingClientProps } from "@/components/clubs/landing";
import { ClubsLandingUI } from "@/layouts/clubs";
import { notFound } from "next/navigation";
import { getClubBySubDomain } from "~/actions/clubs";

interface ClubLandingPageProps {
    params: Promise<{ slugs: string[] }>;
}


export default async function ClubLandingPage({ params }: ClubLandingPageProps) {
    const slugs = await params;
    const clubSubDomain = slugs.slugs[0];
    if (!clubSubDomain) {
        return notFound();
    }
    const club = await getClubBySubDomain(clubSubDomain);
    if (!club) {
        return notFound();
    }
    const LandingUI = ClubsLandingUI[clubSubDomain as keyof typeof ClubsLandingUI];
    if (!LandingUI) {
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
    const LandingComponent = LandingUI.landing;

    return (
        <LandingComponent club={club} />
    );
}
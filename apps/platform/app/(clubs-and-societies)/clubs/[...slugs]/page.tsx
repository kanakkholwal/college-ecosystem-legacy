import ClubLandingPageClient, { ClubLandingClientProps } from "@/components/clubs/landing";
import { ClubsSettingsMap, ClubsUIMap } from "@/layouts/clubs";
import { notFound } from "next/navigation";
import { getClubBySubDomain } from "~/actions/clubs";
import { clubSubPaths } from "~/constants/clubs";

interface ClubLandingPageProps {
    params: Promise<{ slugs: string[] }>;
}


export default async function ClubLandingPage({ params }: ClubLandingPageProps) {
    const slugs = await params;
    const [clubSubDomain, ...rest] = slugs.slugs;
    const subPath = rest.length > 0 ? clubSubPaths.find(path => path === rest[0]) : "landing";
    if (
        !clubSubDomain || (rest.length > 0 && !subPath)

    ) {
        return notFound();
    }


    const club = await getClubBySubDomain(clubSubDomain);
    if (!club) {
        return notFound();
    }
    // temporarily handle the case where club is not found
    if (!club.connectedSocials) {
        club.connectedSocials = {
            github: "https://github.com/",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            // website: "https://example.com",
        }
    }
    const PageUI = ClubsUIMap[clubSubDomain as keyof typeof ClubsUIMap];
    if (!PageUI) {
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
    const PageComponent = PageUI[subPath as keyof typeof PageUI];
    if (!PageComponent) {
        return notFound();
    }
    const clubSettings = ClubsSettingsMap[clubSubDomain as keyof typeof ClubsSettingsMap];

    return (
        <PageComponent club={club} clubSettings={clubSettings} />
    );
}
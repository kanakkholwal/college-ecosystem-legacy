import { ClubsSettingsMap } from "@/layouts/clubs";

interface ClubLandingPageProps {
    params: Promise<{ slugs: string[] }>;
    children: React.ReactNode;
}


export default async function ClubUILayout({ params,children }: ClubLandingPageProps) {
    const slugs = await params;


    const clubSettings = ClubsSettingsMap[slugs.slugs[0] as keyof typeof ClubsSettingsMap];
    if (!clubSettings) {
        return children
    }

    return (
        <div  style={{
                ...clubSettings.themeVariables,
                ...clubSettings.font.style
            }}
        >
            {children}
        </div>
    );
}
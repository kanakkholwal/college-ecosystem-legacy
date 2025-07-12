import { z } from "zod";
import { clubSchema } from "~/constants/clubs";



// settings
import { NavLinksType } from "@/components/common/resizable-navbar";
import { IconType } from "@/components/icons";
import { NextFont } from "next/dist/compiled/@next/font";
import { StaticImageData } from "next/image";
import * as dscSettings from "./dsc/constants";

// clubs
// dsc
import DscLandingPage from "./dsc/landing";
import DscProjectPage from "./dsc/projects";
import DscTeamPage from "./dsc/team";



// Constants
export const ClubsSettingsMap = {
    "dsc": {
        logos: dscSettings.logos,
        font: dscSettings.productSans,
        themeVariables: dscSettings.themeVariables,
        clubLogo: dscSettings.clubLogo,
        navLinks: [
            {
                title: "Projects",
                href: "projects",
                type: "link"
            },
            {
                title: "Team",
                href: "team",
                type: "link"
            },
            {
                title: "Workshops",
                href: "workshops",
                type: "link"
            }
        ]
    },

} as const satisfies ClubSettings;

export const ClubsUIMap = {
    "dsc": {
        landing: DscLandingPage,
        team: DscTeamPage,
        projects:DscProjectPage
    },
} as const satisfies ClubMap;


// Types 

const settingSchema = z.object({
    logos: z.array(z.object({
        icon: z.custom<IconType>().describe("The icon name for the logo"),
        className: z.string().describe("The CSS class for styling the logo"),
        name: z.string().describe("The name of the logo category")
    })),
    font: z.custom<NextFont>().describe("The custom font used in the club"),
    themeVariables: z.custom<React.CSSProperties>().describe("CSS variables for theming the club"),
    clubLogo: z.union([
        z.string().url().describe("URL of the club logo"),
        z.custom<StaticImageData>().describe("Static image data for the club logo")
    ]).describe("The logo of the club"),
    navLinks: z.custom<NavLinksType[]>().describe("Navigation links for the club")
})
const propsSchema = {
    landing: z.object({
        club: clubSchema.extend({
            _id: z.string().describe("The unique identifier for the club"),
        }),
        clubSettings: settingSchema
    }),
    team: z.object({
        club: clubSchema.extend({
            _id: z.string().describe("The unique identifier for the club"),
        }),
        clubSettings: settingSchema
    }),
    projects: z.object({
        club: clubSchema.extend({
            _id: z.string().describe("The unique identifier for the club"),
        }),
        clubSettings: settingSchema
    })
}

export type PropsType = {
    landing: z.infer<typeof propsSchema.landing>;
    team: z.infer<typeof propsSchema.team>;
    projects: z.infer<typeof propsSchema.projects>;
}

// type ClubMapping = {
//     [K in keyof typeof clubSubPaths[number]]: React.FC<PropsType[keyof PropsType]>;
// };

export type ClubMap = {

    [key: string]: {
        landing: React.FC<PropsType["landing"]>;
        team: React.FC<PropsType["team"]>;
        projects: React.FC<PropsType["projects"]>;
    };
}
export type ClubSettings = {
    [K in keyof typeof ClubsUIMap]: z.infer<typeof settingSchema>
}
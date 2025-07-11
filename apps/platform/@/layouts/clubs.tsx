import { z } from "zod";
import { clubSchema } from "~/constants/clubs";


// layouts
// dsc
import DscLandingPage from "./dsc/landing";
// clubs
export const ClubsLandingUI = {
    "dsc": {
        landing: DscLandingPage
    }
} as const satisfies ClubMap;

const propsSchema = {
    landing: z.object({
        club: clubSchema.extend({
            _id: z.string().describe("The unique identifier for the club"),
        })
    })
}

export type PropsType = {
    landing: z.infer<typeof propsSchema.landing>;
}

export type ClubMap = {
    [key: string]: {
        landing: React.FC<PropsType["landing"]>;
    };
}
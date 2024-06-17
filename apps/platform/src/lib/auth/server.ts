import { authOptions } from "app/api/auth/[...nextauth]/options";

import { getServerSession } from "next-auth/next";
import { sessionType } from "src/types/session";

export const getSession = async (): Promise<sessionType | null> => {
    return await getServerSession(authOptions);
}

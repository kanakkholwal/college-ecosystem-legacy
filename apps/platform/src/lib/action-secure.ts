import { getSession } from "~/lib/auth-server";


const permissionsMap = new Map([
    [
        "admin",
        ["createHostel", "createHostelStudent", "updateHostel"]
    ],
])


export async function actionSecure(funcName: string) : Promise<boolean> {
    const session = await getSession();
    if (!session|| !session.user) {
        return false;
    }
    const roles = [...session.user.other_roles, session.user.role]
    for (const role of roles) {
        if (permissionsMap.get(role)?.includes(funcName)) {
            return true;
        }
    }
    return false;

}
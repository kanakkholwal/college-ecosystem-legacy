import "next-auth";
import { sessionUserType } from "src/types/session";

declare module "next-auth" {
    export interface Session extends DefaultSession {
        user: sessionUserType,
        expires: string
    }
    export interface User extends sessionUserType {}
}
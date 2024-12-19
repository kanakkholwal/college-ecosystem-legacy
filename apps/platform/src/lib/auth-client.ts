import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;

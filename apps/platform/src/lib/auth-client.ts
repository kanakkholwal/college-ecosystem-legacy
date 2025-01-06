import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>({
      users:{
        role: {
          type: "string",
        },
        other_roles: {
          type: "string[]",
        },
        gender: {
          type: "string",
        },
        username: {
          type: "string",
        },
        department: {
          type: "string",
        },
      },
    }),
  ],
});

export const { signIn, signUp, useSession, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;

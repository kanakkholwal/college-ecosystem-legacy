import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { DEPARTMENTS } from "src/constants/departments";
import { ROLES } from "src/constants/user";
import { db } from "src/db/connect"; // your drizzle instance
import { accounts, sessions, users } from "src/db/schema";
import Result from "src/models/result";
import dbConnect from "./dbConnect";

export const auth = betterAuth({
  appName: "College Platform",
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),
  databaseHooks: {
    // user:{
    //     create: async (user) => {
    //         return {
    //             ...user,
    //         }
    //     }
    // }
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    autoSignIn: true,
  },
  // emailVerification: {
  //     sendOnSignUp: true
  // },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      mapProfileToUser: async (profile) => {
        await dbConnect();
        const result = await Result.findOne({
          rollNo: profile.email.toLowerCase().split("@")[0],
        });

        return {
          name: result.name,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        required: false,
        enums: ROLES,
        input: false,
      },
      other_roles: {
        type: "string[]",
        default: [],
        required: false,
        enums: ROLES,
        input: false,
      },
      gender: {
        type: "string",
        default: "",
        input: true,
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      department: {
        type: "string",
        required: true,
        enums: DEPARTMENTS,
        input: true,
      },
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },

  advanced: {
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? "nith.eu.org" : undefined,
    },
  },
  plugins: [admin(), nextCookies()], // make sure this is the last plugin (nextCookies) in the array
});

export type Session = typeof auth.$Infer.Session;
